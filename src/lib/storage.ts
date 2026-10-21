import {
  ACCENT_NAMES,
  BACKGROUND_STYLES,
  CARD_TYPES,
  CARD_WIDTHS,
  GROUP_COLUMNS,
  THEME_MODES,
  type DashboardCard,
  type DashboardConfig,
  type HomeAssistantEntity,
} from '../types'
import { createDefaultConfig } from './demo'
import { createId } from './id'

export const CONFIG_KEY = 'dash.dashboard.v1'
export const HA_SESSION_KEY = 'dash.ha.session.v1'
export const ONBOARDING_KEY = 'dash.onboarded.v1'

export interface HASession {
  url: string
  token: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function text(value: unknown, fallback: string, maxLength: number): string {
  if (typeof value !== 'string') return fallback
  return value.slice(0, maxLength)
}

function oneOf<T extends string>(value: unknown, options: readonly T[], fallback: T): T {
  return typeof value === 'string' && (options as readonly string[]).includes(value)
    ? (value as T)
    : fallback
}

function sanitizeCard(raw: unknown, usedIds: Set<string>, depth = 0): DashboardCard | null {
  if (!isRecord(raw)) return null

  const type = oneOf(raw.type, CARD_TYPES, 'entity')
  let id = typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim().slice(0, 80) : createId()
  if (usedIds.has(id)) id = createId()
  usedIds.add(id)

  const entityId =
    typeof raw.entityId === 'string' && raw.entityId.trim()
      ? raw.entityId.trim().slice(0, 120)
      : undefined

  const card: DashboardCard = {
    id,
    type,
    title: text(raw.title, '', 80).trim(),
    entityId,
    content: text(raw.content, '', 2000),
    width: oneOf(raw.width, CARD_WIDTHS, 'normal'),
  }

  if (type === 'group') {
    const columns = GROUP_COLUMNS.find((column) => column === raw.columns) ?? 2
    const rawChildren = Array.isArray(raw.children) ? raw.children : []
    const children =
      depth >= 4
        ? []
        : rawChildren
            .map((child) => sanitizeCard(child, usedIds, depth + 1))
            .filter((child): child is DashboardCard => child !== null)

    card.columns = columns
    card.children = children
    card.entityId = undefined
    card.content = ''
  }

  return card
}

export function sanitizeConfig(raw: unknown): DashboardConfig {
  const fallback = createDefaultConfig()
  if (!isRecord(raw)) return fallback

  const theme = isRecord(raw.theme) ? raw.theme : {}
  const usedIds = new Set<string>()
  const rawCards = Array.isArray(raw.cards) ? raw.cards : fallback.cards
  const cards = rawCards
    .map((card) => sanitizeCard(card, usedIds))
    .filter((card): card is DashboardCard => card !== null)

  return {
    version: 1,
    title: text(raw.title, fallback.title, 60).trim() || fallback.title,
    subtitle: text(raw.subtitle, fallback.subtitle, 160),
    cards,
    theme: {
      mode: oneOf(theme.mode, THEME_MODES, fallback.theme.mode),
      accent: oneOf(theme.accent, ACCENT_NAMES, fallback.theme.accent),
    },
    background: oneOf(raw.background, BACKGROUND_STYLES, fallback.background),
  }
}

function browserStorage(kind: 'local' | 'session'): Storage | null {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage
  } catch {
    return null
  }
}

export function loadConfig(storage: Storage | null = browserStorage('local')): DashboardConfig {
  if (!storage) return createDefaultConfig()

  try {
    const serialized = storage.getItem(CONFIG_KEY)
    if (!serialized) return createDefaultConfig()
    return sanitizeConfig(JSON.parse(serialized))
  } catch {
    return createDefaultConfig()
  }
}

export function saveConfig(
  config: DashboardConfig,
  storage: Storage | null = browserStorage('local'),
): void {
  if (!storage) return

  try {
    storage.setItem(CONFIG_KEY, JSON.stringify(config))
  } catch {
  }
}

export function parseConfigJson(serialized: string): DashboardConfig {
  let raw: unknown
  try {
    raw = JSON.parse(serialized)
  } catch {
    throw new Error('That file is not valid JSON.')
  }

  if (!isRecord(raw) || !Array.isArray(raw.cards)) {
    throw new Error('That file does not look like a Dash dashboard.')
  }

  return sanitizeConfig(raw)
}

export function serializeConfig(config: DashboardConfig): string {
  return JSON.stringify(config, null, 2)
}

export function loadHASession(
  storage: Storage | null = browserStorage('session'),
): HASession | null {
  if (!storage) return null

  try {
    const serialized = storage.getItem(HA_SESSION_KEY)
    if (!serialized) return null
    const raw: unknown = JSON.parse(serialized)
    if (!isRecord(raw) || typeof raw.url !== 'string' || typeof raw.token !== 'string') {
      return null
    }
    return { url: raw.url, token: raw.token }
  } catch {
    return null
  }
}

export function saveHASession(
  session: HASession | null,
  storage: Storage | null = browserStorage('session'),
): void {
  if (!storage) return

  try {
    if (session) storage.setItem(HA_SESSION_KEY, JSON.stringify(session))
    else storage.removeItem(HA_SESSION_KEY)
  } catch {
  }
}

export function entitiesToMap(entities: HomeAssistantEntity[]): Record<string, HomeAssistantEntity> {
  return Object.fromEntries(entities.map((entity) => [entity.entity_id, entity]))
}

export function hasStoredConfig(storage: Storage | null = browserStorage('local')): boolean {
  if (!storage) return false

  try {
    return storage.getItem(CONFIG_KEY) !== null
  } catch {
    return false
  }
}

export function hasCompletedOnboarding(
  storage: Storage | null = browserStorage('local'),
): boolean {
  if (!storage) return true

  try {
    return storage.getItem(ONBOARDING_KEY) === '1'
  } catch {
    return true
  }
}

export function completeOnboarding(storage: Storage | null = browserStorage('local')): void {
  if (!storage) return

  try {
    storage.setItem(ONBOARDING_KEY, '1')
  } catch {
  }
}
