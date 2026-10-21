import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CardEditor } from './components/CardEditor'
import { Dashboard } from './components/Dashboard'
import { Header, type AppView, type ConnectionStatus } from './components/Header'
import { HelpPanel } from './components/HelpPanel'
import { Icon } from './components/Icon'
import { Onboarding } from './components/Onboarding'
import { SettingsPanel } from './components/SettingsPanel'

const AutomationView = lazy(() =>
  import('./automation/AutomationView').then((module) => ({
    default: module.AutomationView,
  })),
)

import type {
  DashboardCard,
  DashboardConfig,
  DashboardTheme,
  EntityMap,
} from './types'
import { cloneDefaultConfig, createStarterConfig, demoEntities } from './lib/demo'
import { HomeAssistantClient } from './lib/ha'
import { hassEntities, type HassLike } from './lib/hass'
import {
  countCards,
  findCard,
  insertCard,
  nudgeCard,
  removeCard,
  reorderInGrid,
  updateCard,
} from './lib/cardTree'
import { nextDemoState, serviceForEntity } from './lib/services'
import {
  completeOnboarding,
  entitiesToMap,
  hasCompletedOnboarding,
  hasStoredConfig,
  loadConfig,
  loadHASession,
  saveConfig,
  saveHASession,
} from './lib/storage'
import { applyTheme, resolveMode, systemPrefersDark } from './lib/theme'

export interface AppProps {
  hass?: HassLike
  embedded?: boolean
  themeRoot?: HTMLElement | null
}

interface HistoryState {
  past: DashboardCard[][]
  future: DashboardCard[][]
}

