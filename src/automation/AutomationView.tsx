import { useCallback, useEffect, useMemo, useState } from 'react'
import type { EntityMap } from '../types'
import type { HassLike } from '../lib/hass'
import { Icon } from '../components/Icon'
import { automationToHomeAssistant, automationToYaml, validateAutomation } from './graph'
import { createBlankAutomation, duplicateAutomation } from './demo'
import { loadAutomationStore, saveAutomationStore } from './storage'
import { AutomationCanvas } from './AutomationCanvas'
import type { AutomationMode, AutomationRecord, AutomationStore } from './types'

interface AutomationViewProps {
  entities: EntityMap
  colorMode: 'light' | 'dark'
  hass?: HassLike
}

interface Notice {
  tone: 'ok' | 'error'
  message: string
}

const MODE_OPTIONS: { value: AutomationMode; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'restart', label: 'Restart' },
  { value: 'queued', label: 'Queued' },
  { value: 'parallel', label: 'Parallel' },
]

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'automation'
}

function downloadText(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/yaml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function AutomationView({ entities, colorMode, hass }: AutomationViewProps) {
  const [store, setStore] = useState<AutomationStore>(() => loadAutomationStore())
  const [notice, setNotice] = useState<Notice | null>(null)
  const [saving, setSaving] = useState(false)

  const active = useMemo(
    () =>
      store.automations.find((automation) => automation.id === store.activeId) ??
      store.automations[0],
    [store],
  )

  useEffect(() => {
    saveAutomationStore(store)
  }, [store])

  const updateActive = useCallback(
    (patch: Partial<AutomationRecord>) => {
      setStore((current) => ({
        ...current,
        automations: current.automations.map((automation) =>
          automation.id === active.id
            ? { ...automation, ...patch, updatedAt: new Date().toISOString() }
            : automation,
        ),
      }))
    },
    [active.id],
  )

  const setActiveId = (id: string) => {
    setStore((current) => ({ ...current, activeId: id }))
    setNotice(null)
  }

  const addAutomation = () => {
    const automation = createBlankAutomation(`Automation ${store.automations.length + 1}`)
    setStore((current) => ({
      ...current,
      automations: [...current.automations, automation],
      activeId: automation.id,
    }))
    setNotice(null)
  }

  const duplicate = () => {
    const copy = duplicateAutomation(active)
    setStore((current) => ({
      ...current,
      automations: [...current.automations, copy],
      activeId: copy.id,
    }))
    setNotice({ tone: 'ok', message: 'Automation duplicated.' })
  }

  const removeAutomation = (id: string) => {
    setStore((current) => {
      const remaining = current.automations.filter((automation) => automation.id !== id)
      if (remaining.length === 0) {
        const fresh = createBlankAutomation()
        return { version: 1, automations: [fresh], activeId: fresh.id }
      }
      return {
        ...current,
        automations: remaining,
        activeId: current.activeId === id ? remaining[0].id : current.activeId,
      }
    })
    setNotice(null)
  }

  const errors = validateAutomation(active)

  const exportYaml = () => {
    try {
      const yaml = automationToYaml(active)
      downloadText(`${slugify(active.name)}.yaml`, yaml)
      setNotice({ tone: 'ok', message: 'Automation YAML downloaded.' })
    } catch (error) {
      setNotice({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Could not export this automation.',
      })
    }
  }

  const copyYaml = async () => {
    try {
      const yaml = automationToYaml(active)
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard access is unavailable. Use Export YAML instead.')
      }
      await navigator.clipboard.writeText(yaml)
      setNotice({ tone: 'ok', message: 'Automation YAML copied to the clipboard.' })
    } catch (error) {
      setNotice({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Could not copy the YAML.',
      })
    }
  }

  const saveToHomeAssistant = async () => {
    if (!hass?.callApi) return

    setSaving(true)
    try {
      const body = automationToHomeAssistant(active)
      await hass.callApi(
        'POST',
        `config/automation/config/${encodeURIComponent(active.id)}`,
        body,
      )
      setNotice({ tone: 'ok', message: 'Saved to Home Assistant.' })
    } catch (error) {
      setNotice({
        tone: 'error',
        message:
          error instanceof Error ? error.message : 'Home Assistant could not save this automation.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="automation-page">
      <aside className="automation-sidebar" aria-label="Automations">
        <div className="automation-sidebar-head">
          <div>
            <p className="eyebrow">Build</p>
            <h2>Automations</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={addAutomation}
            aria-label="New automation"
            title="New automation"
          >
            <Icon name="plus" size={18} />
          </button>
        </div>

        <div className="automation-list">
          {store.automations.map((automation) => {
            const selected = automation.id === active.id
            return (
              <div
                key={automation.id}
                className={`automation-list-item ${selected ? 'is-active' : ''}`}
              >
                <button
                  type="button"
                  className="automation-list-main"
                  onClick={() => setActiveId(automation.id)}
                  aria-current={selected ? 'true' : undefined}
                >
                  <span className="automation-list-name">{automation.name}</span>
                  <span className="automation-list-meta">
                    {automation.nodes.length} nodes · {automation.mode}
                  </span>
                </button>
                <button
                  type="button"
                  className="tool-button danger"
                  onClick={() => removeAutomation(automation.id)}
                  aria-label={`Delete ${automation.name}`}
                  title="Delete automation"
                >
                  <Icon name="trash" size={15} />
                </button>
              </div>
            )
          })}
        </div>

        <div className="automation-sidebar-footer">
          <button type="button" className="button ghost" onClick={addAutomation}>
            <Icon name="plus" size={16} />
            New automation
          </button>
          <p className="hint">
            Graphs are saved in this browser. Export the YAML to add an automation to Home
            Assistant.
          </p>
        </div>
      </aside>

      <div className="automation-main">
        <div className="automation-top">
          <div className="automation-head-row">
            <div className="automation-title-block">
              <p className="eyebrow">Automation graph</p>
              <input
                className="automation-name-input"
                value={active.name}
                maxLength={80}
                aria-label="Automation name"
                onChange={(event) => updateActive({ name: event.target.value })}
              />
            </div>

            <div className="automation-toolbar">
              <span
                className={`validation-badge ${errors.length === 0 ? 'is-valid' : 'is-invalid'}`}
                title={errors.join(' ')}
              >
                <Icon name={errors.length === 0 ? 'check' : 'alert'} size={14} />
                {errors.length === 0 ? 'Ready to export' : `${errors.length} to fix`}
              </span>
              <label className="automation-mode">
                <span>Mode</span>
                <select
                  className="text-input"
                  value={active.mode}
                  aria-label="Automation mode"
                  onChange={(event) =>
                    updateActive({ mode: event.target.value as AutomationMode })
                  }
                >
                  {MODE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className="button ghost" onClick={duplicate}>
                <Icon name="copy" size={16} />
                Duplicate
              </button>
              <button type="button" className="button ghost" onClick={copyYaml}>
                <Icon name="copy" size={16} />
                Copy YAML
              </button>
              {hass?.callApi ? (
                <button
                  type="button"
                  className="button ghost"
                  onClick={saveToHomeAssistant}
                  disabled={saving || errors.length > 0}
                >
                  <Icon name="plug" size={16} />
                  {saving ? 'Saving…' : 'Save to HA'}
                </button>
              ) : null}
              <button type="button" className="button primary" onClick={exportYaml}>
                <Icon name="download" size={16} />
                Export YAML
              </button>
            </div>
          </div>

          <textarea
            className="automation-description-input"
            value={active.description}
            maxLength={300}
            rows={2}
            placeholder="Describe what this automation does…"
            aria-label="Automation description"
            onChange={(event) => updateActive({ description: event.target.value })}
          />
        </div>

        {notice ? (
          <div className={`automation-notice tone-${notice.tone}`} role="alert">
            <Icon name={notice.tone === 'ok' ? 'check' : 'alert'} size={16} />
            <span>{notice.message}</span>
            <button
              type="button"
              className="tool-button"
              onClick={() => setNotice(null)}
              aria-label="Dismiss notice"
            >
              <Icon name="x" size={15} />
            </button>
          </div>
        ) : null}

        {errors.length > 0 ? (
          <div className="automation-warning" role="status">
            <Icon name="alert" size={16} />
            <span>{errors[0]}</span>
            {errors.length > 1 ? <span>+{errors.length - 1} more</span> : null}
          </div>
        ) : null}

        <AutomationCanvas
          key={active.id}
          automation={active}
          entities={entities}
          colorMode={colorMode}
          onChange={(patch) => updateActive(patch)}
        />

        <footer className="automation-footer">
          <span>{active.nodes.length} nodes · {active.edges.length} connections</span>
          <span>Home Assistant automation YAML · saved locally</span>
        </footer>
      </div>
    </div>
  )
}
