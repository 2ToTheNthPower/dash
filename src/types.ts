export const CARD_TYPES = ['entity', 'sensor', 'action', 'note', 'group', 'gauge'] as const
export type CardType = (typeof CARD_TYPES)[number]

export const CARD_WIDTHS = ['normal', 'wide', 'full'] as const
export type CardWidth = (typeof CARD_WIDTHS)[number]

export const GROUP_COLUMNS = [1, 2, 3] as const
export type GroupColumns = (typeof GROUP_COLUMNS)[number]

export const THEME_MODES = ['system', 'light', 'dark'] as const
export type ThemeMode = (typeof THEME_MODES)[number]

export const ACCENT_NAMES = ['azure', 'violet', 'emerald', 'sunset', 'rose'] as const
export type AccentName = (typeof ACCENT_NAMES)[number]

export const BACKGROUND_STYLES = ['aurora', 'grid', 'plain'] as const
export type BackgroundStyle = (typeof BACKGROUND_STYLES)[number]

export interface DashboardCard {
  id: string
  type: CardType
  title: string
  entityId?: string
  content?: string
  width: CardWidth
  children?: DashboardCard[]
  columns?: GroupColumns
}

export interface DashboardTheme {
  mode: ThemeMode
  accent: AccentName
}

export interface DashboardConfig {
  version: 1
  title: string
  subtitle: string
  cards: DashboardCard[]
  theme: DashboardTheme
  background: BackgroundStyle
}

export interface HomeAssistantEntity {
  entity_id: string
  state: string
  attributes: Record<string, unknown> & {
    friendly_name?: string
    unit_of_measurement?: string
    brightness?: number
    current_temperature?: number
    temperature?: number
    media_title?: string
    min?: number
    max?: number
  }
  last_changed?: string
}

export type EntityMap = Record<string, HomeAssistantEntity>
