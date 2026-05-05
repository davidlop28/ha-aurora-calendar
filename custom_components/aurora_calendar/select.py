"""Select platform for Aurora Calendar — default view preference."""
from __future__ import annotations

import logging

from homeassistant.components.select import SelectEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.restore_state import RestoreEntity

from . import DOMAIN
from .coordinator import DEFAULT_VIEW_MODE, VIEW_MODES

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    async_add_entities([AuroraCalendarDefaultViewSelect(entry)])


class AuroraCalendarDefaultViewSelect(SelectEntity, RestoreEntity):
    """Stores the admin-configured default view mode.

    The card reads this once on first load as its starting view.
    All subsequent per-user navigation is local to the card.
    """

    _attr_has_entity_name = True
    _attr_name = "View Mode"
    _attr_icon = "mdi:calendar-expand-horizontal"
    _attr_options = VIEW_MODES

    def __init__(self, entry: ConfigEntry) -> None:
        self._entry = entry
        self._attr_unique_id = f"{entry.entry_id}_view_mode"
        self._attr_current_option = DEFAULT_VIEW_MODE

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        last = await self.async_get_last_state()
        if last and last.state in VIEW_MODES:
            self._attr_current_option = last.state

    async def async_select_option(self, option: str) -> None:
        self._attr_current_option = option
        self.async_write_ha_state()

    @property
    def device_info(self) -> dict:
        return {
            "identifiers": {(DOMAIN, self._entry.entry_id)},
            "name": self._entry.data.get("name", "Aurora Calendar"),
            "manufacturer": "Aurora Calendar",
            "model": "Calendar Integration",
        }
