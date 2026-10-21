import { stringify } from 'yaml'
import { createId } from '../lib/id'
import { prettifyId } from '../lib/format'
import type {
  AutomationEdge,
  AutomationNode,
  AutomationNodeConfig,
  AutomationRecord,
  DelayUnit,
  NodeVariant,
  TriggerType,
} from './types'

const DEFAULT_SERVICE = 'light.turn_on'
const DEFAULT_SCENE_SERVICE = 'scene.turn_on'
const DEFAULT_NOTIFY_SERVICE = 'notify.notify'

export function createNode(
  kind: AutomationNode['kind'],
  position: { x: number; y: number },
  variant: NodeVariant = {},
): AutomationNode {
  const config: AutomationNodeConfig = {}

  if (kind === 'trigger') {
    const triggerType: TriggerType = variant.triggerType ?? 'state'
    config.triggerType = triggerType
    if (triggerType === 'state') {
      config.entityId = 'binary_sensor.hallway_motion'
      config.to = 'on'
    } else if (triggerType === 'time') {
      config.at = '07:00:00'
    } else {
      config.sunEvent = 'sunrise'
      config.offset = '-00:30:00'
    }
  }

  if (kind === 'condition') {
    const conditionType = variant.conditionType ?? 'state'
    config.conditionType = conditionType
    if (conditionType === 'state') {
      config.entityId = 'sun.sun'
      config.state = 'below_horizon'
    } else {
      config.after = '22:00:00'
      config.before = '06:00:00'
    }
  }

  if (kind === 'action') {
    const actionType = variant.actionType ?? 'service'
    config.actionType = actionType
    if (actionType === 'scene') {
      config.service = DEFAULT_SCENE_SERVICE
      config.entityId = 'scene.movie_night'
    } else if (actionType === 'notify') {
      config.service = DEFAULT_NOTIFY_SERVICE
      config.message = 'Someone is at the door'
    } else {
      config.service = DEFAULT_SERVICE
      config.entityId = 'light.living_room'
    }
  }

  if (kind === 'delay') {
    config.duration = 3
    config.unit = 'minutes'
  }

  return {
    id: createId('node'),
    kind,
    label: defaultLabel(kind, config),
    x: position.x,
    y: position.y,
    config,
  }
}

function defaultLabel(kind: AutomationNode['kind'], config: AutomationNodeConfig): string {
  if (kind === 'trigger') {
    if (config.triggerType === 'time') return 'Time schedule'
    if (config.triggerType === 'sun') return 'Sun event'
    return 'State change'
  }
  if (kind === 'condition') {
    return config.conditionType === 'time' ? 'Time window' : 'Entity state'
  }
  if (kind === 'action') {
    if (config.actionType === 'scene') return 'Run scene'
    if (config.actionType === 'notify') return 'Notification'
    return 'Call service'
  }
  return 'Delay'
}

function entityLabel(entityId: string | undefined): string {
  return entityId ? prettifyId(entityId) : 'Entity'
}

export function nodeSummary(node: AutomationNode): string {
  const config = node.config

  if (node.kind === 'trigger') {
    if (config.triggerType === 'time') return config.at ? `At ${config.at}` : 'At a set time'
    if (config.triggerType === 'sun') {
      const event = config.sunEvent ?? 'sunrise'
      return config.offset ? `${event} (${config.offset})` : event
    }

    const entity = entityLabel(config.entityId)
    if (config.from && config.to) return `${entity}: ${config.from} → ${config.to}`
    if (config.to) return `${entity} becomes ${config.to}`
    if (config.from) return `${entity} leaves ${config.from}`
    return `${entity} changes`
  }

  if (node.kind === 'condition') {
    if (config.conditionType === 'time') {
      if (config.after && config.before) return `${config.after} – ${config.before}`
      if (config.after) return `After ${config.after}`
      if (config.before) return `Before ${config.before}`
      return 'A time window'
    }
    return `${entityLabel(config.entityId)} is ${config.state ?? '…'}`
  }

  if (node.kind === 'action') {
    if (config.actionType === 'scene') return `Activate ${entityLabel(config.entityId)}`
    if (config.actionType === 'notify') return config.message || 'Send a notification'
    const target = config.entityId ? ` · ${entityLabel(config.entityId)}` : ''
    return `${config.service ?? DEFAULT_SERVICE}${target}`
  }

  const unit = config.unit ?? 'minutes'
  return `Wait ${config.duration ?? 1} ${unit}`
}

