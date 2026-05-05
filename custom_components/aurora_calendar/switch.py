"""Switch platform for Aurora Calendar — per-person visibility filters."""
from __future__ import annotations

import logging

from homeassistant.components.switch import SwitchEntity
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
    async_add_entities(
        [AuroraPersonFilterSwitch(coordinator, entry, p) for p in coordinator.persons]
    )


class AuroraPersonFilterSwitch(CoordinatorEntity, SwitchEntity):
    """Switch that shows/hides a person's calendar events."""

    _attr_has_entity_name = True
    _attr_icon = "mdi:account-filter"

    def __init__(
        self,
        coordinator: AuroraCalendarCoordinator,
        entry: ConfigEntry,
        person_info: dict,
    ) -> None:
        super().__init__(coordinator)
        self._entry = entry
        self._person = person_info["person"]
        self._slug = person_info["slug"]
        self._attr_name = f"Filter {self._person}"
        self._attr_unique_id = f"{entry.entry_id}_filter_{self._slug}"

    @property
    def is_on(self) -> bool:
        return self.coordinator.is_filter_enabled(self._person)

    async def async_turn_on(self, **kwargs) -> None:
        await self.coordinator.async_set_filter(self._person, True)

    async def async_turn_off(self, **kwargs) -> None:
        await self.coordinator.async_set_filter(self._person, False)

    @property
    def extra_state_attributes(self) -> dict:
        persons_by_name = {p["person"]: p for p in self.coordinator.persons}
        p = persons_by_name.get(self._person, {})
        return {
            "person": self._person,
            "color": p.get("color", "#3B82F6"),
            "avatar": p.get("avatar", ""),
        }

    @property
    def device_info(self) -> dict:
        return {
            "identifiers": {(DOMAIN, self._entry.entry_id)},
            "name": self._entry.data.get("name", "Aurora Calendar"),
            "manufacturer": "Aurora Calendar",
            "model": "Calendar Integration",
        }
