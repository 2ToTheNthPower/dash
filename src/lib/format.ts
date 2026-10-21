import type { HomeAssistantEntity } from '../types'

export interface EntitySummary {
  primary: string
  secondary?: string
}

export function prettifyId(entityId: string): string {
  const objectId = entityId.split('.')[1] ?? entityId
  return objectId
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function entityName(
  entity: HomeAssistantEntity | undefined,
  entityId = '',
  fallback = 'Choose an entity',
): string {
  const friendly = entity?.attributes.friendly_name
  if (typeof friendly === 'string' && friendly.trim()) return friendly
  if (entityId) return prettifyId(entityId)
  return fallback
}

export function domainOf(entityId: string): string {
  return entityId.split('.')[0] ?? ''
}

function isNumericState(state: string): boolean {
  return state.trim() !== '' && Number.isFinite(Number(state))
}

function titleCase(value: string): string {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export function describeEntity(entity: HomeAssistantEntity | undefined): EntitySummary {
  if (!entity) return { primary: 'Not connected' }

  const domain = domainOf(entity.entity_id)
  const state = entity.state
  const unit =
    typeof entity.attributes.unit_of_measurement === 'string'
      ? entity.attributes.unit_of_measurement
      : undefined

  if (state === 'unavailable') return { primary: 'Unavailable' }
  if (state === 'unknown') return { primary: 'Unknown' }

  switch (domain) {
    case 'light': {
      const brightness = entity.attributes.brightness
      if (state === 'on' && typeof brightness === 'number') {
        return { primary: 'On', secondary: `${Math.round((brightness / 255) * 100)}% brightness` }
      }
      return { primary: titleCase(state) }
    }
    case 'lock':
      return { primary: state === 'locked' ? 'Locked' : titleCase(state) }
    case 'cover':
      return { primary: titleCase(state) }
    case 'scene':
      return { primary: 'Ready', secondary: 'Tap to activate' }
    case 'script':
      return { primary: 'Run', secondary: 'Tap to activate' }
    case 'media_player': {
      const mediaTitle = entity.attributes.media_title
      return {
        primary: titleCase(state),
        secondary: typeof mediaTitle === 'string' ? mediaTitle : undefined,
      }
    }
    case 'climate': {
      const current = entity.attributes.current_temperature
      return {
        primary: titleCase(state),
        secondary: typeof current === 'number' ? `${current}° now` : undefined,
      }
    }
    case 'weather': {
      const temperature = entity.attributes.temperature
      return {
        primary: titleCase(state),
        secondary: typeof temperature === 'number' ? `${temperature}°` : undefined,
      }
    }
    case 'binary_sensor':
      return { primary: state === 'on' ? 'Detected' : 'Clear' }
    default:
      if (isNumericState(state)) {
        return { primary: `${state}${unit ? ` ${unit}` : ''}` }
      }
      return { primary: titleCase(state) }
  }
}

export function sensorValue(
  entity: HomeAssistantEntity | undefined,
): { value: string; unit?: string; ratio?: number } {
  if (!entity) return { value: '—' }

  const unit =
    typeof entity.attributes.unit_of_measurement === 'string'
      ? entity.attributes.unit_of_measurement
      : undefined

  if (!isNumericState(entity.state)) {
    return { value: titleCase(entity.state), unit }
  }

  const numeric = Number(entity.state)
  const min = typeof entity.attributes.min === 'number' ? entity.attributes.min : undefined
  const max = typeof entity.attributes.max === 'number' ? entity.attributes.max : undefined
  const ratio =
    min !== undefined && max !== undefined && max > min
      ? Math.min(1, Math.max(0, (numeric - min) / (max - min)))
      : undefined

  return { value: entity.state, unit, ratio }
}
