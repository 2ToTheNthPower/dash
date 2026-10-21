# Dash

A friendly, modern front door for Home Assistant.

Dash is for the people in the house who just want the lights on, the temperature
readable, and the movie scene to work. It wraps Home Assistant in a calm,
touch-friendly dashboard and automation builder. No YAML, no Lovelace editing,
no long-lived token when it runs inside Home Assistant. Power users can still
open Home Assistant itself for the deep end.

- **Install once, use every day.** Ships as a HACS integration that adds Dash to
  the Home Assistant sidebar and uses your existing Home Assistant login.
- **A dashboard built for normal people.** Tap cards to control devices. Add,
  edit, and reorder cards visually.
- **Nested grids.** Grid cards with 1–3 columns can contain other cards, and
  even other grids. Card widths can be Standard, Wide, or Full.
- **Useful card types.** Entity, Sensor, Gauge, Action, Note, and Grid.
- **Themes that feel like home.** Light, dark, or system mode; five accents;
  three backgrounds. Dark mode follows Home Assistant when embedded.
- **Undo without fear.** Undo and redo dashboard changes with buttons or
  `Ctrl/Cmd + Z`.
- **Guided first run.** A welcome screen offers demo data or a real connection.
  In the HACS panel, Dash skips the questions and starts with your entities.
- **Visual automations.** Drag triggers, conditions, actions, and delays onto a
  canvas, connect them, validate, then save directly to Home Assistant or export
  YAML.
- **Everything saves itself.** Layouts, themes, and automation graphs live in
  the browser. Dashboard JSON can be exported and imported.

The completeness plan and future work live in [docs/ROADMAP.md](docs/ROADMAP.md).

## Install with HACS

HACS classifies full sidebar apps as **Integrations**. (HACS calls Lovelace
card bundles "Dashboard" plugins; those cannot register a sidebar app.) This
repository is packaged as a HACS integration so Dash can be a real panel and use
Home Assistant's authenticated connection.

1. In HACS, open the menu → **Custom repositories**.
2. Add this repository URL and choose the **Integration** category.
3. Open **Dash** in HACS and click **Download**.
4. Restart Home Assistant.
5. Go to **Settings → Devices & Services → Add Integration**, search for
   **Dash**, and confirm. There are no fields to fill in.
6. Open **Dash** from the Home Assistant sidebar.

You do not need to edit `configuration.yaml`, copy files, or create an access
token. The integration serves the built panel, registers the sidebar entry, and
passes Home Assistant's `hass` object to Dash.

On the first run, Dash builds a starter dashboard from your first useful Home
Assistant entities. You can rearrange it, add cards, or change the theme at any
time.

### Updating

Update through HACS and restart Home Assistant. The panel bundle is rebuilt and
committed with each release.

## Develop locally

