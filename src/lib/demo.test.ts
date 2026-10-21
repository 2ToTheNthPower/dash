import { describe, expect, it } from 'vitest'
import { createStarterConfig } from './demo'
import type { EntityMap } from '../types'

function entity(
  entityId: string,
  state: string,
  attributes: Record<string, unknown> = {},
): EntityMap[string] {
  return { entity_id: entityId, state, attributes }
}

describe('createStarterConfig', () => {
  it('builds a useful first dashboard from live entities', () => {
    const config = createStarterConfig({
      'light.kitchen': entity('light.kitchen', 'off', { friendly_name: 'Kitchen lights' }),
      'scene.movie': entity('scene.movie', '2026-01-01', { friendly_name: 'Movie night' }),
      'sensor.humidity': entity('sensor.humidity', '43', {
        friendly_name: 'Humidity',
        unit_of_measurement: '%',
        min: 0,
        max: 100,
      }),
      'sensor.temperature': entity('sensor.temperature', '21', {
        friendly_name: 'Temperature',
        unit_of_measurement: '°C',
      }),
      'binary_sensor.motion': entity('binary_sensor.motion', 'on', {
        friendly_name: 'Hallway motion',
      }),
      'light.unavailable': entity('light.unavailable', 'unavailable'),
    })

    expect(config.title).toBe('My home')
    expect(config.cards).toHaveLength(5)
    expect(config.cards.map((card) => card.type)).toEqual([
      'entity',
      'action',
      'gauge',
      'sensor',
      'entity',
    ])
    expect(config.cards.every((card) => card.title === '')).toBe(true)
  })

  it('falls back to a welcome note when there are no usable entities', () => {
    const config = createStarterConfig({
      'light.offline': entity('light.offline', 'unavailable'),
    })

    expect(config.cards).toHaveLength(1)
    expect(config.cards[0].type).toBe('note')
    expect(config.cards[0].title).toBe('Welcome to Dash')
  })
})
