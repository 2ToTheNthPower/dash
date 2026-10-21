import { useCallback, useMemo, useRef, useState, type DragEvent } from 'react'
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  type NodeTypes,
} from '@xyflow/react'
import type { EntityMap } from '../types'
import { Icon, type IconName } from '../components/Icon'
import { createId } from '../lib/id'
import { connectNodes, createNode, nodeSummary } from './graph'
import type {
  AutomationEdge,
  AutomationNode,
  AutomationRecord,
  NodeVariant,
} from './types'
import { NodeInspector } from './NodeInspector'

interface FlowNodeData extends Record<string, unknown> {
  node: AutomationNode
}

type FlowNode = Node<FlowNodeData, 'automation'>

const KIND_META: Record<
  AutomationNode['kind'],
  { label: string; icon: IconName; className: string }
> = {
  trigger: { label: 'Trigger', icon: 'bolt', className: 'kind-trigger' },
  condition: { label: 'Condition', icon: 'sliders', className: 'kind-condition' },
  action: { label: 'Action', icon: 'play', className: 'kind-action' },
  delay: { label: 'Delay', icon: 'clock', className: 'kind-delay' },
}

interface PaletteItem {
  id: string
  kind: AutomationNode['kind']
  variant: NodeVariant
  label: string
  hint: string
  icon: IconName
  category: 'Triggers' | 'Conditions' | 'Actions'
}

const PALETTE: PaletteItem[] = [
  {
    id: 'trigger-state',
    kind: 'trigger',
    variant: { triggerType: 'state' },
    label: 'State change',
    hint: 'Entity changes',
    icon: 'bolt',
    category: 'Triggers',
  },
  {
    id: 'trigger-time',
    kind: 'trigger',
    variant: { triggerType: 'time' },
    label: 'Time of day',
    hint: 'At a set time',
    icon: 'clock',
    category: 'Triggers',
  },
  {
    id: 'trigger-sun',
    kind: 'trigger',
    variant: { triggerType: 'sun' },
    label: 'Sun event',
    hint: 'Sunrise or sunset',
    icon: 'sun',
    category: 'Triggers',
  },
  {
    id: 'condition-state',
    kind: 'condition',
    variant: { conditionType: 'state' },
    label: 'Entity state',
    hint: 'Only when…',
    icon: 'sliders',
    category: 'Conditions',
  },
  {
    id: 'condition-time',
    kind: 'condition',
    variant: { conditionType: 'time' },
    label: 'Time window',
    hint: 'Between hours',
    icon: 'clock',
    category: 'Conditions',
  },
  {
    id: 'action-service',
    kind: 'action',
    variant: { actionType: 'service' },
    label: 'Call service',
    hint: 'Control a device',
    icon: 'play',
    category: 'Actions',
  },
  {
    id: 'action-scene',
    kind: 'action',
    variant: { actionType: 'scene' },
    label: 'Run scene',
    hint: 'Scene or script',
    icon: 'film',
    category: 'Actions',
  },
  {
    id: 'action-notify',
    kind: 'action',
    variant: { actionType: 'notify' },
    label: 'Notify',
    hint: 'Send a message',
    icon: 'alert',
    category: 'Actions',
  },
  {
    id: 'action-delay',
    kind: 'delay',
    variant: {},
    label: 'Delay',
    hint: 'Wait a while',
    icon: 'clock',
    category: 'Actions',
  },
]

const NODE_TYPES: NodeTypes = { automation: AutomationNodeCard }

function AutomationNodeCard({ data, selected }: NodeProps<FlowNode>) {
  const node = data.node
  const meta = KIND_META[node.kind]

  return (
    <div className={`flow-node ${meta.className} ${selected ? 'is-selected' : ''}`}>
      <Handle type="target" position={Position.Left} className="flow-handle" />
      <div className="flow-node-head">
        <span className="flow-node-icon">
          <Icon name={meta.icon} size={15} />
        </span>
        <span className="flow-node-kind">{meta.label}</span>
      </div>
      <strong>{node.label || nodeSummary(node)}</strong>
      {node.label ? <p>{nodeSummary(node)}</p> : null}
      <Handle type="source" position={Position.Right} className="flow-handle" />
    </div>
  )
}

function toFlowNode(node: AutomationNode): FlowNode {
  return {
    id: node.id,
    type: 'automation',
    position: { x: node.x, y: node.y },
    data: { node },
  }
}

function toFlowEdge(edge: AutomationEdge): Edge {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'var(--accent)', strokeWidth: 2 },
  }
}

function fromFlowNode(node: FlowNode): AutomationNode {
  return {
    ...node.data.node,
    x: node.position.x,
    y: node.position.y,
  }
}

