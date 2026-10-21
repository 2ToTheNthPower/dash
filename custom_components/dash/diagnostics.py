"""Diagnostics for Dash."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    FRONTEND_DIR,
    PANEL_FILE,
    PANEL_JS,
    PANEL_URL,
    STATIC_URL,
    URL_PATH,
    VERSION,
)


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    """Return information useful when the panel does not load."""
    files = (
        sorted(path.name for path in FRONTEND_DIR.iterdir())
        if FRONTEND_DIR.is_dir()
        else []
    )

    return {
        "version": VERSION,
        "url_path": URL_PATH,
        "static_url": STATIC_URL,
        "panel_url": PANEL_URL,
        "panel_file": PANEL_FILE,
        "panel_file_exists": PANEL_JS.is_file(),
        "frontend_files": files,
        "entry_id": entry.entry_id,
    }
