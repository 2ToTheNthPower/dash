import { describe, expect, it } from 'vitest'
import type { HomeAssistantEntity } from '../types'
import { isActionable, nextDemoState, serviceForEntity } from './services'

function entity(entityId: string, state: string): HomeAssistantEntity {
  return { entity_id: entityId, state, attributes: {} }
}

describe('serviceForEntity', () => {
  it('toggles lights, switches and fans through homeassistant.toggle', () => {
    expect(serviceForEntity(entity('light.kitchen', 'on'))).toEqual({
      domain: 'homeassistant',
      service: 'toggle',
      data: { entity_id: 'light.kitchen' },
    })
    expect(serviceForEntity(entity('switch.coffee', 'off'))?.service).toBe('toggle')
    expect(serviceForEntity(entity('fan.bedroom', 'on'))?.domain).toBe('homeassistant')
  })

  it('locks and unlocks locks based on their state', () => {
    expect(serviceForEntity(entity('lock.front_door', 'locked'))?.service).toBe('unlock')
    expect(serviceForEntity(entity('lock.front_door', 'unlocked'))?.service).toBe('lock')
  })

  it('opens and closes covers based on their state', () => {
    expect(serviceForEntity(entity('cover.garage', 'closed'))?.service).toBe('open_cover')
    expect(serviceForEntity(entity('cover.garage', 'open'))?.service).toBe('close_cover')
  })

  it('runs scenes and scripts', () => {
    expect(serviceForEntity(entity('scene.movie', 'scening'))?.service).toBe('turn_on')
    expect(serviceForEntity(entity('script.morning', 'off'))?.domain).toBe('script')
  })

  it('returns null for read-only entities', () => {
    expect(serviceForEntity(entity('sensor.temp', '21'))).toBeNull()
    expect(isActionable(entity('sensor.temp', '21'))).toBe(false)
    expect(isActionable(entity('light.kitchen', 'on'))).toBe(true)
    expect(isActionable(undefined)).toBe(false)
  })
})

describe('nextDemoState', () => {
  it('toggles, locks and opens demo entities', () => {
    expect(nextDemoState(entity('light.kitchen', 'on'))).toBe('off')
    expect(nextDemoState(entity('lock.front_door', 'locked'))).toBe('unlocked')
    expect(nextDemoState(entity('cover.garage', 'closed'))).toBe('open')
    expect(nextDemoState(entity('scene.movie', 'scening'))).toBe('scening')
  })
})
