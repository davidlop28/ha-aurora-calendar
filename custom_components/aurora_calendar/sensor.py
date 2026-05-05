"""Sensor platform for Aurora Calendar."""
from __future__ import annotations

import logging

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from . import DOMAIN
from .coordinator import AuroraCalendarCoordinator

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator: AuroraCalendarCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([AuroraCalendarConfigSensor(coordinator, entry)])


class AuroraCalendarConfigSensor(CoordinatorEntity, SensorEntity):
    """Exposes calendar configuration for the card to consume.

    State = number of configured calendars.
    Attributes = full config payload (calendars, persons, filters, weather_entity).
    The card reads this once on load to know which entities to fetch events from
    and how to render person chips and colors.
    """

    _attr_has_entity_name = True
    _attr_name = "Events"
    _attr_icon = "mdi:calendar-account"

    def __init__(
        self, coordinator: AuroraCalendarCoordinator, entry: ConfigEntry
    ) -> None:
        super().__init__(coordinator)
        self._entry = entry
        # Re-use the old unique_id so the entity_id stays sensor.aurora_calendar_events
        # (avoids orphaning the existing registry entry during development)
        self._attr_unique_id = f"{entry.entry_id}_events"

    @property
    def state(self) -> int:
        return len((self.coordinator.data or {}).get("calendars", []))

    @property
    def extra_state_attributes(self) -> dict:
        data = self.coordinator.data or {}
        return {
            "calendars": data.get("calendars", []),
            "persons": data.get("persons", []),
            "filters": data.get("filters", {}),
            "weather_entity": data.get("weather_entity", ""),
        }

    @property
    def device_info(self) -> dict:
        return {
            "identifiers": {(DOMAIN, self._entry.entry_id)},
            "name": self._entry.data.get("name", "Aurora Calendar"),
            "manufacturer": "Aurora Calendar",
            "model": "Calendar Integration",
        }
