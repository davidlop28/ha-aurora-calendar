"""Config flow for Aurora Calendar."""
from __future__ import annotations

import logging
import re
from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry, ConfigFlow, OptionsFlow
from homeassistant.core import callback
try:
    from homeassistant.data_entry_flow import section
except ImportError:  # pragma: no cover - compatibility with older HA cores
    def section(schema: vol.Schema, options: dict[str, Any] | None = None) -> vol.Schema:
        """Fallback for HA versions without data-entry sections."""
        return schema
from homeassistant.helpers.selector import (
    EntitySelector,
    EntitySelectorConfig,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
    TextSelectorConfig,
    TextSelectorType,
)
from homeassistant.helpers import entity_registry as er

from . import DOMAIN
from .coordinator import _KNOWN_COLORS, _entity_to_person

_LOGGER = logging.getLogger(__name__)

# Default palette for new calendars without a known color
_DEFAULT_COLORS = [
    "#93C5FD", "#86EFAC", "#FCA5A5", "#FCD34D",
    "#C4B5FD", "#6EE7B7", "#FDA4AF", "#A5F3FC",
]


class AuroraCalendarConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Aurora Calendar."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> dict:
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            return self.async_create_entry(
                title=user_input["name"],
                data={"name": user_input["name"]},
                options={"calendars": [], "weather_entity": ""},
            )

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({vol.Required("name", default="Aurora Calendar"): str}),
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> AuroraCalendarOptionsFlow:
        return AuroraCalendarOptionsFlow(config_entry)


