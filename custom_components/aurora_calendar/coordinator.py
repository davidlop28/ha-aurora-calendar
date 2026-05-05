"""DataUpdateCoordinator for Aurora Calendar."""
from __future__ import annotations

import logging
import re
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

_LOGGER = logging.getLogger(__name__)

VIEW_MODES = ["Month", "Week", "Biweek", "Today", "Next 7 Days"]
DEFAULT_VIEW_MODE = "Month"

# Pre-seeded from existing HA input_text color entities
_KNOWN_COLORS: dict[str, str] = {
    "calendar.david": "#b5d2e3",
    "calendar.gloria": "#e0def9",
    "calendar.jonathan": "#bfdbc7",
    "calendar.jacob": "#f9e0de",
    "calendar.family": "#fbb1a8",
    "calendar.fishing_creek_elementary_calendar": "#fff9db",
}

_PALETTE = [
    "#93C5FD", "#86EFAC", "#FCA5A5", "#FCD34D",
    "#C4B5FD", "#6EE7B7", "#FDA4AF", "#A5F3FC",
]


def _entity_to_person(entity_id: str) -> str:
    return entity_id.removeprefix("calendar.").replace("_", " ").title()


def _person_slug(person: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", person.lower()).strip("_")


class AuroraCalendarCoordinator(DataUpdateCoordinator):
    """Holds shared config and per-person filter state.

    View mode and offset are owned by the card (per-user local state).
    This coordinator only tracks what is intentionally shared across all users:
    calendar configuration and the family-wide filter toggles.
    """

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        super().__init__(hass, _LOGGER, name="Aurora Calendar")
        self.entry = entry
        self._filters: dict[str, bool] = {}  # person → visible; True by default

    # ------------------------------------------------------------------
    # Config-derived properties (read from entry options)
    # ------------------------------------------------------------------

    @property
    def calendars(self) -> list[dict]:
        calendars: list[dict] = []
        for idx, cal in enumerate(self.entry.options.get("calendars", [])):
            enriched = dict(cal)
            override_color = (
                enriched.get("override_color")
                or enriched.get("color")
                or _KNOWN_COLORS.get(enriched["entity_id"])
                or _PALETTE[idx % len(_PALETTE)]
            )
            source_color = self._calendar_source_color(enriched["entity_id"])
            color_mode = enriched.get("color_mode") or "override"
            effective_color = (
                source_color
                if color_mode == "source" and source_color
                else override_color
            )
            enriched["color_mode"] = color_mode
            enriched["override_color"] = override_color
            enriched["source_color"] = source_color
            enriched["effective_color"] = effective_color
            # Keep existing card builds compatible: color is always what Aurora renders.
            enriched["color"] = effective_color
            enriched["avatar"] = self._calendar_avatar(enriched)
            calendars.append(enriched)
        return calendars

    @property
    def weather_entity(self) -> str:
        return self.entry.options.get("weather_entity", "")

    @property
    def persons(self) -> list[dict]:
        """Deduplicated list of persons derived from the calendars config."""
        seen: dict[str, dict] = {}
        palette_idx = 0
        for cal in self.calendars:
            person = cal.get("person") or _entity_to_person(cal["entity_id"])
            if person in seen:
                continue
            color = (
                cal.get("color")
                or _KNOWN_COLORS.get(cal["entity_id"])
                or _PALETTE[palette_idx % len(_PALETTE)]
            )
            palette_idx += 1
            seen[person] = {
                "person": person,
                "slug": _person_slug(person),
                "color": color,
                "person_entity_id": cal.get("person_entity_id", ""),
                "avatar": cal.get("avatar", ""),
            }
        return list(seen.values())

    def _calendar_avatar(self, calendar: dict) -> str:
        """Return the explicit avatar or linked person entity picture."""
        if calendar.get("avatar"):
            return calendar["avatar"]

        person_entity_id = calendar.get("person_entity_id")
        if not person_entity_id:
            return ""

        person_state = self.hass.states.get(person_entity_id)
        if not person_state:
            return ""

        return person_state.attributes.get("entity_picture", "")

    def _calendar_source_color(self, entity_id: str) -> str:
        """Return the color exposed by the source calendar entity, if any."""
        registry = er.async_get(self.hass)
        entity_entry = registry.async_get(entity_id)
        if not entity_entry:
            return ""

        calendar_options = entity_entry.options.get("calendar", {})
        color = calendar_options.get("color", "")
        return color if isinstance(color, str) else ""

    # ------------------------------------------------------------------
    # Filter state (shared family-wide preference)
    # ------------------------------------------------------------------

    def is_filter_enabled(self, person: str) -> bool:
        return self._filters.get(person, True)

    async def async_set_filter(self, person: str, enabled: bool) -> None:
        self._filters[person] = enabled
        self.async_set_updated_data(self._build_data())

    async def async_toggle_filter(self, person: str) -> None:
        self._filters[person] = not self._filters.get(person, True)
        self.async_set_updated_data(self._build_data())

    # ------------------------------------------------------------------
    # Data assembly
    # ------------------------------------------------------------------

    def _build_data(self) -> dict[str, Any]:
        return {
            "calendars": self.calendars,
            "persons": self.persons,
            "filters": {p["person"]: self.is_filter_enabled(p["person"]) for p in self.persons},
            "weather_entity": self.weather_entity,
        }

    async def _async_update_data(self) -> dict[str, Any]:
        try:
            return self._build_data()
        except Exception as err:
            raise UpdateFailed(f"Aurora Calendar update failed: {err}") from err
