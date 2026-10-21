import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import type { DashboardConfig, DashboardTheme, ThemeMode } from '../types'
import { ACCENTS, BACKGROUNDS } from '../lib/theme'
import { parseConfigJson, serializeConfig } from '../lib/storage'
import { websocketUrl } from '../lib/ha'
import type { ConnectionStatus } from './Header'
import { Icon } from './Icon'

interface SettingsPanelProps {
  config: DashboardConfig
  status: ConnectionStatus
  embedded?: boolean
  connectionError: string | null
  initialUrl: string
  initialToken: string
  onConfigChange: (patch: Partial<DashboardConfig>) => void
  onThemeChange: (theme: DashboardTheme) => void
  onConnect: (url: string, token: string) => void
  onDisconnect: () => void
  onImport: (config: DashboardConfig) => void
  onReset: () => void
  onClose: () => void
}

const MODES: { id: ThemeMode; label: string; icon: 'monitor' | 'sun' | 'moon' }[] = [
  { id: 'system', label: 'System', icon: 'monitor' },
  { id: 'light', label: 'Light', icon: 'sun' },
  { id: 'dark', label: 'Dark', icon: 'moon' },
]

const STATUS_TEXT: Record<ConnectionStatus, string> = {
  demo: 'Using demo data',
  connecting: 'Connecting to Home Assistant…',
  connected: 'Connected to Home Assistant',
  error: 'Could not connect',
}