class AuroraCalendarOptionsFlow(OptionsFlow):
    """Two-step options flow: pick calendars → set person names & colors."""

    def __init__(self, config_entry: ConfigEntry) -> None:
        self._config_entry = config_entry
        self._existing: dict[str, dict] = {
            c["entity_id"]: c
            for c in config_entry.options.get("calendars", [])
        }
        self._selected_entities: list[str] = []
        self._weather_entity: str = config_entry.options.get("weather_entity", "")

    # ------------------------------------------------------------------
    # Step 1 — choose calendars + weather
    # ------------------------------------------------------------------

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> dict:
        return await self.async_step_calendars(user_input)

    async def async_step_calendars(
        self, user_input: dict[str, Any] | None = None
    ) -> dict:
        errors: dict[str, str] = {}
        if user_input is not None:
            selected = [e for e in user_input.get("calendar_entities", []) if e]
            if not selected:
                errors["calendar_entities"] = "no_calendars_selected"
            else:
                self._selected_entities = selected
                self._weather_entity = user_input.get("weather_entity", "") or ""
                return await self.async_step_details()

        schema = vol.Schema(
            {
                vol.Optional(
                    "calendar_entities",
                    default=list(self._existing.keys()),
                ): vol.All(
                    _drop_empty,
                    EntitySelector(EntitySelectorConfig(domain="calendar", multiple=True)),
                ),
                vol.Optional(
                    "weather_entity",
                    default=self._weather_entity,
                ): EntitySelector(EntitySelectorConfig(domain="weather", multiple=False)),
            }
        )
        return self.async_show_form(
            step_id="calendars",
            data_schema=schema,
            errors=errors,
        )

    # ------------------------------------------------------------------
    # Step 2 — person name + color per calendar
    # ------------------------------------------------------------------

    async def async_step_details(
        self, user_input: dict[str, Any] | None = None
    ) -> dict:
        if user_input is not None:
            calendars = []
            for idx, entity_id in enumerate(self._selected_entities):
                existing = self._existing.get(entity_id, {})
                section_key = _section_key(idx)
                section_input = user_input.get(section_key, {})
                person = (
                    section_input.get("display_name")
                    or existing.get("person")
                    or _entity_to_person(entity_id)
                ).strip()
                color = (
                    section_input.get("override_color")
                    or existing.get("override_color")
                    or existing.get("color")
                    or _default_color(entity_id, idx)
                ).strip()
                color_mode = (
                    section_input.get("color_mode")
                    or existing.get("color_mode")
                    or "override"
                )
                if color_mode == "source" and not _calendar_source_color(self.hass, entity_id):
                    color_mode = "override"
                person_entity_id = (
                    section_input.get("person_entity_id")
                    or existing.get("person_entity_id")
                    or ""
                )
                calendars.append(
                    {
                        "entity_id": entity_id,
                        "person": person,
                        "color_mode": color_mode,
                        "override_color": color,
                        # Keep old option data readable for older card builds.
                        "color": color,
                        "person_entity_id": person_entity_id,
                        "avatar": existing.get("avatar", ""),
                    }
                )
            return self.async_create_entry(
                title="",
                data={"calendars": calendars, "weather_entity": self._weather_entity},
            )

        fields: dict[Any, Any] = {}
        for idx, entity_id in enumerate(self._selected_entities):
            existing = self._existing.get(entity_id, {})
            default_person = existing.get("person") or _entity_to_person(entity_id)
            default_color = (
                existing.get("override_color")
                or existing.get("color")
                or _default_color(entity_id, idx)
            )
            source_color = _calendar_source_color(self.hass, entity_id)
            default_color_mode = existing.get("color_mode") or ("source" if source_color else "override")
            if default_color_mode == "source" and not source_color:
                default_color_mode = "override"
            color_mode_options = [{"value": "override", "label": "Override color"}]
            if source_color:
                color_mode_options.insert(
                    0,
                    {"value": "source", "label": f"Calendar color ({source_color})"},
                )
            default_person_entity = existing.get("person_entity_id", "")
            section_key = _section_key(idx)
            person_entity_field = (
                vol.Optional(
                    "person_entity_id",
                    description={"suggested_value": default_person_entity},
                )
                if default_person_entity
                else vol.Optional("person_entity_id")
            )

            fields[vol.Required(section_key)] = section(
                vol.Schema(
                    {
                        vol.Optional("calendar_entity", default=entity_id): EntitySelector(
                            EntitySelectorConfig(
                                domain="calendar",
                                multiple=False,
                                read_only=True,
                            )
                        ),
                        vol.Optional("display_name", default=default_person): TextSelector(
                            TextSelectorConfig(type=TextSelectorType.TEXT)
                        ),
                        vol.Optional("color_mode", default=default_color_mode): SelectSelector(
                            SelectSelectorConfig(
                                options=color_mode_options,
                                mode=SelectSelectorMode.LIST,
                            )
                        ),
                        vol.Optional("override_color", default=default_color): TextSelector(
                            TextSelectorConfig(type=TextSelectorType.COLOR)
                        ),
                        person_entity_field: EntitySelector(
                            EntitySelectorConfig(domain="person", multiple=False)
                        ),
                    }
                ),
                {"collapsed": idx != 0},
            )

        return self.async_show_form(
            step_id="details",
            data_schema=vol.Schema(fields),
            description_placeholders={
                "calendars": ", ".join(self._selected_entities)
            },
        )


def _drop_empty(value: Any) -> Any:
    """Strip empty entries from a list before downstream validation."""
    if isinstance(value, list):
        return [v for v in value if v]
    return value


def _safe_key(entity_id: str) -> str:
    """Convert an entity_id to a safe form-field key."""
    return re.sub(r"[^a-z0-9]+", "_", entity_id.lower()).strip("_")


def _section_key(idx: int) -> str:
    """Build a stable section key for a selected calendar."""
    return f"calendar_{idx + 1}"


def _calendar_source_color(hass, entity_id: str) -> str:
    """Return the HA calendar entity color option, if available."""
    registry = er.async_get(hass)
    entity_entry = registry.async_get(entity_id)
    if not entity_entry:
        return ""

    calendar_options = entity_entry.options.get("calendar", {})
    color = calendar_options.get("color", "")
    return color if isinstance(color, str) else ""


def _default_color(entity_id: str, idx: int) -> str:
    return _KNOWN_COLORS.get(entity_id) or _DEFAULT_COLORS[idx % len(_DEFAULT_COLORS)]
