"""Constants for the Dash integration."""

from pathlib import Path

DOMAIN = "dash"
VERSION = "1.1.0"

URL_PATH = "dash"
SIDEBAR_TITLE = "Dash"
SIDEBAR_ICON = "mdi:view-dashboard-variant"

STATIC_URL = "/dash_static"
FRONTEND_DIR = Path(__file__).parent / "frontend"
PANEL_FILE = "dash-panel.js"
PANEL_JS = FRONTEND_DIR / PANEL_FILE
PANEL_URL = f"{STATIC_URL}/{PANEL_FILE}?v={VERSION}"
