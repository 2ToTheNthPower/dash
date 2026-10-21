"""Config flow for Dash."""

from __future__ import annotations

from typing import Any

from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResult

from .const import DOMAIN


class DashConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Set up the Dash panel without editing files."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the one-step UI setup."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            return self.async_create_entry(title="Dash", data={})

        return self.async_show_form(step_id="user")
