"""Tests for the integration's __init__ — entity ID migration and resource registration."""
from __future__ import annotations

from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.aurora_calendar import (
    DOMAIN,
    _CARD_FILENAME,
    _STATIC_URL_PATH,
    _upsert_lovelace_resource,
)


def _make_resources_mock(existing_items: list | None = None) -> MagicMock:
    """Build a stand-in for HA's ResourceStorageCollection with the async methods we call."""
    resources = MagicMock()
    resources.async_load = AsyncMock()
    resources.async_items = MagicMock(return_value=existing_items or [])
    resources.async_create_item = AsyncMock()
    resources.async_update_item = AsyncMock()
    return resources


async def test_drifted_entity_ids_get_migrated(hass: HomeAssistant) -> None:
    """A pre-existing entity registered with a wrong slug (e.g. sensor.events
    instead of sensor.aurora_calendar_events) must be auto-renamed during
    setup, otherwise the card — which hardcodes the expected IDs — breaks."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Aurora Calendar",
        data={"name": "Aurora Calendar"},
        options={"calendars": [], "weather_entity": ""},
        entry_id="01TESTENTRY",
    )
    entry.add_to_hass(hass)

    registry = er.async_get(hass)
    # Simulate the buggy state we shipped before v0.1.x: friendly-name slug.
    registry.async_get_or_create(
        domain="sensor",
        platform=DOMAIN,
        unique_id=f"{entry.entry_id}_events",
        suggested_object_id="events",
        config_entry=entry,
    )
    registry.async_get_or_create(
        domain="select",
        platform=DOMAIN,
        unique_id=f"{entry.entry_id}_view_mode",
        suggested_object_id="view_mode",
        config_entry=entry,
    )
    registry.async_get_or_create(
        domain="switch",
        platform=DOMAIN,
        unique_id=f"{entry.entry_id}_filter_birthdays",
        suggested_object_id="filter_birthdays",
        config_entry=entry,
    )

    # Patch out the heavy stuff — we only want to exercise migration.
    with patch(
        "custom_components.aurora_calendar.AuroraCalendarCoordinator"
    ), patch(
        "homeassistant.config_entries.ConfigEntries.async_forward_entry_setups",
        return_value=True,
    ), patch(
        "custom_components.aurora_calendar._register_card_resources",
        return_value=None,
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

    # After setup, all entity_ids should have the aurora_calendar_ prefix.
    sensor = registry.async_get_entity_id("sensor", DOMAIN, f"{entry.entry_id}_events")
    select = registry.async_get_entity_id("select", DOMAIN, f"{entry.entry_id}_view_mode")
    switch = registry.async_get_entity_id(
        "switch", DOMAIN, f"{entry.entry_id}_filter_birthdays"
    )
    assert sensor == "sensor.aurora_calendar_events"
    assert select == "select.aurora_calendar_view_mode"
    assert switch == "switch.aurora_calendar_filter_birthdays"


async def test_already_correct_entity_ids_are_not_renamed(
    hass: HomeAssistant,
) -> None:
    """Migration must be idempotent — re-running on already-correct IDs is a no-op."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Aurora Calendar",
        data={"name": "Aurora Calendar"},
        options={"calendars": [], "weather_entity": ""},
        entry_id="01TESTENTRY2",
    )
    entry.add_to_hass(hass)

    registry = er.async_get(hass)
    registry.async_get_or_create(
        domain="sensor",
        platform=DOMAIN,
        unique_id=f"{entry.entry_id}_events",
        suggested_object_id="aurora_calendar_events",
        config_entry=entry,
    )

    with patch(
        "custom_components.aurora_calendar.AuroraCalendarCoordinator"
    ), patch(
        "homeassistant.config_entries.ConfigEntries.async_forward_entry_setups",
        return_value=True,
    ), patch(
        "custom_components.aurora_calendar._register_card_resources",
        return_value=None,
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

    sensor = registry.async_get_entity_id("sensor", DOMAIN, f"{entry.entry_id}_events")
    assert sensor == "sensor.aurora_calendar_events"


# ---------------------------------------------------------------------------
# Lovelace resource registration (_upsert_lovelace_resource)
# ---------------------------------------------------------------------------


async def test_upsert_creates_resource_on_fresh_install(hass: HomeAssistant) -> None:
    """Fresh install: no existing resource → integration creates a new entry."""
    resources = _make_resources_mock(existing_items=[])
    hass.data["lovelace"] = SimpleNamespace(resources=resources)

    url = f"{_STATIC_URL_PATH}/{_CARD_FILENAME}?v=12345"
    await _upsert_lovelace_resource(hass, url)

    resources.async_load.assert_awaited_once()
    resources.async_create_item.assert_awaited_once_with(
        {"res_type": "module", "url": url}
    )
    resources.async_update_item.assert_not_awaited()


async def test_upsert_migrates_manual_workaround_entry(hass: HomeAssistant) -> None:
    """User who added `?v=1` manually as a workaround: integration auto-migrates to mtime URL."""
    old_url = f"{_STATIC_URL_PATH}/{_CARD_FILENAME}?v=1"
    new_url = f"{_STATIC_URL_PATH}/{_CARD_FILENAME}?v=999999"
    resources = _make_resources_mock(
        existing_items=[{"id": "manual-id", "url": old_url, "res_type": "module"}]
    )
    hass.data["lovelace"] = SimpleNamespace(resources=resources)

    await _upsert_lovelace_resource(hass, new_url)

    resources.async_update_item.assert_awaited_once_with(
        "manual-id", {"res_type": "module", "url": new_url}
    )
    resources.async_create_item.assert_not_awaited()


async def test_upsert_is_noop_when_url_unchanged(hass: HomeAssistant) -> None:
    """Restart with no file change: same URL already present → no create/update calls."""
    url = f"{_STATIC_URL_PATH}/{_CARD_FILENAME}?v=12345"
    resources = _make_resources_mock(
        existing_items=[{"id": "abc", "url": url, "res_type": "module"}]
    )
    hass.data["lovelace"] = SimpleNamespace(resources=resources)

    await _upsert_lovelace_resource(hass, url)

    resources.async_create_item.assert_not_awaited()
    resources.async_update_item.assert_not_awaited()


async def test_upsert_handles_missing_lovelace_data_gracefully(
    hass: HomeAssistant,
) -> None:
    """Lovelace component not yet loaded → warn and return; never raise."""
    hass.data.pop("lovelace", None)

    # Must not raise even though Lovelace isn't set up.
    await _upsert_lovelace_resource(hass, "/whatever")


async def test_upsert_handles_yaml_mode_gracefully(hass: HomeAssistant) -> None:
    """Users running Lovelace in YAML mode have no resource collection → warn, no crash."""
    hass.data["lovelace"] = SimpleNamespace(resources=None)

    await _upsert_lovelace_resource(hass, "/whatever")