export function SettingsPanel({
  config,
  status,
  embedded = false,
  connectionError,
  initialUrl,
  initialToken,
  onConfigChange,
  onThemeChange,
  onConnect,
  onDisconnect,
  onImport,
  onReset,
  onClose,
}: SettingsPanelProps) {
  const [url, setUrl] = useState(initialUrl)
  const [token, setToken] = useState(initialToken)
  const [showToken, setShowToken] = useState(false)
  const [importError, setImportError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  let endpoint = ''
  try {
    endpoint = url.trim() ? websocketUrl(url) : ''
  } catch {
    endpoint = ''
  }
  const pageUrl = endpoint
    ? endpoint.replace(/^ws/, 'http').replace(/\/api\/websocket$/, '/')
    : ''

  const connected = status === 'connected'
  const connecting = status === 'connecting'

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleConnect = (event: FormEvent) => {
    event.preventDefault()
    onConnect(url, token)
  }

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const imported = parseConfigJson(await file.text())
      onImport(imported)
      setImportError('')
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Could not import that file.')
    } finally {
      event.target.value = ''
    }
  }

  const handleExport = () => {
    if (typeof URL.createObjectURL !== 'function') {
      setImportError('Export is not supported in this browser.')
      return
    }

    const blob = new Blob([serializeConfig(config)], { type: 'application/json' })
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = 'dash-dashboard.json'
    link.click()
    URL.revokeObjectURL(objectUrl)
  }

  return (
    <div
      className="overlay panel-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <aside
        className="settings-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="modal-header sticky">
          <div>
            <p className="eyebrow">Make it yours</p>
            <h2 id="settings-title">Settings</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close settings"
          >
            <Icon name="x" />
          </button>
        </div>

        <div className="settings-scroll">
          <section className="settings-section">
            <h3>Appearance</h3>

            <div className="field">
              <span className="field-label">Theme</span>
              <div className="segmented mode-segmented" role="group" aria-label="Theme mode">
                {MODES.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    className={config.theme.mode === mode.id ? 'is-active' : ''}
                    aria-pressed={config.theme.mode === mode.id}
                    onClick={() => onThemeChange({ ...config.theme, mode: mode.id })}
                  >
                    <Icon name={mode.icon} size={16} />
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <span className="field-label">Accent</span>
              <div className="swatch-row" role="group" aria-label="Accent colour">
                {ACCENTS.map((accent) => (
                  <button
                    key={accent.id}
                    type="button"
                    className={`swatch ${config.theme.accent === accent.id ? 'is-selected' : ''}`}
                    style={{
                      background: `linear-gradient(135deg, ${accent.light}, ${accent.dark})`,
                    }}
                    aria-label={`${accent.label} accent`}
                    aria-pressed={config.theme.accent === accent.id}
                    title={accent.label}
                    onClick={() => onThemeChange({ ...config.theme, accent: accent.id })}
                  >
                    {config.theme.accent === accent.id ? <Icon name="check" size={15} /> : null}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <span className="field-label">Background</span>
              <div className="background-row" role="group" aria-label="Background style">
                {BACKGROUNDS.map((background) => (
                  <button
                    key={background.id}
                    type="button"
                    className={`background-choice bg-${background.id} ${
                      config.background === background.id ? 'is-selected' : ''
                    }`}
                    aria-pressed={config.background === background.id}
                    onClick={() => onConfigChange({ background: background.id })}
                  >
                    <span>{background.label}</span>
                    <small>{background.description}</small>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="settings-section">
            <h3>Dashboard</h3>
            <label className="field">
              <span className="field-label">Title</span>
              <input
                className="text-input"
                value={config.title}
                maxLength={60}
                onChange={(event) => onConfigChange({ title: event.target.value })}
              />
            </label>
            <label className="field">
              <span className="field-label">Subtitle</span>
              <input
                className="text-input"
                value={config.subtitle}
                maxLength={160}
                onChange={(event) => onConfigChange({ subtitle: event.target.value })}
              />
            </label>
          </section>

          <section className="settings-section">
            <div className="section-heading">
              <h3>Home Assistant</h3>
              <span className={`mini-status status-${status}`}>
                <span className="status-dot" aria-hidden="true" />
                {embedded ? 'Connected automatically' : STATUS_TEXT[status]}
              </span>
            </div>

            {embedded ? (
              <div className="embedded-note">
                <span className="embedded-note-icon">
                  <Icon name="check" size={18} />
                </span>
                <div>
                  <strong>Running inside Home Assistant</strong>
                  <p>
                    Your login, entities, and services are provided by Home Assistant. There is no
                    token to copy and no second connection to manage.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <form onSubmit={handleConnect} className="connection-form">
                  <label className="field">
                    <span className="field-label">Home Assistant address</span>
                    <input
                      className="text-input"
                      value={url}
                      onChange={(event) => setUrl(event.target.value)}
                      placeholder="http://192.168.1.50:8123"
                      spellCheck={false}
                      autoComplete="off"
                      disabled={connecting}
                    />
                    <span className="field-hint">
                      Paste the address you use to open Home Assistant. If
                      homeassistant.local does not work, use the numeric IP or your Nabu
                      Casa URL. A dashboard URL ending in /lovelace/0 is fine.
                    </span>
                  </label>
                  <label className="field">
                    <span className="field-label">Long-lived access token</span>
                    <div className="token-row">
                      <input
                        className="text-input"
                        type={showToken ? 'text' : 'password'}
                        value={token}
                        onChange={(event) => setToken(event.target.value)}
                        placeholder="Paste a token from your HA profile"
                        spellCheck={false}
                        autoComplete="off"
                        disabled={connecting}
                      />
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => setShowToken((value) => !value)}
                        aria-label={showToken ? 'Hide token' : 'Show token'}
                        title={showToken ? 'Hide token' : 'Show token'}
                      >
                        <Icon name={showToken ? 'eye-off' : 'eye'} size={18} />
                      </button>
                    </div>
                  </label>

                  {connectionError ? (
                    <>
                      <p className="form-error" role="alert">
                        <Icon name="alert" size={16} />
                        {connectionError}
                      </p>
                      {endpoint ? (
                        <p className="endpoint-preview">
                          Tried <code>{endpoint}</code>
                        </p>
                      ) : null}
                      <ul className="connection-tips">
                        <li>
                          If <strong>Open Home Assistant</strong> works but Connect fails, your
                          browser is blocking this page's local-network or WebSocket access.
                          Use the HACS sidebar panel instead — it runs inside Home Assistant
                          and needs no connection.
                        </li>
                        <li>
                          Use the same http/https scheme as the address in your browser. If
                          Home Assistant opens with <code>https://</code>, include it here.
                        </li>
                        <li>
                          If <code>homeassistant.local</code> does not open, use your Home
                          Assistant IP address instead, such as{' '}
                          <code>http://192.168.1.50:8123</code>, or your Nabu Casa address.
                        </li>
                      </ul>
                      {pageUrl ? (
                        <div className="connection-actions">
                          <a
                            className="button primary"
                            href={pageUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Icon name="plug" size={16} />
                            Open Home Assistant
                          </a>
                        </div>
                      ) : null}
                    </>
                  ) : null}

                  <div className="connection-actions">
                    <button
                      type="submit"
                      className="button primary"
                      disabled={connecting || !url.trim() || !token.trim()}
                    >
                      <Icon name="plug" size={17} />
                      {connecting ? 'Connecting…' : connected ? 'Reconnect' : 'Connect'}
                    </button>
                    {connected ? (
                      <button type="button" className="button ghost" onClick={onDisconnect}>
                        Disconnect
                      </button>
                    ) : null}
                  </div>
                </form>

                <p className="hint">
                  Create a token under Profile → Security → Long-lived access tokens. It is kept in
                  this tab only (session storage) and never leaves your browser except to talk to
                  your Home Assistant.
                </p>
              </>
            )}
          </section>

          <section className="settings-section">
            <h3>Dashboard data</h3>
            <p className="hint">
              Your layout and theme are saved in this browser. Export a copy to move it to another
              device.
            </p>
            <div className="data-actions">
              <button type="button" className="button ghost" onClick={handleExport}>
                <Icon name="download" size={17} />
                Export JSON
              </button>
              <button
                type="button"
                className="button ghost"
                onClick={() => fileRef.current?.click()}
              >
                <Icon name="upload" size={17} />
                Import JSON
              </button>
              <button
                type="button"
                className="button ghost danger-text"
                onClick={() => {
                  if (window.confirm('Reset the dashboard to the demo layout? This cannot be undone.')) {
                    onReset()
                  }
                }}
              >
                <Icon name="refresh" size={17} />
                Reset to demo
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImport}
              hidden
            />
            {importError ? (
              <p className="form-error" role="alert">
                <Icon name="alert" size={16} />
                {importError}
              </p>
            ) : null}
          </section>
        </div>
      </aside>
    </div>
  )
}
