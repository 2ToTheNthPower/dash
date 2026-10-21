import { useEffect } from 'react'
import { Icon, type IconName } from './Icon'

interface HelpPanelProps {
  onClose: () => void
  onOpenSettings: () => void
}

const STEPS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'grid',
    title: 'Build a dashboard',
    body: 'Tap Edit, then Add card. Choose what you want to see: a light, a sensor, a scene, a gauge, or a note. Drag cards to reorder them.',
  },
  {
    icon: 'bulb',
    title: 'Control your home',
    body: 'In Preview, tap an entity card to toggle a light or switch. Tap a scene or script card to run it. Changes show up live from Home Assistant.',
  },
  {
    icon: 'bolt',
    title: 'Build an automation',
    body: 'Open Automations, drag triggers, conditions, and actions onto the canvas, then connect them. When it is valid, save it to Home Assistant or export the YAML.',
  },
  {
    icon: 'sliders',
    title: 'Make it yours',
    body: 'Settings has light/dark mode, five accent colours, backgrounds, and dashboard import/export. Everything saves automatically in this browser.',
  },
]

const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: 'Ctrl / Cmd + Z', action: 'Undo a dashboard change' },
  { keys: 'Ctrl / Cmd + Shift + Z', action: 'Redo a dashboard change' },
  { keys: 'Delete', action: 'Remove a selected automation node or connection' },
  { keys: 'Esc', action: 'Close a dialog or panel' },
]

export function HelpPanel({ onClose, onOpenSettings }: HelpPanelProps) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="overlay panel-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <aside className="settings-panel help-panel" role="dialog" aria-modal="true" aria-labelledby="help-title">
        <div className="modal-header sticky">
          <div>
            <p className="eyebrow">No manuals required</p>
            <h2 id="help-title">Help and tips</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close help">
            <Icon name="x" />
          </button>
        </div>

        <div className="settings-scroll">
          <section className="settings-section">
            <h3>Common tasks</h3>
            <div className="help-steps">
              {STEPS.map((step) => (
                <div className="help-step" key={step.title}>
                  <span className="help-step-icon">
                    <Icon name={step.icon} size={18} />
                  </span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="settings-section">
            <h3>Keyboard shortcuts</h3>
            <div className="shortcut-list">
              {SHORTCUTS.map((shortcut) => (
                <div className="shortcut-row" key={shortcut.keys}>
                  <kbd>{shortcut.keys}</kbd>
                  <span>{shortcut.action}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="settings-section">
            <h3>Power users</h3>
            <p className="hint">
              Dash is the everyday surface; Home Assistant remains the control room. For
              integrations, add-ons, YAML, or advanced dashboards, open Home Assistant itself.
            </p>
            <div className="data-actions">
              <button type="button" className="button ghost" onClick={onOpenSettings}>
                <Icon name="sliders" size={16} />
                Open settings
              </button>
            </div>
          </section>
        </div>
      </aside>
    </div>
  )
}
