import { useMemo } from 'react'
import type { EntityMap } from '../types'
import { entityName } from '../lib/format'
import { nodeSummary } from './graph'
import type {
  ActionType,
  AutomationNode,
  AutomationNodeConfig,
  ConditionType,
  DelayUnit,
  TriggerType,
} from './types'
import { Icon, type IconName } from '../components/Icon'

interface NodeInspectorProps {
  node: AutomationNode
  entities: EntityMap
  onChange: (node: AutomationNode) => void
  onDuplicate: () => void
  onDelete: () => void
  onClose: () => void
}

const KIND_META: Record<
  AutomationNode['kind'],
  { label: string; icon: IconName; className: string }
> = {
  trigger: { label: 'Trigger', icon: 'bolt', className: 'kind-trigger' },
  condition: { label: 'Condition', icon: 'sliders', className: 'kind-condition' },
  action: { label: 'Action', icon: 'play', className: 'kind-action' },
  delay: { label: 'Delay', icon: 'clock', className: 'kind-delay' },
}

interface EntitySelectProps {
  label: string
  value: string | undefined
  entities: EntityMap
  domains?: string[]
  allowEmpty?: boolean
  onChange: (entityId: string) => void
}

function EntitySelect({
  label,
  value,
  entities,
  domains,
  allowEmpty = false,
  onChange,
}: EntitySelectProps) {
  const ids = useMemo(() => {
    const list = Object.values(entities)
      .filter((entity) => !domains || domains.includes(entity.entity_id.split('.')[0]))
      .map((entity) => entity.entity_id)
      .sort((left, right) => entityName(entities[left], left).localeCompare(entityName(entities[right], right)))

    if (value && !list.includes(value)) list.unshift(value)
    return list
  }, [domains, entities, value])

  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <select
        className="text-input"
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">{allowEmpty ? 'Any entity (optional)' : 'Choose an entity…'}</option>
        {ids.map((id) => (
          <option key={id} value={id}>
            {entityName(entities[id], id)} · {id}
          </option>
        ))}
      </select>
    </label>
  )
}

