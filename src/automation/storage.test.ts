import { describe, expect, it } from 'vitest'
import {
  AUTOMATIONS_KEY,
  loadAutomationStore,
  sanitizeAutomationStore,
  saveAutomationStore,
} from './storage'
import { createAutomationStore, createDemoAutomation } from './demo'

describe('automation storage', () => {
  it('returns the demo store when nothing is saved', () => {
    const store = loadAutomationStore()
    expect(store.automations).toHaveLength(1)
    expect(store.automations[0].name).toBe('Hallway lights on motion')
  })

  it('round-trips a store through local storage', () => {
    const store = createAutomationStore()
    store.automations[0].name = 'Saved automation'
    saveAutomationStore(store)

    expect(window.localStorage.getItem(AUTOMATIONS_KEY)).toContain('Saved automation')
    expect(loadAutomationStore().automations[0].name).toBe('Saved automation')
  })

  it('falls back to the demo store for corrupt data', () => {
    window.localStorage.setItem(AUTOMATIONS_KEY, '{broken')
    expect(loadAutomationStore().automations[0].id).toBe('demo-motion-lights')

    window.localStorage.setItem(AUTOMATIONS_KEY, '{"automations":[]}')
    expect(loadAutomationStore().automations).toHaveLength(1)
  })

  it('sanitises nodes, ids, modes, and dangling edges', () => {
    const store = sanitizeAutomationStore({
      version: 1,
      activeId: 'missing',
      automations: [
        {
          id: 'one',
          name: '  Test  ',
          mode: 'bogus',
          nodes: [
            { id: 'a', kind: 'trigger', x: 10, y: 20, config: { triggerType: 'state', entityId: 'light.x' } },
            { id: 'a', kind: 'action', x: 'bad', y: 20, config: { actionType: 'service', service: 'light.turn_on' } },
            { id: 'b', kind: 'mystery', config: {} },
            null,
          ],
          edges: [
            { source: 'a', target: 'b' },
            { source: 'a', target: 'missing' },
            { source: 'a', target: 'a' },
            { source: 'a', target: 'b' },
          ],
        },
        { id: 'one', name: 'Duplicate id' },
      ],
    })

    expect(store.automations).toHaveLength(2)
    expect(store.automations[0].name).toBe('Test')
    expect(store.automations[0].mode).toBe('single')
    expect(store.automations[0].nodes).toHaveLength(3)
    expect(new Set(store.automations[0].nodes.map((node) => node.id)).size).toBe(3)
    expect(store.automations[0].edges).toHaveLength(1)
    expect(store.automations[1].id).not.toBe('one')
    expect(store.activeId).toBe('one')
  })

  it('keeps activeId when it points at a real automation', () => {
    const demo = createDemoAutomation()
    const store = sanitizeAutomationStore({
      automations: [demo],
      activeId: demo.id,
    })
    expect(store.activeId).toBe(demo.id)
  })
})
