# Dash roadmap: from dashboard toy to a friendly Home Assistant front door

Dash should feel like a product a normal household can use, while still being a
thin, honest wrapper around Home Assistant. Nothing should require editing YAML
or understanding Lovelace. Power users can still open Home Assistant proper.

## Principle

Dash stores presentation and graph metadata locally, but Home Assistant remains
the source of truth for entities, services, and automations. When Dash runs as a
Home Assistant panel it uses Home Assistant's own authenticated connection —
there is no token to copy and no second connection to maintain.

## Phase 1 — Installable and zero-configuration (this release)

- [x] HACS custom integration with a UI setup flow.
- [x] Dash appears in the Home Assistant sidebar.
- [x] Embedded panel receives `hass`, entities, and services automatically.
- [x] Shadow-DOM styling so Dash cannot disturb the Home Assistant UI.
- [x] Standalone build remains available for development and preview.
- [x] One-command panel build, brand assets, validation workflow, install docs.

## Phase 2 — First-run confidence (this release)

- [x] A welcome screen with two choices: try the demo or connect Home Assistant.
- [x] Embedded mode skips onboarding and starts on live data.
- [x] In-app help with common tasks and keyboard shortcuts.
- [x] Friendly empty states and plain-language labels.
- [x] Global undo/redo for dashboard edits, with keyboard shortcuts.
- [x] Autosave stays invisible; no "save" button to forget.

## Phase 3 — More expressive dashboards (this release)

- [x] Nested Grid cards with 1–3 columns and grids inside grids.
- [x] Standard, Wide, and Full card widths.
- [x] Entity, Sensor, Action, Note, Grid, and Gauge cards.
- [x] Batteries-included themes: light/dark/system, five accents, three
      backgrounds.
- [x] JSON import/export for moving a dashboard between homes.
- [ ] Additional read-only cards: camera snapshots, history graphs, weather.
- [ ] Drag a card from one grid into another.
- [ ] Per-card visibility rules ("show at night", "show when someone is home").

## Phase 4 — A true visual automation editor (this release)

- [x] Drag-and-drop node canvas with triggers, conditions, actions, and delays.
- [x] Multiple automations with create, rename, duplicate, and delete.
- [x] Live validation and Home Assistant YAML export/copy.
- [x] Save automations directly to Home Assistant when running as a panel.
- [ ] Import existing automations from Home Assistant into the graph.
- [ ] Boolean branching (if/else), choose, repeat, and wait-for-trigger nodes.
- [ ] Graph undo/redo and copy/paste of node groups.
- [ ] Per-node testing ("run this action once") from the inspector.

## Phase 5 — Household polish

- [ ] Guided "add your first room" flow with room-based card grouping.
- [ ] Search across cards and entities.
- [ ] Favorites and quick scenes on a simplified home screen.
- [ ] User-level layouts (each household member gets their own dashboard).
- [ ] Localized strings and RTL support.
- [ ] Accessibility audit with keyboard-only graph editing.
- [ ] PWA/offline shell for standalone deployments.

## Non-goals

Dash is not a replacement for Home Assistant's configuration UI. It does not aim
to manage integrations, add-ons, YAML packages, or system settings. It is the
friendly everyday surface; Home Assistant remains the control room.
