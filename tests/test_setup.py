"""Setup/teardown tests for the Dash integration using lightweight HA stubs."""

from __future__ import annotations

import asyncio
import sys
import types
import unittest
from pathlib import Path
from types import SimpleNamespace

panel_calls: dict[str, object] = {}
static_calls: list[object] = []
removed_panels: list[str] = []


class StaticPathConfig:
    def __init__(self, url_path: str, path: str, cache_headers: bool = True) -> None:
        self.url_path = url_path
        self.path = path
        self.cache_headers = cache_headers


def install_stubs() -> None:
    ha = types.ModuleType("homeassistant")
    components = types.ModuleType("homeassistant.components")
    frontend = types.ModuleType("homeassistant.components.frontend")
    panel_custom = types.ModuleType("homeassistant.components.panel_custom")
    http = types.ModuleType("homeassistant.components.http")
    config_entries = types.ModuleType("homeassistant.config_entries")
    core = types.ModuleType("homeassistant.core")
    exceptions = types.ModuleType("homeassistant.exceptions")
    helpers = types.ModuleType("homeassistant.helpers")
    helpers_typing = types.ModuleType("homeassistant.helpers.typing")

    async def async_register_panel(hass, **kwargs):
        panel_calls.update(kwargs)

    def async_remove_panel(hass, path, config_panel_domain=None):
        removed_panels.append(path)

    frontend.async_remove_panel = async_remove_panel
    panel_custom.async_register_panel = async_register_panel
    http.StaticPathConfig = StaticPathConfig
    config_entries.ConfigEntry = object
    core.HomeAssistant = object
    exceptions.ConfigEntryNotReady = type("ConfigEntryNotReady", (Exception,), {})
    helpers_typing.ConfigType = dict

    components.frontend = frontend
    components.panel_custom = panel_custom
    ha.components = components
    ha.config_entries = config_entries
    ha.core = core
    ha.exceptions = exceptions
    ha.helpers = helpers
    helpers.typing = helpers_typing

    sys.modules.update(
        {
            "homeassistant": ha,
            "homeassistant.components": components,
            "homeassistant.components.frontend": frontend,
            "homeassistant.components.panel_custom": panel_custom,
            "homeassistant.components.http": http,
            "homeassistant.config_entries": config_entries,
            "homeassistant.core": core,
            "homeassistant.exceptions": exceptions,
            "homeassistant.helpers": helpers,
            "homeassistant.helpers.typing": helpers_typing,
        }
    )


install_stubs()
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from custom_components.dash import async_setup_entry, async_unload_entry


class FakeHTTP:
    def __init__(self) -> None:
        self.paths = []

    async def async_register_static_paths(self, paths) -> None:
        self.paths.extend(paths)
        static_calls.extend(paths)


class FakeHass:
    def __init__(self) -> None:
        self.data: dict[str, object] = {}
        self.http = FakeHTTP()


class DashSetupTest(unittest.TestCase):
    def setUp(self) -> None:
        panel_calls.clear()
        static_calls.clear()
        removed_panels.clear()

    def test_setup_registers_static_path_and_sidebar_panel(self) -> None:
        hass = FakeHass()
        entry = SimpleNamespace(entry_id="test-entry")

        result = asyncio.run(async_setup_entry(hass, entry))

        self.assertTrue(result)
        self.assertEqual(len(static_calls), 1)
        self.assertEqual(static_calls[0].url_path, "/dash_static")
        self.assertTrue(static_calls[0].path.endswith("custom_components/dash/frontend"))
        self.assertEqual(panel_calls["webcomponent_name"], "dash-panel")
        self.assertEqual(panel_calls["frontend_url_path"], "dash")
        self.assertEqual(panel_calls["sidebar_title"], "Dash")
        self.assertTrue(str(panel_calls["module_url"]).startswith("/dash_static/dash-panel.js"))
        self.assertTrue(panel_calls["handle_safe_area"])
        self.assertFalse(panel_calls["embed_iframe"])
        self.assertTrue(hass.data["dash"]["test-entry"])

    def test_setup_is_idempotent_for_the_static_path(self) -> None:
        hass = FakeHass()
        first = SimpleNamespace(entry_id="first")
        second = SimpleNamespace(entry_id="second")

        asyncio.run(async_setup_entry(hass, first))
        asyncio.run(async_setup_entry(hass, second))

        self.assertEqual(len(static_calls), 1)
        self.assertEqual(panel_calls["frontend_url_path"], "dash")

    def test_unload_removes_the_panel(self) -> None:
        hass = FakeHass()
        entry = SimpleNamespace(entry_id="test-entry")
        asyncio.run(async_setup_entry(hass, entry))

        result = asyncio.run(async_unload_entry(hass, entry))

        self.assertTrue(result)
        self.assertEqual(removed_panels, ["dash"])
        self.assertNotIn("test-entry", hass.data.get("dash", {}))


if __name__ == "__main__":
    unittest.main()