export function topologicalNodeIds(
  nodes: readonly AutomationNode[],
  edges: readonly AutomationEdge[],
): string[] {
  const byId = new Map(nodes.map((node) => [node.id, node]))
  const incoming = new Map(nodes.map((node) => [node.id, 0]))
  const adjacency = new Map(nodes.map((node) => [node.id, [] as string[]]))

  for (const edge of edges) {
    if (!byId.has(edge.source) || !byId.has(edge.target) || edge.source === edge.target) continue
    adjacency.get(edge.source)?.push(edge.target)
    incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1)
  }

  const compare = (left: AutomationNode, right: AutomationNode) =>
    left.x - right.x || left.y - right.y || left.id.localeCompare(right.id)

  const ready = nodes.filter((node) => incoming.get(node.id) === 0).sort(compare)
  const ordered: string[] = []

  while (ready.length > 0) {
    const node = ready.shift()
    if (!node) break
    ordered.push(node.id)

    for (const targetId of adjacency.get(node.id) ?? []) {
      const remaining = (incoming.get(targetId) ?? 1) - 1
      incoming.set(targetId, remaining)
      if (remaining === 0) {
        const target = byId.get(targetId)
        if (target) {
          ready.push(target)
          ready.sort(compare)
        }
      }
    }
  }

  const remaining = nodes.filter((node) => !ordered.includes(node.id)).sort(compare)
  return [...ordered, ...remaining.map((node) => node.id)]
}

function canReach(
  edges: readonly AutomationEdge[],
  start: string,
  target: string,
): boolean {
  const stack = [start]
  const seen = new Set<string>()

  while (stack.length > 0) {
    const current = stack.pop()
    if (!current || seen.has(current)) continue
    if (current === target) return true
    seen.add(current)
    for (const edge of edges) {
      if (edge.source === current) stack.push(edge.target)
    }
  }

  return false
}

export function connectNodes(
  nodes: readonly AutomationNode[],
  edges: readonly AutomationEdge[],
  source: string,
  target: string,
): { edges: AutomationEdge[]; error: string | null } {
  if (source === target) {
    return { edges: [...edges], error: 'A node cannot connect to itself.' }
  }
  if (!nodes.some((node) => node.id === source) || !nodes.some((node) => node.id === target)) {
    return { edges: [...edges], error: 'Both nodes must exist.' }
  }
  if (edges.some((edge) => edge.source === source && edge.target === target)) {
    return { edges: [...edges], error: 'Those nodes are already connected.' }
  }
  if (canReach(edges, target, source)) {
    return { edges: [...edges], error: 'That connection would create a loop.' }
  }

  return {
    edges: [...edges, { id: createId('edge'), source, target }],
    error: null,
  }
}