export function NodeInspector({
  node,
  entities,
  onChange,
  onDuplicate,
  onDelete,
  onClose,
}: NodeInspectorProps) {
  const meta = KIND_META[node.kind]
  const config = node.config

  const updateConfig = (patch: Partial<AutomationNodeConfig>) => {
    onChange({ ...node, config: { ...config, ...patch } })
  }

  return (
    <aside className="inspector" aria-label="Node settings">
      <div className="inspector-head">
        <div className="inspector-title">
          <span className={`inspector-icon ${meta.className}`}>
            <Icon name={meta.icon} size={18} />
          </span>
          <div>
            <p className="eyebrow">{meta.label}</p>
            <h3>Node settings</h3>
          </div>
        </div>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Close node settings">
          <Icon name="x" size={18} />
        </button>
      </div>

      <p className="inspector-summary">{node.label || nodeSummary(node)}</p>

      <div className="inspector-body">
        <label className="field">
          <span className="field-label">Node label</span>
          <input
            className="text-input"
            value={node.label}
            maxLength={80}
            placeholder={nodeSummary(node)}
            onChange={(event) => onChange({ ...node, label: event.target.value })}
          />
        </label>

        {node.kind === 'trigger' ? (
          <>
            <label className="field">
              <span className="field-label">Trigger type</span>
              <select
                className="text-input"
                value={config.triggerType ?? 'state'}
                onChange={(event) =>
                  updateConfig({ triggerType: event.target.value as TriggerType })
                }
              >
                <option value="state">State change</option>
                <option value="time">Time of day</option>
                <option value="sun">Sun event</option>
              </select>
            </label>

            {(config.triggerType ?? 'state') === 'state' ? (
              <>
                <EntitySelect
                  label="Entity"
                  value={config.entityId}
                  entities={entities}
                  onChange={(entityId) => updateConfig({ entityId })}
                />
                <div className="field-row">
                  <label className="field">
                    <span className="field-label">From (optional)</span>
                    <input
                      className="text-input"
                      value={config.from ?? ''}
                      placeholder="off"
                      onChange={(event) => updateConfig({ from: event.target.value })}
                    />
                  </label>
                  <label className="field">
                    <span className="field-label">To (optional)</span>
                    <input
                      className="text-input"
                      value={config.to ?? ''}
                      placeholder="on"
                      onChange={(event) => updateConfig({ to: event.target.value })}
                    />
                  </label>
                </div>
              </>
            ) : null}

            {config.triggerType === 'time' ? (
              <label className="field">
                <span className="field-label">Time</span>
                <input
                  className="text-input"
                  value={config.at ?? ''}
                  placeholder="07:00:00"
                  onChange={(event) => updateConfig({ at: event.target.value })}
                />
              </label>
            ) : null}

            {config.triggerType === 'sun' ? (
              <div className="field-row">
                <label className="field">
                  <span className="field-label">Sun event</span>
                  <select
                    className="text-input"
                    value={config.sunEvent ?? 'sunrise'}
                    onChange={(event) =>
                      updateConfig({ sunEvent: event.target.value as 'sunrise' | 'sunset' })
                    }
                  >
                    <option value="sunrise">Sunrise</option>
                    <option value="sunset">Sunset</option>
                  </select>
                </label>
                <label className="field">
                  <span className="field-label">Offset</span>
                  <input
                    className="text-input"
                    value={config.offset ?? ''}
                    placeholder="-00:30:00"
                    onChange={(event) => updateConfig({ offset: event.target.value })}
                  />
                </label>
              </div>
            ) : null}
          </>
        ) : null}

        {node.kind === 'condition' ? (
          <>
            <label className="field">
              <span className="field-label">Condition type</span>
              <select
                className="text-input"
                value={config.conditionType ?? 'state'}
                onChange={(event) =>
                  updateConfig({ conditionType: event.target.value as ConditionType })
                }
              >
                <option value="state">Entity state</option>
                <option value="time">Time window</option>
              </select>
            </label>

            {(config.conditionType ?? 'state') === 'state' ? (
              <>
                <EntitySelect
                  label="Entity"
                  value={config.entityId}
                  entities={entities}
                  onChange={(entityId) => updateConfig({ entityId })}
                />
                <label className="field">
                  <span className="field-label">State</span>
                  <input
                    className="text-input"
                    value={config.state ?? ''}
                    placeholder="below_horizon"
                    onChange={(event) => updateConfig({ state: event.target.value })}
                  />
                </label>
              </>
            ) : (
              <div className="field-row">
                <label className="field">
                  <span className="field-label">After</span>
                  <input
                    className="text-input"
                    value={config.after ?? ''}
                    placeholder="22:00:00"
                    onChange={(event) => updateConfig({ after: event.target.value })}
                  />
                </label>
                <label className="field">
                  <span className="field-label">Before</span>
                  <input
                    className="text-input"
                    value={config.before ?? ''}
                    placeholder="06:00:00"
                    onChange={(event) => updateConfig({ before: event.target.value })}
                  />
                </label>
              </div>
            )}
          </>
        ) : null}

        {node.kind === 'action' ? (
          <>
            <label className="field">
              <span className="field-label">Action type</span>
              <select
                className="text-input"
                value={config.actionType ?? 'service'}
                onChange={(event) => {
                  const actionType = event.target.value as ActionType
                  if (actionType === 'scene') {
                    updateConfig({
                      actionType,
                      service: 'scene.turn_on',
                      entityId: config.entityId || 'scene.movie_night',
                    })
                  } else if (actionType === 'notify') {
                    updateConfig({
                      actionType,
                      service: config.service || 'notify.notify',
                    })
                  } else {
                    updateConfig({
                      actionType,
                      service: config.service === 'notify.notify' ? 'light.turn_on' : config.service,
                    })
                  }
                }}
              >
                <option value="service">Call service</option>
                <option value="scene">Run scene</option>
                <option value="notify">Send notification</option>
              </select>
            </label>

            {config.actionType === 'notify' ? (
              <>
                <label className="field">
                  <span className="field-label">Notify service</span>
                  <input
                    className="text-input"
                    value={config.service ?? 'notify.notify'}
                    placeholder="notify.notify"
                    onChange={(event) => updateConfig({ service: event.target.value })}
                  />
                </label>
                <label className="field">
                  <span className="field-label">Message</span>
                  <textarea
                    className="text-input"
                    rows={3}
                    value={config.message ?? ''}
                    onChange={(event) => updateConfig({ message: event.target.value })}
                  />
                </label>
              </>
            ) : (
              <>
                {config.actionType === 'scene' ? (
                  <EntitySelect
                    label="Scene or script"
                    value={config.entityId}
                    entities={entities}
                    domains={['scene', 'script']}
                    onChange={(entityId) => updateConfig({ entityId })}
                  />
                ) : (
                  <>
                    <label className="field">
                      <span className="field-label">Service</span>
                      <input
                        className="text-input"
                        value={config.service ?? ''}
                        placeholder="light.turn_on"
                        onChange={(event) => updateConfig({ service: event.target.value })}
                      />
                    </label>
                    <EntitySelect
                      label="Target entity"
                      value={config.entityId}
                      entities={entities}
                      allowEmpty
                      onChange={(entityId) => updateConfig({ entityId })}
                    />
                  </>
                )}
              </>
            )}
          </>
        ) : null}

        {node.kind === 'delay' ? (
          <div className="field-row">
            <label className="field">
              <span className="field-label">Duration</span>
              <input
                className="text-input"
                type="number"
                min={1}
                value={config.duration ?? 1}
                onChange={(event) =>
                  updateConfig({ duration: Math.max(0, Number(event.target.value)) })
                }
              />
            </label>
            <label className="field">
              <span className="field-label">Unit</span>
              <select
                className="text-input"
                value={config.unit ?? 'minutes'}
                onChange={(event) => updateConfig({ unit: event.target.value as DelayUnit })}
              >
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
              </select>
            </label>
          </div>
        ) : null}
      </div>

      <div className="inspector-footer">
        <button type="button" className="button ghost" onClick={onDuplicate}>
          <Icon name="copy" size={16} />
          Duplicate
        </button>
        <button type="button" className="button ghost danger-text" onClick={onDelete}>
          <Icon name="trash" size={16} />
          Delete node
        </button>
      </div>
    </aside>
  )
}
