import { createId } from '../lib/id'
import { createNode } from './graph'
import type { AutomationRecord, AutomationStore } from './types'

export function createDemoAutomation(): AutomationRecord {
  return {
    id: 'demo-motion-lights',
    name: 'Hallway lights on motion',
    description: 'Turn the living room lights on after sunset and off a few minutes later.',
    mode: 'single',
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: 'motion-trigger',
        kind: 'trigger',
        label: 'Motion detected',
        x: 40,
        y: 70,
        config: {
          triggerType: 'state',
          entityId: 'binary_sensor.hallway_motion',
          to: 'on',
        },
      },
      {
        id: 'after-sunset',
        kind: 'condition',
        label: 'After sunset',
        x: 300,
        y: 70,
        config: {
          conditionType: 'state',
          entityId: 'sun.sun',
          state: 'below_horizon',
        },
      },
      {
        id: 'lights-on',
        kind: 'action',
        label: 'Turn on lights',
        x: 560,
        y: 70,
        config: {
          actionType: 'service',
          service: 'light.turn_on',
          entityId: 'light.living_room',
        },
      },
      {
        id: 'wait-a-bit',
        kind: 'delay',
        label: 'Wait 3 minutes',
        x: 560,
        y: 290,
        config: { duration: 3, unit: 'minutes' },
      },
      {
        id: 'lights-off',
        kind: 'action',
        label: 'Turn off lights',
        x: 300,
        y: 290,
        config: {
          actionType: 'service',
          service: 'light.turn_off',
          entityId: 'light.living_room',
        },
      },
    ],
    edges: [
      { id: 'edge-motion-sunset', source: 'motion-trigger', target: 'after-sunset' },
      { id: 'edge-sunset-on', source: 'after-sunset', target: 'lights-on' },
      { id: 'edge-on-delay', source: 'lights-on', target: 'wait-a-bit' },
      { id: 'edge-delay-off', source: 'wait-a-bit', target: 'lights-off' },
    ],
  }
}

export function createBlankAutomation(name = 'New automation'): AutomationRecord {
  const trigger = createNode('trigger', { x: 60, y: 180 })
  const action = createNode('action', { x: 380, y: 180 })

  return {
    id: createId('automation'),
    name,
    description: '',
    mode: 'single',
    updatedAt: new Date().toISOString(),
    nodes: [trigger, action],
    edges: [{ id: createId('edge'), source: trigger.id, target: action.id }],
  }
}

export function createAutomationStore(): AutomationStore {
  const automation = createDemoAutomation()
  return {
    version: 1,
    automations: [automation],
    activeId: automation.id,
  }
}

export function duplicateAutomation(record: AutomationRecord): AutomationRecord {
  const idMap = new Map<string, string>()
  const nodes = record.nodes.map((node) => {
    const id = createId('node')
    idMap.set(node.id, id)
    return { ...node, id, x: node.x + 40, y: node.y + 40 }
  })
  const edges = record.edges.flatMap((edge) => {
    const source = idMap.get(edge.source)
    const target = idMap.get(edge.target)
    if (!source || !target) return []
    return [{ id: createId('edge'), source, target }]
  })

  return {
    ...record,
    id: createId('automation'),
    name: `${record.name} copy`,
    nodes,
    edges,
    updatedAt: new Date().toISOString(),
  }
}
