import { describe, expect, it } from 'vitest'
import {
  automationToHomeAssistant,
  automationToYaml,
  connectNodes,
  createNode,
  nodeSummary,
  topologicalNodeIds,
  validateAutomation,
} from './graph'
import { createAutomationStore, createBlankAutomation, createDemoAutomation, duplicateAutomation } from './demo'

describe('automation node helpers', () => {
  it('creates sensible defaults for every node kind', () => {
    const trigger = createNode('trigger', { x: 0, y: 0 }, { triggerType: 'time' })
    const condition = createNode('condition', { x: 0, y: 0 }, { conditionType: 'time' })
    const action = createNode('action', { x: 0, y: 0 }, { actionType: 'scene' })
    const delay = createNode('delay', { x: 0, y: 0 })

    expect(trigger.config.triggerType).toBe('time')
    expect(trigger.config.at).toBe('07:00:00')
    expect(nodeSummary(condition)).toContain('22:00:00')
    expect(nodeSummary(action)).toContain('Movie Night')
    expect(nodeSummary(delay)).toBe('Wait 3 minutes')
  })

  it('summarises state triggers and service actions', () => {
    const trigger = createNode('trigger', { x: 0, y: 0 })
    const action = createNode('action', { x: 0, y: 0 })

    expect(nodeSummary(trigger)).toContain('Hallway Motion')
    expect(nodeSummary(trigger)).toContain('on')
    expect(nodeSummary(action)).toContain('light.turn_on')
  })
})

describe('graph ordering and connections', () => {
  it('walks the demo chain in order', () => {
    const demo = createDemoAutomation()
    expect(topologicalNodeIds(demo.nodes, demo.edges)).toEqual([
      'motion-trigger',
      'after-sunset',
      'lights-on',
      'wait-a-bit',
      'lights-off',
    ])
  })

  it('prevents self, duplicate, and cyclic connections', () => {
    const demo = createDemoAutomation()
    const duplicate = connectNodes(demo.nodes, demo.edges, 'motion-trigger', 'after-sunset')
    const self = connectNodes(demo.nodes, demo.edges, 'motion-trigger', 'motion-trigger')
    const cycle = connectNodes(demo.nodes, demo.edges, 'lights-off', 'motion-trigger')

    expect(duplicate.error).toMatch(/already connected/i)
    expect(self.error).toMatch(/itself/i)
    expect(cycle.error).toMatch(/loop/i)
    expect(demo.edges).toHaveLength(4)
  })

  it('adds valid connections', () => {
    const nodes = createDemoAutomation().nodes
    const result = connectNodes(nodes, [], 'motion-trigger', 'lights-off')
    expect(result.error).toBeNull()
    expect(result.edges).toHaveLength(1)
    expect(result.edges[0]).toMatchObject({
      source: 'motion-trigger',
      target: 'lights-off',
    })
  })
})

describe('Home Assistant export', () => {
  it('builds triggers, conditions, and ordered actions', () => {
    const automation = automationToHomeAssistant(createDemoAutomation())

    expect(automation.alias).toBe('Hallway lights on motion')
    expect(automation.mode).toBe('single')
    expect(automation.trigger).toEqual([
      {
        platform: 'state',
        entity_id: 'binary_sensor.hallway_motion',
        to: 'on',
      },
    ])
    expect(automation.condition).toEqual([
      { condition: 'state', entity_id: 'sun.sun', state: 'below_horizon' },
    ])
    expect(automation.action).toEqual([
      {
        service: 'light.turn_on',
        target: { entity_id: 'light.living_room' },
      },
      { delay: { minutes: 3 } },
      {
        service: 'light.turn_off',
        target: { entity_id: 'light.living_room' },
      },
    ])
  })

  it('emits valid-looking YAML', () => {
    const yaml = automationToYaml(createDemoAutomation())
    expect(yaml).toContain('alias: Hallway lights on motion')
    expect(yaml).toContain('service: light.turn_on')
    expect(yaml).toContain('condition: state')
    expect(yaml).toContain('minutes: 3')
  })

  it('reports invalid graphs', () => {
    const blank = createBlankAutomation()
    const noTrigger = { ...blank, nodes: blank.nodes.filter((node) => node.kind !== 'trigger') }
    const noAction = { ...blank, nodes: blank.nodes.filter((node) => node.kind !== 'action') }
    const badService = {
      ...blank,
      nodes: blank.nodes.map((node) =>
        node.kind === 'action'
          ? { ...node, config: { ...node.config, service: 'not-a-service' } }
          : node,
      ),
    }

    expect(validateAutomation(noTrigger)).toContain('Add at least one trigger.')
    expect(validateAutomation(noAction)).toContain('Add at least one action.')
    expect(validateAutomation(badService).join(' ')).toMatch(/needs a service/i)
    expect(() => automationToHomeAssistant(noTrigger)).toThrow(/trigger/i)
  })
})

describe('automation records', () => {
  it('creates a store with the demo automation active', () => {
    const store = createAutomationStore()
    expect(store.automations).toHaveLength(1)
    expect(store.activeId).toBe(store.automations[0].id)
    expect(store.automations[0].nodes).toHaveLength(5)
  })

  it('duplicates an automation with fresh node ids', () => {
    const demo = createDemoAutomation()
    const copy = duplicateAutomation(demo)
    const originalIds = new Set(demo.nodes.map((node) => node.id))

    expect(copy.id).not.toBe(demo.id)
    expect(copy.name).toContain('copy')
    expect(copy.nodes.every((node) => !originalIds.has(node.id))).toBe(true)
    expect(copy.edges).toHaveLength(demo.edges.length)
    expect(copy.edges.every((edge) => copy.nodes.some((node) => node.id === edge.source))).toBe(
      true,
    )
  })
})