function fromFlowEdge(edge: Edge): AutomationEdge {
  return { id: edge.id, source: edge.source, target: edge.target }
}

interface CanvasInnerProps {
  automation: AutomationRecord
  entities: EntityMap
  colorMode: 'light' | 'dark'
  onChange: (patch: Pick<AutomationRecord, 'nodes' | 'edges'>) => void
}

function CanvasInner({ automation, entities, colorMode, onChange }: CanvasInnerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(
    automation.nodes.map(toFlowNode),
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(
    automation.edges.map(toFlowEdge),
  )
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const nodesRef = useRef(nodes)
  const edgesRef = useRef(edges)
  nodesRef.current = nodes
  edgesRef.current = edges

  const { screenToFlowPosition } = useReactFlow()

  const commit = useCallback(
    (nextNodes: FlowNode[], nextEdges: Edge[]) => {
      onChange({
        nodes: nextNodes.map(fromFlowNode),
        edges: nextEdges.map(fromFlowEdge),
      })
    },
    [onChange],
  )

  const addNode = useCallback(
    (item: PaletteItem, position: { x: number; y: number }) => {
      const node = createNode(item.kind, position, item.variant)
      const nextNodes = [
        ...nodesRef.current.map((entry) => ({ ...entry, selected: false })),
        { ...toFlowNode(node), selected: true },
      ]
      setNodes(nextNodes)
      commit(nextNodes, edgesRef.current)
      setSelectedNodeId(node.id)
    },
    [commit, setNodes],
  )

  const addFromPalette = useCallback(
    (item: PaletteItem) => {
      const bounds = stageRef.current?.getBoundingClientRect()
      const center = bounds
        ? { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 }
        : { x: 480, y: 320 }
      const flowPoint = screenToFlowPosition(center)
      const offset = (nodesRef.current.length % 4) * 26
      addNode(item, { x: flowPoint.x - 100 + offset, y: flowPoint.y - 40 + offset })
    },
    [addNode, screenToFlowPosition],
  )

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const itemId = event.dataTransfer?.getData('application/dash-automation-node')
    const item = PALETTE.find((entry) => entry.id === itemId)
    if (!item) return
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY })
    addNode(item, { x: position.x - 90, y: position.y - 30 })
  }

  const updateNode = useCallback(
    (updated: AutomationNode) => {
      const nextNodes = nodesRef.current.map((node) =>
        node.id === updated.id
          ? {
              ...node,
              position: { x: updated.x, y: updated.y },
              data: { node: updated },
            }
          : node,
      )
      setNodes(nextNodes)
      commit(nextNodes, edgesRef.current)
    },
    [commit, setNodes],
  )

  const deleteNode = useCallback(
    (id: string) => {
      const nextNodes = nodesRef.current.filter((node) => node.id !== id)
      const nextEdges = edgesRef.current.filter(
        (edge) => edge.source !== id && edge.target !== id,
      )
      setNodes(nextNodes)
      setEdges(nextEdges)
      commit(nextNodes, nextEdges)
      setSelectedNodeId(null)
    },
    [commit, setEdges, setNodes],
  )

  const duplicateNode = useCallback(
    (source: AutomationNode) => {
      const copy: AutomationNode = {
        ...source,
        id: createId('node'),
        label: source.label ? `${source.label} copy` : '',
        x: source.x + 40,
        y: source.y + 40,
        config: { ...source.config },
      }
      const nextNodes = [
        ...nodesRef.current.map((node) => ({ ...node, selected: false })),
        { ...toFlowNode(copy), selected: true },
      ]
      setNodes(nextNodes)
      commit(nextNodes, edgesRef.current)
      setSelectedNodeId(copy.id)
    },
    [commit, setNodes],
  )

  const handleConnect = useCallback(
    (connection: { source: string | null; target: string | null }) => {
      if (!connection.source || !connection.target) return
      const rawNodes = nodesRef.current.map(fromFlowNode)
      const rawEdges = edgesRef.current.map(fromFlowEdge)
      const result = connectNodes(rawNodes, rawEdges, connection.source, connection.target)
      if (result.error) {
        setMessage(result.error)
        return
      }
      const nextEdges = result.edges.map(toFlowEdge)
      setEdges(nextEdges)
      commit(nodesRef.current, nextEdges)
      setMessage(null)
    },
    [commit, setEdges],
  )

  const handleNodeDragStop = useCallback(
    (_event: unknown, node: FlowNode) => {
      const nextNodes = nodesRef.current.map((entry) =>
        entry.id === node.id
          ? {
              ...entry,
              position: node.position,
              data: {
                node: { ...entry.data.node, x: node.position.x, y: node.position.y },
              },
            }
          : entry,
      )
      setNodes(nextNodes)
      commit(nextNodes, edgesRef.current)
    },
    [commit, setNodes],
  )

  const handleNodesDelete = useCallback(
    (deleted: FlowNode[]) => {
      const ids = new Set(deleted.map((node) => node.id))
      const nextNodes = nodesRef.current.filter((node) => !ids.has(node.id))
      const nextEdges = edgesRef.current.filter(
        (edge) => !ids.has(edge.source) && !ids.has(edge.target),
      )
      setNodes(nextNodes)
      setEdges(nextEdges)
      commit(nextNodes, nextEdges)
      setSelectedNodeId((current) => (current && ids.has(current) ? null : current))
    },
    [commit, setEdges, setNodes],
  )

  const handleEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      const ids = new Set(deleted.map((edge) => edge.id))
      const nextEdges = edgesRef.current.filter((edge) => !ids.has(edge.id))
      setEdges(nextEdges)
      commit(nodesRef.current, nextEdges)
    },
    [commit, setEdges],
  )

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId)?.data.node ?? null,
    [nodes, selectedNodeId],
  )

  const paletteGroups = useMemo(
    () =>
      (['Triggers', 'Conditions', 'Actions'] as const).map((category) => ({
        category,
        items: PALETTE.filter((item) => item.category === category),
      })),
    [],
  )

  return (
    <div className="automation-workspace">
      <aside className="node-palette" aria-label="Node palette">
        <div className="node-palette-head">
          <Icon name="plus" size={16} />
          <span>Add nodes</span>
        </div>
        <p className="node-palette-hint">Drag onto the canvas, or click to add.</p>
        {paletteGroups.map((group) => (
          <div className="palette-group" key={group.category}>
            <h4>{group.category}</h4>
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className="palette-item"
                draggable
                onDragStart={(event) => {
                  event.dataTransfer?.setData('application/dash-automation-node', item.id)
                  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy'
                }}
                onClick={() => addFromPalette(item)}
              >
                <span className="palette-icon">
                  <Icon name={item.icon} size={15} />
                </span>
                <span className="palette-text">
                  <strong>{item.label}</strong>
                  <small>{item.hint}</small>
                </span>
              </button>
            ))}
          </div>
        ))}
      </aside>

      <div
        className="flow-stage"
        ref={stageRef}
        onDrop={handleDrop}
        onDragOver={(event) => {
          event.preventDefault()
          if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          onNodeDragStop={handleNodeDragStop}
          onNodesDelete={handleNodesDelete}
          onEdgesDelete={handleEdgesDelete}
          onSelectionChange={({ nodes: selection }) =>
            setSelectedNodeId(selection[0]?.id ?? null)
          }
          colorMode={colorMode}
          fitView
          fitViewOptions={{ padding: 0.24 }}
          minZoom={0.3}
          maxZoom={1.8}
          snapToGrid
          snapGrid={[20, 20]}
          deleteKeyCode={['Backspace', 'Delete']}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={22}
            size={1.3}
            color="var(--grid-line)"
          />
          <Controls showInteractive={false} />
          <MiniMap
            pannable
            zoomable
            nodeColor="var(--accent)"
            maskColor="var(--flow-mask)"
            className="flow-minimap"
          />
        </ReactFlow>

        {message ? (
          <div className="canvas-toast" role="alert">
            <Icon name="alert" size={16} />
            <span>{message}</span>
            <button
              type="button"
              className="tool-button"
              onClick={() => setMessage(null)}
              aria-label="Dismiss message"
            >
              <Icon name="x" size={15} />
            </button>
          </div>
        ) : null}
      </div>

      {selectedNode ? (
        <NodeInspector
          node={selectedNode}
          entities={entities}
          onChange={updateNode}
          onDuplicate={() => duplicateNode(selectedNode)}
          onDelete={() => deleteNode(selectedNode.id)}
          onClose={() => {
            setSelectedNodeId(null)
            setNodes((current) => current.map((node) => ({ ...node, selected: false })))
          }}
        />
      ) : (
        <aside className="inspector inspector-empty">
          <span className="inspector-empty-icon">
            <Icon name="sliders" size={22} />
          </span>
          <h3>Select a node</h3>
          <p>
            Click any node to edit it. Drag from the right handle to the left handle of another
            node to connect them.
          </p>
          <ul>
            <li>Drop palette items anywhere on the canvas.</li>
            <li>Press Delete to remove a selected node or connection.</li>
            <li>Drag nodes to rearrange the automation.</li>
          </ul>
        </aside>
      )}
    </div>
  )
}

export function AutomationCanvas(props: CanvasInnerProps) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  )
}
