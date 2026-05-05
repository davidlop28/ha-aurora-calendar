"""Aurora Calendar integration."""
from __future__ import annotations

import logging
from pathlib import Path

import voluptuous as vol

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall
import homeassistant.helpers.config_validation as cv
from homeassistant.helpers import entity_registry as er

from .coordinator import AuroraCalendarCoordinator

# Unique-id suffixes that were removed in the architecture refactor (layer 3→4).
# Clean them out of the entity registry on first boot so they don't show as unavailable.
_STALE_UNIQUE_ID_SUFFIXES = ["view_title", "start_date", "end_date"]

_LOGGER = logging.getLogger(__name__)

DOMAIN = "aurora_calendar"

PLATFORMS = ["sensor", "select", "switch"]

_TOGGLE_FILTER_SCHEMA = vol.Schema({vol.Required("person"): cv.string})

_STATIC_URL_PATH = "/aurora_calendar_static"
_CARD_FILENAME = "aurora-calendar-card.js"
_RESOURCES_REGISTERED_KEY = f"{DOMAIN}_resources_registered"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    _cleanup_stale_entities(hass, entry)

    await _register_card_resources(hass)

    coordinator = AuroraCalendarCoordinator(hass, entry)
    await coordinator.async_config_entry_first_refresh()

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    _register_services(hass)

    entry.async_on_unload(entry.add_update_listener(_async_update_listener))

    return True


async def _register_card_resources(hass: HomeAssistant) -> None:
    """Serve the bundled card and weather icons, and auto-load the card JS."""
    if hass.data.get(_RESOURCES_REGISTERED_KEY):
        return
    hass.data[_RESOURCES_REGISTERED_KEY] = True

    integration_dir = Path(__file__).parent
    await hass.http.async_register_static_paths(
        [StaticPathConfig(_STATIC_URL_PATH, str(integration_dir), True)]
    )

    cache_key = await hass.async_add_executor_job(_card_cache_key, integration_dir)
    add_extra_js_url(hass, f"{_STATIC_URL_PATH}/{_CARD_FILENAME}?v={cache_key}")
    _LOGGER.debug("Registered Aurora Calendar card at %s (v%s)", _STATIC_URL_PATH, cache_key)


def _card_cache_key(integration_dir: Path) -> str:
    """Cache-bust the card URL whenever the JS file changes (mtime-based)."""
    try:
        return str(int((integration_dir / _CARD_FILENAME).stat().st_mtime))
    except Exception:  # pragma: no cover
        return "0"


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id)
    if not hass.data[DOMAIN]:
        hass.services.async_remove(DOMAIN, "toggle_filter")
    return unload_ok


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


def _cleanup_stale_entities(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Remove entity registry entries that no longer exist in this version."""
    registry = er.async_get(hass)
    for suffix in _STALE_UNIQUE_ID_SUFFIXES:
        unique_id = f"{entry.entry_id}_{suffix}"
        entity_id = registry.async_get_entity_id("sensor", DOMAIN, unique_id)
        if entity_id:
            registry.async_remove(entity_id)
            _LOGGER.debug("Removed stale entity %s", entity_id)

    # Migrate entity IDs from older versions where the friendly name produced
    # a different slug. The card hardcodes the expected entity_ids, so anything
    # else breaks it.
    _migrate_entity_id(registry, entry, "sensor", "_events", "sensor.aurora_calendar_events")
    _migrate_entity_id(registry, entry, "select", "_view_mode", "select.aurora_calendar_view_mode")


def _migrate_entity_id(
    registry: er.EntityRegistry,
    entry: ConfigEntry,
    domain: str,
    unique_id_suffix: str,
    expected_entity_id: str,
) -> None:
    """Rename an entity to its expected ID if it drifted (e.g. older friendly name)."""
    unique_id = f"{entry.entry_id}{unique_id_suffix}"
    current = registry.async_get_entity_id(domain, DOMAIN, unique_id)
    if not current or current == expected_entity_id:
        return
    if registry.async_get(expected_entity_id):
        # Target slot is occupied — bail rather than collide.
        _LOGGER.warning(
            "Cannot migrate %s → %s: target already exists", current, expected_entity_id
        )
        return
    registry.async_update_entity(current, new_entity_id=expected_entity_id)
    _LOGGER.info("Migrated entity %s → %s", current, expected_entity_id)


def _get_coordinator(hass: HomeAssistant) -> AuroraCalendarCoordinator:
    return next(iter(hass.data[DOMAIN].values()))


def _register_services(hass: HomeAssistant) -> None:
    if hass.services.has_service(DOMAIN, "toggle_filter"):
        return

    async def handle_toggle_filter(call: ServiceCall) -> None:
        await _get_coordinator(hass).async_toggle_filter(call.data["person"])

    hass.services.async_register(
        DOMAIN, "toggle_filter", handle_toggle_filter, schema=_TOGGLE_FILTER_SCHEMA
    )