export default function App({ hass, embedded = false, themeRoot = null }: AppProps = {}) {
  const [config, setConfig] = useState<DashboardConfig>(() => loadConfig())
  const [hadStoredConfig] = useState(() => hasStoredConfig())
  const [configReady, setConfigReady] = useState(() => !embedded || hadStoredConfig)
  const [view, setView] = useState<AppView>('dashboard')
  const [editing, setEditing] = useState(false)
  const [entities, setEntities] = useState<EntityMap>(demoEntities)
  const [status, setStatus] = useState<ConnectionStatus>(embedded ? 'connected' : 'demo')
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [onboarding, setOnboarding] = useState(
    () => !embedded && !hasCompletedOnboarding(),
  )
  const [editor, setEditor] = useState<
    { card: DashboardCard | null; parentId: string | null } | undefined
  >(undefined)
  const [prefersDark, setPrefersDark] = useState(
    () => hass?.themes?.darkMode ?? systemPrefersDark(),
  )
  const [historyFlags, setHistoryFlags] = useState({ canUndo: false, canRedo: false })
  const [embeddedOffline, setEmbeddedOffline] = useState(false)

  const configRef = useRef(config)
  configRef.current = config
  const historyRef = useRef<HistoryState>({ past: [], future: [] })

  const initialSession = useMemo(() => loadHASession(), [])
  const [haUrl, setHaUrl] = useState(initialSession?.url ?? '')
  const [haToken, setHaToken] = useState(initialSession?.token ?? '')

  const client = useMemo(() => new HomeAssistantClient(), [])
  const activeEntities = useMemo(
    () => (embedded ? hassEntities(hass) : entities),
    [embedded, entities, hass],
  )

  const syncHistoryFlags = useCallback(() => {
    setHistoryFlags({
      canUndo: historyRef.current.past.length > 0,
      canRedo: historyRef.current.future.length > 0,
    })
  }, [])

  useEffect(() => {
    if (!configReady) return
    saveConfig(config)
  }, [config, configReady])

  useEffect(() => {
    if (!embedded) return
    setStatus('connected')
    setOnboarding(false)
  }, [embedded])

  useEffect(() => {
    if (!embedded || hass) {
      setEmbeddedOffline(false)
      return
    }

    const timer = setTimeout(() => setEmbeddedOffline(true), 8000)
    return () => clearTimeout(timer)
  }, [embedded, hass])

  useEffect(() => {
    if (!embedded || hadStoredConfig || configReady || !hass) return

    const starter = createStarterConfig(hassEntities(hass))
    configRef.current = starter
    setConfig(starter)
    setConfigReady(true)
  }, [configReady, embedded, hadStoredConfig, hass])

  useEffect(() => {
    if (embedded) return
    const media = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!media) return

    const handleChange = (event: MediaQueryListEvent) => setPrefersDark(event.matches)
    setPrefersDark(media.matches)
    media.addEventListener?.('change', handleChange)
    return () => media.removeEventListener?.('change', handleChange)
  }, [embedded])

  useEffect(() => {
    if (!embedded || typeof hass?.themes?.darkMode !== 'boolean') return
    setPrefersDark(hass.themes.darkMode)
  }, [embedded, hass?.themes?.darkMode])

  useEffect(() => {
    applyTheme(
      config.theme,
      config.background,
      themeRoot ?? document.documentElement,
      prefersDark,
    )
  }, [config.theme, config.background, prefersDark, themeRoot])

  useEffect(() => {
    const unsubscribe = client.onEntities((next) => setEntities(next))
    return () => {
      unsubscribe()
      client.disconnect()
    }
  }, [client])

  const resolvedMode = resolveMode(config.theme.mode, prefersDark)

  const replaceCards = useCallback(
    (nextCards: DashboardCard[], record = true) => {
      const current = configRef.current
      if (record) {
        historyRef.current.past = [...historyRef.current.past.slice(-49), current.cards]
        historyRef.current.future = []
      }
      const next = { ...current, cards: nextCards }
      configRef.current = next
      setConfig(next)
      syncHistoryFlags()
    },
    [syncHistoryFlags],
  )

  const undo = useCallback(() => {
    const previous = historyRef.current.past.pop()
    if (!previous) return
    historyRef.current.future.push(configRef.current.cards)
    const next = { ...configRef.current, cards: previous }
    configRef.current = next
    setConfig(next)
    syncHistoryFlags()
  }, [syncHistoryFlags])

  const redo = useCallback(() => {
    const nextCards = historyRef.current.future.pop()
    if (!nextCards) return
    historyRef.current.past.push(configRef.current.cards)
    const next = { ...configRef.current, cards: nextCards }
    configRef.current = next
    setConfig(next)
    syncHistoryFlags()
  }, [syncHistoryFlags])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (
        target &&
        (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable)
      ) {
        return
      }
      if (view !== 'dashboard' || editor || settingsOpen || helpOpen || onboarding) return
      if (!(event.metaKey || event.ctrlKey)) return

      const key = event.key.toLowerCase()
      if (key === 'z') {
        event.preventDefault()
        if (event.shiftKey) redo()
        else undo()
      } else if (key === 'y') {
        event.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [editor, helpOpen, onboarding, redo, settingsOpen, undo, view])

  const handleConnect = useCallback(
    async (url: string, token: string) => {
      setStatus('connecting')
      setConnectionError(null)
      try {
        const states = await client.connect(url, token)
        setEntities(entitiesToMap(states))
        setStatus('connected')
        setHaUrl(url)
        setHaToken(token)
        saveHASession({ url, token })
      } catch (error) {
        setStatus('error')
        setConnectionError(
          error instanceof Error ? error.message : 'Could not connect to Home Assistant.',
        )
        setEntities(demoEntities)
      }
    },
    [client],
  )

  const handleDisconnect = useCallback(() => {
    client.disconnect()
    setStatus('demo')
    setConnectionError(null)
    setEntities(demoEntities)
    setHaToken('')
    saveHASession(null)
  }, [client])

  const handleConfigChange = useCallback((patch: Partial<DashboardConfig>) => {
    setConfig((current) => ({ ...current, ...patch }))
  }, [])

  const handleThemeChange = useCallback((theme: DashboardTheme) => {
    setConfig((current) => ({ ...current, theme }))
  }, [])

  const handleAction = useCallback(
    async (entityId: string) => {
      const entity = activeEntities[entityId]
      if (!entity) return

      const call = serviceForEntity(entity)
      if (!call) return

      if (embedded && hass) {
        try {
          await hass.callService(call.domain, call.service, call.data)
        } catch (error) {
          setConnectionError(
            error instanceof Error ? error.message : 'Home Assistant rejected that action.',
          )
        }
        return
      }

      if (status !== 'connected') {
        setEntities((current) => {
          const existing = current[entityId]
          if (!existing) return current
          return {
            ...current,
            [entityId]: {
              ...existing,
              state: nextDemoState(existing),
              last_changed: new Date().toISOString(),
            },
          }
        })
        return
      }

      try {
        await client.callService(call.domain, call.service, call.data)
      } catch (error) {
        setConnectionError(
          error instanceof Error ? error.message : 'Home Assistant rejected that action.',
        )
        setStatus('error')
      }
    },
    [activeEntities, client, embedded, hass, status],
  )

  const handleSaveCard = useCallback(
    (card: DashboardCard) => {
      const parentId = editor?.parentId ?? null
      const currentCards = configRef.current.cards
      const exists = findCard(currentCards, card.id) !== undefined
      replaceCards(
        exists ? updateCard(currentCards, card) : insertCard(currentCards, card, parentId),
      )
      setEditor(undefined)
    },
    [editor, replaceCards],
  )

  const handleReorder = useCallback(
    (parentId: string | null, fromId: string, toId: string) => {
      replaceCards(reorderInGrid(configRef.current.cards, parentId, fromId, toId))
    },
    [replaceCards],
  )

  const handleNudge = useCallback(
    (id: string, offset: number) => {
      replaceCards(nudgeCard(configRef.current.cards, id, offset))
    },
    [replaceCards],
  )

  const handleRemove = useCallback(
    (id: string) => {
      replaceCards(removeCard(configRef.current.cards, id))
    },
    [replaceCards],
  )

  const handleImport = useCallback((imported: DashboardConfig) => {
    historyRef.current = { past: [], future: [] }
    setHistoryFlags({ canUndo: false, canRedo: false })
    configRef.current = imported
    setConfig(imported)
  }, [])

  const handleReset = useCallback(() => {
    historyRef.current = { past: [], future: [] }
    setHistoryFlags({ canUndo: false, canRedo: false })
    const next = cloneDefaultConfig()
    configRef.current = next
    setConfig(next)
    setEditing(false)
  }, [])

  const openAddCard = useCallback(
    (parentId: string | null = null) => setEditor({ card: null, parentId }),
    [],
  )
  const openEditCard = useCallback(
    (card: DashboardCard) => setEditor({ card, parentId: null }),
    [],
  )
  const closeEditor = useCallback(() => setEditor(undefined), [])
  const closeSettings = useCallback(() => setSettingsOpen(false), [])
  const closeHelp = useCallback(() => setHelpOpen(false), [])

  const finishOnboarding = useCallback((connect: boolean) => {
    completeOnboarding()
    setOnboarding(false)
    if (connect) setSettingsOpen(true)
  }, [])

  if (embedded && embeddedOffline && !hass) {
    return (
      <div className="panel-error">
        <span className="empty-icon">
          <Icon name="alert" size={30} />
        </span>
        <h1>Dash could not reach Home Assistant</h1>
        <p>
          The sidebar panel loaded, but Home Assistant did not pass its authenticated
          connection. Reload the page. If this keeps happening, check the Home Assistant
          logs for the Dash integration.
        </p>
        <button type="button" className="button primary" onClick={() => window.location.reload()}>
          <Icon name="refresh" size={17} />
          Reload Dash
        </button>
      </div>
    )
  }

  return (
    <div className="app">
      <Header
        status={status}
        view={view}
        resolvedMode={resolvedMode}
        onViewChange={setView}
        onToggleMode={() =>
          handleThemeChange({
            ...config.theme,
            mode: resolvedMode === 'dark' ? 'light' : 'dark',
          })
        }
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenHelp={() => setHelpOpen(true)}
      />

      <main className={`app-main ${view === 'automations' ? 'app-main-wide' : ''}`}>
        {view === 'dashboard' ? (
          <>
            <section className="hero">
              <div className="hero-copy">
                <p className="eyebrow">
                  {status === 'connected'
                    ? embedded
                      ? 'Connected through Home Assistant'
                      : 'Live from Home Assistant'
                    : status === 'error'
                      ? 'Home Assistant connection issue'
                      : 'Demo dashboard'}
                </p>
                <h1>{config.title || 'My home'}</h1>
                {config.subtitle ? <p className="subtitle">{config.subtitle}</p> : null}
              </div>

              <div className="toolbar">
                <div className="history-controls" role="group" aria-label="History">
                  <button
                    type="button"
                    className="icon-button"
                    onClick={undo}
                    disabled={!historyFlags.canUndo}
                    aria-label="Undo"
                    title="Undo"
                  >
                    <Icon name="undo" size={18} />
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={redo}
                    disabled={!historyFlags.canRedo}
                    aria-label="Redo"
                    title="Redo"
                  >
                    <Icon name="redo" size={18} />
                  </button>
                </div>

                <div className="segmented view-segmented" role="group" aria-label="Dashboard mode">
                  <button
                    type="button"
                    className={!editing ? 'is-active' : ''}
                    aria-pressed={!editing}
                    onClick={() => setEditing(false)}
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    className={editing ? 'is-active' : ''}
                    aria-pressed={editing}
                    onClick={() => setEditing(true)}
                  >
                    Edit
                  </button>
                </div>

                {editing ? (
                  <button
                    type="button"
                    className="button primary"
                    onClick={() => openAddCard(null)}
                  >
                    <Icon name="plus" size={18} />
                    Add card
                  </button>
                ) : null}
              </div>
            </section>

            {editing ? (
              <div className="edit-banner" role="note">
                <Icon name="grip" size={16} />
                Drag cards by their handle, or use the arrow buttons, to reorder. Add a Grid card
                to nest cards, and use the width options for wide or full cards. Changes save
                automatically.
              </div>
            ) : null}

            <Dashboard
              cards={config.cards}
              entities={activeEntities}
              editing={editing}
              onReorder={handleReorder}
              onNudge={handleNudge}
              onEdit={openEditCard}
              onRemove={handleRemove}
              onAdd={openAddCard}
              onAction={handleAction}
            />

            <footer className="app-footer">
              <span>
                {embedded
                  ? 'Dash · running inside Home Assistant'
                  : 'Dash · a simpler Home Assistant dashboard'}
              </span>
              <span>{countCards(config.cards)} cards · saved automatically</span>
            </footer>
          </>
        ) : (
          <Suspense
            fallback={
              <div className="automation-loading" role="status">
                Loading automation editor…
              </div>
            }
          >
            <AutomationView entities={activeEntities} colorMode={resolvedMode} hass={hass} />
          </Suspense>
        )}
      </main>

      {editor !== undefined ? (
        <CardEditor
          key={editor.card?.id ?? 'new-card'}
          card={editor.card}
          entities={activeEntities}
          onSave={handleSaveCard}
          onClose={closeEditor}
        />
      ) : null}

      {settingsOpen ? (
        <SettingsPanel
          config={config}
          status={status}
          embedded={embedded}
          connectionError={connectionError}
          initialUrl={haUrl}
          initialToken={haToken}
          onConfigChange={handleConfigChange}
          onThemeChange={handleThemeChange}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onImport={handleImport}
          onReset={handleReset}
          onClose={closeSettings}
        />
      ) : null}

      {helpOpen ? (
        <HelpPanel
          onClose={closeHelp}
          onOpenSettings={() => {
            setHelpOpen(false)
            setSettingsOpen(true)
          }}
        />
      ) : null}

      {onboarding ? (
        <Onboarding
          onDemo={() => finishOnboarding(false)}
          onConnect={() => finishOnboarding(true)}
        />
      ) : null}
    </div>
  )
}