The project uses [devbox](https://www.jetify.com/devbox) for the Node runtime.
Dependencies are managed with npm in `package.json`.

```bash
devbox run install       # install npm dependencies
devbox run dev           # standalone dev server (http://localhost:5173)
```

Build both the standalone app and the HACS panel bundle:

```bash
devbox run build
```

This produces:

- `dist/` — the standalone web app.
- `custom_components/dash/frontend/dash-panel.js` plus lazy chunks — the
  shippable HACS panel.

Preview the standalone app with `devbox run preview`. Run tests and type checks
with `devbox run test` and `devbox run typecheck`.

The panel bundle is rebuilt automatically by `npm run build`, which runs
`build:web` and `build:panel`. The panel is a custom element
(`<dash-panel>`) mounted inside a shadow root, so Dash's CSS cannot disturb the
Home Assistant UI.

## Using the dashboard

1. Click **Edit** in the toolbar.
2. Click **Add card** and choose:
   - **Entity** — toggles lights, switches, fans, locks, covers, scenes, and scripts.
   - **Sensor** — a large reading with a meter when `min`/`max` are available.
   - **Gauge** — a circular reading for percentages or sensors with `min`/`max`.
   - **Action** — a prominent button for a scene or script.
   - **Note** — free text for the family ("bins go out on Tuesday").
   - **Grid** — a nested grid with 1–3 columns. After saving, use its **Add to
     grid** tile to place cards inside it.
3. Drag cards by the grip handle, or use the up/down arrow buttons. Cards inside
   a grid reorder within that grid.
4. Use the edit and trash buttons on each card to change or remove it. Card
   widths can be **Standard**, **Wide**, or **Full**.
5. Click **Preview** to interact with the dashboard. Tap an entity card to
   toggle it; tap a scene or script card to run it.
6. Use **Undo/Redo** (or `Ctrl/Cmd + Z`) to recover from mistakes.
7. Open **Settings** for the title, subtitle, theme mode, accent, background,
   import/export, or connection details.
8. Open **Help** (question mark) for a short guide and keyboard shortcuts.

Changes save automatically. In HACS mode, the dashboard is stored in
`localStorage` on your Home Assistant origin.

## Connecting Home Assistant

### HACS panel (recommended)

Nothing to do. The panel receives Home Assistant's authenticated `hass` object
and uses it for entities, live state updates, service calls, saving automations,
and dark-mode preference. There is no token UI in embedded mode.

### Standalone development build

The standalone app can connect directly over the Home Assistant WebSocket API:

1. In Home Assistant, create a **Long-lived access token** under
   Profile → Security.
2. Open Dash settings → **Home Assistant**.
3. Enter your base URL, for example `http://homeassistant.local:8123`, and paste
   the token.
4. Click **Connect**.

The token is kept in **sessionStorage only** — it disappears when the tab is
closed and never leaves your browser except to talk to your Home Assistant. The
URL and token are not included in exported dashboard JSON.

## Building automations

Switch to **Automations** in the top navigation.

- Drag node types from the palette onto the canvas, or click to add one.
- Drag nodes to arrange them. Connect nodes by dragging from a node's right
  handle to another node's left handle.
- Click a node to edit it in the inspector:
  - **Triggers** — state change, time of day, or sun event.
  - **Conditions** — entity state or a time window.
  - **Actions** — call a service, run a scene/script, send a notification, or
    wait for a delay.
- Duplicate a node from the inspector when you want a similar action.
- Manage multiple automations in the sidebar: create, rename, duplicate, delete.
- The graph validates continuously. Invalid nodes are reported before export.

When running as the HACS panel, **Save to HA** writes the automation through
Home Assistant's config API. For standalone use, **Copy YAML** and **Export YAML**
produce a normal Home Assistant automation definition:

```yaml
id: demo-motion-lights
alias: Hallway lights on motion
description: Turn the living room lights on after sunset.
mode: single
trigger:
  - platform: state
    entity_id: binary_sensor.hallway_motion
    to: "on"
condition:
  - condition: state
    entity_id: sun.sun
    state: below_horizon
action:
  - service: light.turn_on
    target:
      entity_id: light.living_room
  - delay:
      minutes: 3
  - service: light.turn_off
    target:
      entity_id: light.living_room
```

All condition nodes are combined as AND conditions, triggers are ORed, and
action nodes run in graph order. Automation graphs are saved separately in
`localStorage` under `dash.automations.v1`.


## Troubleshooting the connection

Dash has two connection modes, and they fail in different places.

**Installed through HACS:** there is no token or URL to enter. If the panel is
blank or shows a panel error:

1. Confirm the **Dash** integration is added under Settings → Devices & Services.
2. Restart Home Assistant after installing or updating through HACS.
3. Check Settings → System → Logs for `custom_components.dash`.
4. Reload the Dash page. The integration passes Home Assistant's authenticated
   connection to the panel automatically.

**Standalone development build:** use the address you actually open in your
browser. A dashboard URL ending in `/lovelace/0` is accepted and normalized to
the WebSocket endpoint.

- `Could not reach Home Assistant` — the address is wrong, Home Assistant is
  offline, or the browser cannot route to it. Open the same address in a new tab
  on the same device.
- **The Open Home Assistant button works but Connect still fails** — the page is
  reachable, but the browser is blocking this page's local-network/WebSocket
  access (common when Dash is served from a different origin, a cloud IDE, a
  public host, or opened directly as a `file://` page). Use the HACS sidebar
  panel, serve Dash from the same machine or network, allow local-network access
  for the site (Chrome: Site settings → Local network access; macOS: Privacy &
  Security → Local Network), or fix WebSocket upgrades in your reverse proxy.
- **`homeassistant.local` does not resolve** — this is an mDNS name and is not
  supported on every device or network. Use the numeric IP of Home Assistant
  (`http://192.168.1.50:8123`), the URL shown in the Home Assistant app, or your
  Nabu Casa HTTPS address. Dash now probes the page first and tells you whether
  the host is unreachable or the WebSocket upgrade was blocked.
- `Home Assistant rejected that access token` — create a new long-lived token
  under Profile → Security. Paste the whole token; do not use your password.
- `This page is served over HTTPS...` — open Dash over HTTP or give Dash the
  `https://` address so it can use `wss://`.
- **Home Assistant uses HTTPS** — include `https://` in the address. Saving
  `homeassistant.local:8123` defaults to `http://` and will fail if Home
  Assistant is HTTPS-only.
- `Connection timed out` — a firewall, VPN, or reverse proxy is blocking the
  WebSocket upgrade. If Home Assistant lives behind a path prefix, entering the
  full WebSocket URL (for example `wss://example.com/ha/api/websocket`) works.
- `closed the connection before authenticating` — usually an HTTP page trying to
  reach an HTTPS-only Home Assistant or a proxy that strips WebSocket upgrades.

The settings panel shows the exact endpoint it will try after a failed
connection, along with short recovery tips.

## Dashboard JSON

Use **Export JSON** in settings to download the current dashboard, and **Import
JSON** to load it elsewhere:

```json
{
  "version": 1,
  "title": "My home",
  "subtitle": "A calm, simple dashboard.",
  "theme": { "mode": "system", "accent": "azure" },
  "background": "aurora",
  "cards": [
    {
      "id": "living-room",
      "type": "entity",
      "title": "Living room",
      "entityId": "light.living_room",
      "width": "normal"
    }
  ]
}
```

Card types are `entity`, `sensor`, `action`, `note`, `group`, and `gauge`;
widths are `normal`, `wide`, or `full`; theme modes are `system`, `light`,
`dark`; accents are `azure`, `violet`, `emerald`, `sunset`, `rose`; backgrounds
are `aurora`, `grid`, `plain`.

A nested grid:

```json
{
  "id": "quick-controls",
  "type": "group",
  "title": "Quick controls",
  "width": "wide",
  "columns": 2,
  "children": [
    {
      "id": "kitchen",
      "type": "entity",
      "title": "Kitchen",
      "entityId": "light.kitchen",
      "width": "normal"
    },
    {
      "id": "humidity",
      "type": "gauge",
      "title": "Humidity",
      "entityId": "sensor.humidity",
      "width": "normal"
    }
  ]
}
```

Grid `columns` can be `1`, `2`, or `3`. Imported files are sanitised: unknown
values fall back to safe defaults and duplicate card IDs are replaced.

## Project layout

```
custom_components/dash/
  __init__.py             registers the static path and sidebar panel
  config_flow.py          one-step UI setup (no YAML)
  manifest.json           Home Assistant integration manifest
  const.py                domain, version, panel and asset paths
  strings.json            config-flow text
  translations/en.json    config-flow translations
  brand/icon.png          HACS/Home Assistant brand asset
  frontend/               built panel bundle (generated by `npm run build:panel`)

src/
  App.tsx                 dashboard/automation routing, embedded mode, history
  panel.tsx               <dash-panel> custom element + shadow CSS injection
  automation/
    AutomationView.tsx    automation list, toolbar, YAML/save-to-HA
    AutomationCanvas.tsx  React Flow canvas, palette, drag-to-connect
    NodeInspector.tsx     per-node editing and duplication
    graph.ts              ordering, validation, HA/YAML export
    demo.ts               demo automation and record helpers
    storage.ts            validated automation persistence
    types.ts              automation graph types
  components/
    Header.tsx            brand, navigation, status, theme, help, settings
    Dashboard.tsx         nested grids, drag-and-drop, entity/sensor/gauge cards
    CardEditor.tsx        add/edit modal with entity picker and grid options
    Onboarding.tsx        first-run welcome and demo/connect choice
    HelpPanel.tsx         in-app guide and shortcuts
    SettingsPanel.tsx     theme, details, HA connection, import/export
    Icon.tsx              inline SVG icon set
  lib/
    cardTree.ts           recursive card find/insert/update/remove/reorder
    demo.ts               demo data, starter dashboard from live entities
    format.ts             entity names, state summaries, sensor values
    ha.ts                 standalone WebSocket client
    hass.ts               minimal typed shape of Home Assistant's hass object
    reorder.ts            pure flat reordering helpers
    services.ts           entity → service-call mapping
    shadowCss.ts          scopes app CSS for the panel shadow root
    storage.ts            validated persistence and onboarding flag
    theme.ts              theme resolution and accent definitions
  test/                   jsdom setup, HACS structure checks
  styles.css              theme variables, layout, components

docs/ROADMAP.md           what is done and what comes next
.github/workflows/        frontend, Python, HACS, and hassfest validation
hacs.json                 HACS repository metadata
```

## Tests and verification

```bash
devbox run test
devbox run build
python -m compileall -q custom_components
python -m unittest discover -s tests -v
```

The suite covers:

- reorder logic, recursive nested-grid operations, and boundary cases
- config sanitisation/import/export and automation storage
- theme resolution, shadow-DOM CSS rewriting, and embedded theme targets
- automation graph ordering, validation, connection guards, and YAML export
- Home Assistant WebSocket authentication, live states, service calls, and
  embedded `hass` service calls
- end-to-end flows: onboarding, add/remove/reorder cards, nested grids, gauges,
  undo/redo, help, automation node creation, and save-to-HA
- HACS repository structure: manifest, config flow, brand assets, built panel,
  and `hacs.json`

A headless-browser smoke test of the built `<dash-panel>` verifies that the
shadow root renders, embedded entities appear, an entity card calls
`hass.callService`, the lazy automation chunk loads, and **Save to HA** calls
`hass.callApi`.

## Notes and limits

- Dash is a focused everyday surface, not a full Lovelace replacement. It does
  not render arbitrary custom Lovelace cards, YAML dashboards, add-ons, or
  integration configuration. Home Assistant remains the control room for those.
- The automation graph supports state/time/sun triggers, entity/time conditions,
  and service/scene/notify/delay actions. Boolean branching, import of existing
  automations, and per-node testing are on the roadmap.
- Card drag-and-drop uses native HTML5 drag events and React Flow on desktop;
  arrow buttons cover touch and keyboard card reordering.
- The HACS panel uses Home Assistant's authenticated connection. The standalone
  build uses a token stored in sessionStorage.
- Dash's data is per-browser. HACS panel data lives on your Home Assistant
  origin; standalone data lives on the standalone origin.
- The demo dataset is small on purpose so the first run is instant and
  offline-friendly.
