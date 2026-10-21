import { createId } from '../lib/id'
import { createAutomationStore } from './demo'
import {
  ACTION_TYPES,
  AUTOMATION_MODES,
  AUTOMATION_NODE_KINDS,
  CONDITION_TYPES,
  DELAY_UNITS,
  TRIGGER_TYPES,
  type AutomationEdge,
  type AutomationNode,
  type AutomationNodeConfig,
  type AutomationRecord,
  type AutomationStore,
} from './types'

export const AUTOMATIONS_KEY = 'dash.automations.v1'

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

function coordinate(value: unknown, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return Math.min(10000, Math.max(-2000, value))
}

function sanitizeConfig(raw: unknown): AutomationNodeConfig {
  if (!isRecord(raw)) return {}
  const config: AutomationNodeConfig = {}

  if (raw.triggerType !== undefined) {
    config.triggerType = oneOf(raw.triggerType, TRIGGER_TYPES, 'state')
  }
  if (raw.conditionType !== undefined) {
    config.conditionType = oneOf(raw.conditionType, CONDITION_TYPES, 'state')
  }
  if (raw.actionType !== undefined) {
    config.actionType = oneOf(raw.actionType, ACTION_TYPES, 'service')
  }
  if (typeof raw.entityId === 'string' && raw.entityId.trim()) {
    config.entityId = raw.entityId.trim().slice(0, 120)
  }

  const strings: Array<
    'from' | 'to' | 'state' | 'at' | 'offset' | 'after' | 'before' | 'service' | 'message'
  > = ['from', 'to', 'state', 'at', 'offset', 'after', 'before', 'service', 'message']
  for (const key of strings) {
    if (typeof raw[key] === 'string') config[key] = (raw[key] as string).slice(0, 300)
  }

  if (raw.sunEvent === 'sunrise' || raw.sunEvent === 'sunset') {
    config.sunEvent = raw.sunEvent
  }
  if (typeof raw.duration === 'number' && Number.isFinite(raw.duration)) {
    config.duration = Math.min(86400, Math.max(0, raw.duration))
  }
  if (raw.unit !== undefined) {
    config.unit = oneOf(raw.unit, DELAY_UNITS, 'minutes')
  }

  return config
}

function sanitizeNode(raw: unknown, usedIds: Set<string>): AutomationNode | null {
  if (!isRecord(raw)) return null

  const kind = oneOf(raw.kind, AUTOMATION_NODE_KINDS, 'action')
  let id = typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim().slice(0, 80) : createId('node')
  if (usedIds.has(id)) id = createId('node')
  usedIds.add(id)

  return {
    id,
    kind,
    label: text(raw.label, '', 80),
    x: coordinate(raw.x, 0),
    y: coordinate(raw.y, 0),
    config: sanitizeConfig(raw.config),
  }
}

function sanitizeAutomation(raw: unknown, index: number): AutomationRecord | null {
  if (!isRecord(raw)) return null

  const usedIds = new Set<string>()
  const rawNodes = Array.isArray(raw.nodes) ? raw.nodes.slice(0, 200) : []
  const nodes = rawNodes
    .map((node) => sanitizeNode(node, usedIds))
    .filter((node): node is AutomationNode => node !== null)
  const nodeIds = new Set(nodes.map((node) => node.id))

  const seenEdges = new Set<string>()
  const edges: AutomationEdge[] = []
  const rawEdges = Array.isArray(raw.edges) ? raw.edges.slice(0, 400) : []
  for (const edge of rawEdges) {
    if (!isRecord(edge)) continue
    const source = typeof edge.source === 'string' ? edge.source : ''
    const target = typeof edge.target === 'string' ? edge.target : ''
    if (!nodeIds.has(source) || !nodeIds.has(target) || source === target) continue
    const key = `${source}\u0000${target}`
    if (seenEdges.has(key)) continue
    seenEdges.add(key)
    edges.push({ id: createId('edge'), source, target })
  }

  return {
    id:
      typeof raw.id === 'string' && raw.id.trim()
        ? raw.id.trim().slice(0, 80)
        : createId('automation'),
    name: text(raw.name, `Automation ${index + 1}`, 80).trim() || `Automation ${index + 1}`,
    description: text(raw.description, '', 300),
    mode: oneOf(raw.mode, AUTOMATION_MODES, 'single'),
    nodes,
    edges,
    updatedAt:
      typeof raw.updatedAt === 'string' ? raw.updatedAt.slice(0, 40) : new Date().toISOString(),
  }
}

export function sanitizeAutomationStore(raw: unknown): AutomationStore {
  if (!isRecord(raw) || !Array.isArray(raw.automations)) return createAutomationStore()

  const usedAutomationIds = new Set<string>()
  const automations = raw.automations
    .slice(0, 50)
    .map((automation, index) => {
      const sanitized = sanitizeAutomation(automation, index)
      if (!sanitized) return null
      if (usedAutomationIds.has(sanitized.id)) sanitized.id = createId('automation')
      usedAutomationIds.add(sanitized.id)
      return sanitized
    })
    .filter((automation): automation is AutomationRecord => automation !== null)

  if (automations.length === 0) return createAutomationStore()

  const activeId =
    typeof raw.activeId === 'string' &&
    automations.some((automation) => automation.id === raw.activeId)
      ? raw.activeId
      : automations[0].id

  return { version: 1, automations, activeId }
}

function browserStorage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function loadAutomationStore(storage: Storage | null = browserStorage()): AutomationStore {
  if (!storage) return createAutomationStore()

  try {
    const serialized = storage.getItem(AUTOMATIONS_KEY)
    if (!serialized) return createAutomationStore()
    return sanitizeAutomationStore(JSON.parse(serialized))
  } catch {
    return createAutomationStore()
  }
}

export function saveAutomationStore(
  store: AutomationStore,
  storage: Storage | null = browserStorage(),
): void {
  if (!storage) return

  try {
    storage.setItem(AUTOMATIONS_KEY, JSON.stringify(store))
  } catch {
  }
}
