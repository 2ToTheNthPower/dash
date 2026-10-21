export const AUTOMATION_NODE_KINDS = ['trigger', 'condition', 'action', 'delay'] as const
export type AutomationNodeKind = (typeof AUTOMATION_NODE_KINDS)[number]

export const TRIGGER_TYPES = ['state', 'time', 'sun'] as const
export type TriggerType = (typeof TRIGGER_TYPES)[number]

export const CONDITION_TYPES = ['state', 'time'] as const
export type ConditionType = (typeof CONDITION_TYPES)[number]

export const ACTION_TYPES = ['service', 'scene', 'notify'] as const
export type ActionType = (typeof ACTION_TYPES)[number]

export const DELAY_UNITS = ['seconds', 'minutes', 'hours'] as const
export type DelayUnit = (typeof DELAY_UNITS)[number]

export const AUTOMATION_MODES = ['single', 'restart', 'queued', 'parallel'] as const
export type AutomationMode = (typeof AUTOMATION_MODES)[number]

export interface AutomationNodeConfig {
  triggerType?: TriggerType
  conditionType?: ConditionType
  actionType?: ActionType
  entityId?: string
  from?: string
  to?: string
  state?: string
  at?: string
  sunEvent?: 'sunrise' | 'sunset'
  offset?: string
  after?: string
  before?: string
  service?: string
  message?: string
  duration?: number
  unit?: DelayUnit
}

export interface AutomationNode {
  id: string
  kind: AutomationNodeKind
  label: string
  x: number
  y: number
  config: AutomationNodeConfig
}

export interface AutomationEdge {
  id: string
  source: string
  target: string
}

export interface AutomationRecord {
  id: string
  name: string
  description: string
  mode: AutomationMode
  nodes: AutomationNode[]
  edges: AutomationEdge[]
  updatedAt: string
}

export interface AutomationStore {
  version: 1
  automations: AutomationRecord[]
  activeId: string
}

export interface NodeVariant {
  triggerType?: TriggerType
  conditionType?: ConditionType
  actionType?: ActionType
}
