"""Dash: a friendly dashboard panel for Home Assistant."""

from __future__ import annotations

import logging

from homeassistant.components import frontend, panel_custom
try:
    from homeassistant.components.http import StaticPathConfig
except ImportError:
    StaticPathConfig = None
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers.typing import ConfigType

from .const import (
    DOMAIN,
    FRONTEND_DIR,
    PANEL_JS,
    PANEL_URL,
    SIDEBAR_ICON,
    SIDEBAR_TITLE,
    STATIC_URL,
    URL_PATH,
)

_LOGGER = logging.getLogger(__name__)

DATA_STATIC_REGISTERED = f"{DOMAIN}_static_registered"


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up Dash from YAML (the config flow is the normal path)."""
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Register the Dash sidebar panel."""
    if not PANEL_JS.is_file():
        raise ConfigEntryNotReady(
            "The Dash panel bundle is missing. Reinstall the HACS integration."
        )

    if not hass.data.get(DATA_STATIC_REGISTERED):
        if StaticPathConfig is not None:
            await hass.http.async_register_static_paths(
                [StaticPathConfig(STATIC_URL, str(FRONTEND_DIR), cache_headers=True)]
            )
        else:
            hass.http.register_static_path(
                STATIC_URL, str(FRONTEND_DIR), cache_headers=True
            )
        hass.data[DATA_STATIC_REGISTERED] = True

    await panel_custom.async_register_panel(
        hass,
        webcomponent_name="dash-panel",
        frontend_url_path=URL_PATH,
        sidebar_title=SIDEBAR_TITLE,
        sidebar_icon=SIDEBAR_ICON,
        module_url=PANEL_URL,
        embed_iframe=False,
        require_admin=False,
        handle_safe_area=True,
        config={},
    )

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = True
    _LOGGER.info("Dash panel registered at /%s", URL_PATH)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Remove the Dash panel when the config entry is removed."""
    try:
        frontend.async_remove_panel(hass, URL_PATH)
    except Exception:
        _LOGGER.debug("Dash panel was already removed", exc_info=True)
    hass.data.get(DOMAIN, {}).pop(entry.entry_id, None)
    return True
