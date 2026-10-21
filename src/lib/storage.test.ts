import { describe, expect, it } from 'vitest'
import {
  CONFIG_KEY,
  HA_SESSION_KEY,
  loadConfig,
  loadHASession,
  parseConfigJson,
  sanitizeConfig,
  saveConfig,
  saveHASession,
  serializeConfig,
} from './storage'
import { createDefaultConfig } from './demo'

describe('sanitizeConfig', () => {
  it('falls back to a default config for non-objects', () => {
    expect(sanitizeConfig(null).title).toBe('My home')
    expect(sanitizeConfig('nope').cards.length).toBeGreaterThan(0)
  })

  it('validates theme and background values', () => {
    const config = sanitizeConfig({
      title: 'Downstairs',
      subtitle: 'Lights and climate',
      background: 'neon',
      theme: { mode: 'sepia', accent: 'magenta' },
      cards: [],
    })

    expect(config.title).toBe('Downstairs')
    expect(config.subtitle).toBe('Lights and climate')
    expect(config.background).toBe('aurora')
    expect(config.theme).toEqual({ mode: 'system', accent: 'azure' })
    expect(config.cards).toEqual([])
  })

  it('sanitises nested grids and their columns', () => {
    const config = sanitizeConfig({
      cards: [
        {
          id: 'grid',
          type: 'group',
          title: 'Rooms',
          width: 'full',
          columns: 3,
          children: [
            { id: 'light', type: 'entity', title: 'Light', entityId: 'light.x', width: 'normal' },
            {
              id: 'inner',
              type: 'group',
              title: 'Inner',
              columns: 99,
              children: [
                { id: 'sensor', type: 'sensor', title: 'Temp', entityId: 'sensor.t', width: 'wide' },
              ],
            },
          ],
        },
      ],
    })

    expect(config.cards[0]).toMatchObject({ type: 'group', width: 'full', columns: 3 })
    expect(config.cards[0].children).toHaveLength(2)
    expect(config.cards[0].children?.[1]).toMatchObject({ type: 'group', columns: 2 })
    expect(config.cards[0].children?.[1].children?.[0].id).toBe('sensor')
  })

  it('keeps valid cards and gives duplicate ids a fresh value', () => {
    const config = sanitizeConfig({
      cards: [
        { id: 'same', type: 'sensor', title: 'Temperature', entityId: 'sensor.temp', width: 'wide' },
        { id: 'same', type: 'note', title: 'Bins', content: 'Tuesday', width: 'nope' },
        { type: 'mystery', title: 'Unknown' },
        null,
        'not a card',
      ],
    })

    expect(config.cards).toHaveLength(3)
    expect(config.cards[0]).toMatchObject({
      id: 'same',
      type: 'sensor',
      width: 'wide',
      entityId: 'sensor.temp',
    })
    expect(config.cards[1].id).not.toBe('same')
    expect(config.cards[1].width).toBe('normal')
    expect(config.cards[2].type).toBe('entity')
  })
})

describe('loadConfig and saveConfig', () => {
  it('round-trips a config through local storage', () => {
    const config = createDefaultConfig()
    config.title = 'Our house'
    config.theme = { mode: 'dark', accent: 'rose' }
    config.cards = [
      { id: 'one', type: 'note', title: 'Hello', content: 'World', width: 'normal' },
    ]

    saveConfig(config)
    expect(window.localStorage.getItem(CONFIG_KEY)).toContain('Our house')

    const loaded = loadConfig()
    expect(loaded.title).toBe('Our house')
    expect(loaded.theme).toEqual({ mode: 'dark', accent: 'rose' })
    expect(loaded.cards).toHaveLength(1)
  })

  it('returns defaults when storage is missing or corrupt', () => {
    window.localStorage.setItem(CONFIG_KEY, '{broken')
    expect(loadConfig().title).toBe('My home')
    expect(loadConfig(null).title).toBe('My home')
  })
})

describe('import and export', () => {
  it('parses exported JSON back into a config', () => {
    const config = createDefaultConfig()
    const roundTrip = parseConfigJson(serializeConfig(config))
    expect(roundTrip.title).toBe(config.title)
    expect(roundTrip.cards).toHaveLength(config.cards.length)
  })

  it('rejects invalid JSON and non-dashboard files', () => {
    expect(() => parseConfigJson('not json')).toThrow(/valid JSON/i)
    expect(() => parseConfigJson('{"hello":"world"}')).toThrow(/does not look like/i)
  })
})

describe('Home Assistant session', () => {
  it('stores and clears the session in session storage only', () => {
    saveHASession({ url: 'http://ha.local:8123', token: 'secret' })
    expect(window.sessionStorage.getItem(HA_SESSION_KEY)).toContain('secret')
    expect(window.localStorage.getItem(HA_SESSION_KEY)).toBeNull()
    expect(loadHASession()).toEqual({ url: 'http://ha.local:8123', token: 'secret' })

    saveHASession(null)
    expect(loadHASession()).toBeNull()
  })

  it('ignores malformed sessions', () => {
    window.sessionStorage.setItem(HA_SESSION_KEY, '{"url":"x"}')
    expect(loadHASession()).toBeNull()
  })
})