export function validateAutomation(record: AutomationRecord): string[] {
  const errors: string[] = []
  const triggers = record.nodes.filter((node) => node.kind === 'trigger')
  const actions = record.nodes.filter(
    (node) => node.kind === 'action' || node.kind === 'delay',
  )

  if (triggers.length === 0) errors.push('Add at least one trigger.')
  if (actions.length === 0) errors.push('Add at least one action.')

  for (const node of record.nodes) {
    const config = node.config

    if (node.kind === 'trigger') {
      if (config.triggerType === 'time' && !config.at) {
        errors.push(`"${node.label}" needs a time.`)
      }
      if (config.triggerType === 'sun' && !config.sunEvent) {
        errors.push(`"${node.label}" needs a sun event.`)
      }
      if ((config.triggerType ?? 'state') === 'state' && !config.entityId) {
        errors.push(`"${node.label}" needs an entity.`)
      }
    }

    if (node.kind === 'condition') {
      if ((config.conditionType ?? 'state') === 'state') {
        if (!config.entityId) errors.push(`"${node.label}" needs an entity.`)
        if (!config.state) errors.push(`"${node.label}" needs a state.`)
      } else if (!config.after && !config.before) {
        errors.push(`"${node.label}" needs an after or before time.`)
      }
    }

    if (node.kind === 'action') {
      if (config.actionType === 'scene' && !config.entityId) {
        errors.push(`"${node.label}" needs a scene entity.`)
      }
      if (config.actionType === 'notify' && !config.message) {
        errors.push(`"${node.label}" needs a message.`)
      }
      if ((config.actionType ?? 'service') === 'service') {
        if (!config.service || !/^[a-z0-9_]+\.[a-z0-9_]+$/.test(config.service)) {
          errors.push(`"${node.label}" needs a service such as light.turn_on.`)
        }
      }
    }

    if (node.kind === 'delay') {
      if (!config.duration || config.duration <= 0) {
        errors.push(`"${node.label}" needs a duration above zero.`)
      }
    }
  }

  return errors
}

function triggerConfig(node: AutomationNode): Record<string, unknown> {
  const config = node.config

  if (config.triggerType === 'time') {
    return { platform: 'time', at: config.at }
  }
  if (config.triggerType === 'sun') {
    return {
      platform: 'sun',
      event: config.sunEvent ?? 'sunrise',
      ...(config.offset ? { offset: config.offset } : {}),
    }
  }

  return {
    platform: 'state',
    entity_id: config.entityId,
    ...(config.from ? { from: config.from } : {}),
    ...(config.to ? { to: config.to } : {}),
  }
}

function conditionConfig(node: AutomationNode): Record<string, unknown> {
  const config = node.config

  if (config.conditionType === 'time') {
    return {
      condition: 'time',
      ...(config.after ? { after: config.after } : {}),
      ...(config.before ? { before: config.before } : {}),
    }
  }

  return {
    condition: 'state',
    entity_id: config.entityId,
    state: config.state,
  }
}

function actionConfig(node: AutomationNode): Record<string, unknown> {
  const config = node.config

  if (node.kind === 'delay') {
    const unit: DelayUnit = config.unit ?? 'minutes'
    return { delay: { [unit]: config.duration ?? 1 } }
  }

  if (config.actionType === 'scene') {
    return {
      service: DEFAULT_SCENE_SERVICE,
      target: { entity_id: config.entityId },
    }
  }

  if (config.actionType === 'notify') {
    return {
      service: config.service || DEFAULT_NOTIFY_SERVICE,
      data: { message: config.message ?? '' },
    }
  }

  return {
    service: config.service,
    ...(config.entityId ? { target: { entity_id: config.entityId } } : {}),
  }
}

export function automationToHomeAssistant(record: AutomationRecord): Record<string, unknown> {
  const errors = validateAutomation(record)
  if (errors.length > 0) throw new Error(errors.join(' '))

  const byId = new Map(record.nodes.map((node) => [node.id, node]))
  const ordered = topologicalNodeIds(record.nodes, record.edges)
    .map((id) => byId.get(id))
    .filter((node): node is AutomationNode => node !== undefined)

  const triggers = ordered.filter((node) => node.kind === 'trigger')
  const conditions = ordered.filter((node) => node.kind === 'condition')
  const actions = ordered.filter((node) => node.kind === 'action' || node.kind === 'delay')

  return {
    id: record.id,
    alias: record.name.trim() || 'Untitled automation',
    ...(record.description.trim() ? { description: record.description.trim() } : {}),
    mode: record.mode,
    trigger: triggers.map(triggerConfig),
    ...(conditions.length > 0 ? { condition: conditions.map(conditionConfig) } : {}),
    action: actions.map(actionConfig),
  }
}

export function automationToYaml(record: AutomationRecord): string {
  return stringify(automationToHomeAssistant(record), { lineWidth: 0 })
}
