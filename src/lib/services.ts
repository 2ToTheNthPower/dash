import type { HomeAssistantEntity } from '../types'

export interface ServiceCall {
  domain: string
  service: string
  data: Record<string, unknown>
}

const TOGGLE_DOMAINS = new Set([
  'light',
  'switch',
  'fan',
  'input_boolean',
  'automation',
  'remote',
  'siren',
])

export function serviceForEntity(entity: HomeAssistantEntity): ServiceCall | null {
  const domain = entity.entity_id.split('.')[0]
  const entityId = entity.entity_id

  if (TOGGLE_DOMAINS.has(domain)) {
    return { domain: 'homeassistant', service: 'toggle', data: { entity_id: entityId } }
  }

  switch (domain) {
    case 'lock':
      return {
        domain: 'lock',
        service: entity.state === 'locked' ? 'unlock' : 'lock',
        data: { entity_id: entityId },
      }
    case 'cover':
      return {
        domain: 'cover',
        service: entity.state === 'open' ? 'close_cover' : 'open_cover',
        data: { entity_id: entityId },
      }
    case 'scene':
      return { domain: 'scene', service: 'turn_on', data: { entity_id: entityId } }
    case 'script':
      return { domain: 'script', service: 'turn_on', data: { entity_id: entityId } }
    default:
      return null
  }
}

export function isActionable(entity: HomeAssistantEntity | undefined): boolean {
  return entity ? serviceForEntity(entity) !== null : false
}

export function nextDemoState(entity: HomeAssistantEntity): string {
  const domain = entity.entity_id.split('.')[0]

  if (TOGGLE_DOMAINS.has(domain)) {
    return entity.state === 'on' ? 'off' : 'on'
  }

  switch (domain) {
    case 'lock':
      return entity.state === 'locked' ? 'unlocked' : 'locked'
    case 'cover':
      return entity.state === 'open' ? 'closed' : 'open'
    default:
      return entity.state
  }
}
