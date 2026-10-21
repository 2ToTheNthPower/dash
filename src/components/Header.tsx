import { Icon, type IconName } from './Icon'

export type ConnectionStatus = 'demo' | 'connecting' | 'connected' | 'error'
export type AppView = 'dashboard' | 'automations'

interface HeaderProps {
  status: ConnectionStatus
  view: AppView
  resolvedMode: 'light' | 'dark'
  onViewChange: (view: AppView) => void
  onToggleMode: () => void
  onOpenSettings: () => void
  onOpenHelp: () => void
}

const STATUS_LABELS: Record<ConnectionStatus, string> = {
  demo: 'Demo data',
  connecting: 'Connecting…',
  connected: 'Home Assistant',
  error: 'Connection issue',
}

const NAV_ITEMS: { id: AppView; label: string; icon: IconName }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home' },
  { id: 'automations', label: 'Automations', icon: 'bolt' },
]

export function Header({
  status,
  view,
  resolvedMode,
  onViewChange,
  onToggleMode,
  onOpenSettings,
  onOpenHelp,
}: HeaderProps) {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <Icon name="bolt" size={18} />
        </span>
        <span className="brand-name">Dash</span>
        <span className="brand-tag">home dashboard</span>
      </div>

      <nav className="app-nav" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={view === item.id ? 'is-active' : ''}
            aria-current={view === item.id ? 'page' : undefined}
            onClick={() => onViewChange(item.id)}
          >
            <Icon name={item.icon} size={16} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <button
          type="button"
          className={`status-chip status-${status}`}
          onClick={onOpenSettings}
          aria-label={`${STATUS_LABELS[status]} — open connection settings`}
        >
          <span className="status-dot" aria-hidden="true" />
          <span className="status-label">{STATUS_LABELS[status]}</span>
        </button>

        <button
          type="button"
          className="icon-button"
          onClick={onToggleMode}
          aria-label={resolvedMode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={resolvedMode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          <Icon name={resolvedMode === 'dark' ? 'sun' : 'moon'} />
        </button>

        <button
          type="button"
          className="icon-button"
          onClick={onOpenHelp}
          aria-label="Open help"
          title="Help and tips"
        >
          <Icon name="help" />
        </button>

        <button
          type="button"
          className="icon-button"
          onClick={onOpenSettings}
          aria-label="Open dashboard settings"
          title="Dashboard settings"
        >
          <Icon name="sliders" />
        </button>
      </div>
    </header>
  )
}
