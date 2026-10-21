import type { IconName } from '../components/Icon'
import type { CardType, HomeAssistantEntity } from '../types'
import { domainOf } from './format'

const DOMAIN_ICONS: Record<string, IconName> = {
  light: 'bulb',
  switch: 'power',
  fan: 'power',
  input_boolean: 'power',
  automation: 'bolt',
  sensor: 'activity',
  binary_sensor: 'motion',
  climate: 'thermometer',
  media_player: 'play',
  lock: 'lock',
  cover: 'blinds',
  scene: 'film',
  script: 'wand',
  weather: 'cloud',
  camera: 'eye',
  person: 'home',
  device_tracker: 'home',
}

const TYPE_ICONS: Record<CardType, IconName> = {
  entity: 'home',
  sensor: 'activity',
  action: 'bolt',
  note: 'note',
  group: 'grid',
  gauge: 'gauge',
}

export function iconForCard(
  type: CardType,
  entity: HomeAssistantEntity | undefined,
  entityId?: string,
): IconName {
  if (entity) {
    const domain = domainOf(entity.entity_id)
    if (domain === 'lock') return entity.state === 'locked' ? 'lock' : 'unlock'
    if (DOMAIN_ICONS[domain]) return DOMAIN_ICONS[domain]
  }

  if (entityId) {
    const domain = domainOf(entityId)
    if (DOMAIN_ICONS[domain]) return DOMAIN_ICONS[domain]
  }

  return TYPE_ICONS[type]
}
