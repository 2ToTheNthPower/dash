import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { CardType, DashboardCard, EntityMap, GroupColumns } from '../types'
import { entityName, domainOf } from '../lib/format'
import { createId } from '../lib/id'
import { iconForCard } from '../lib/icons'
import { isActionable } from '../lib/services'
import { Icon, type IconName } from './Icon'

interface CardEditorProps {
  card: DashboardCard | null
  entities: EntityMap
  onSave: (card: DashboardCard) => void
  onClose: () => void
}

const TYPE_CHOICES: { id: CardType; label: string; hint: string; icon: IconName }[] = [
  { id: 'entity', label: 'Entity', hint: 'Toggle a device', icon: 'bulb' },
  { id: 'sensor', label: 'Sensor', hint: 'Show a reading', icon: 'activity' },
  { id: 'action', label: 'Action', hint: 'Run a scene or script', icon: 'bolt' },
  { id: 'note', label: 'Note', hint: 'Free text for the family', icon: 'note' },
  { id: 'group', label: 'Grid', hint: 'Nest cards in columns', icon: 'grid' },
  { id: 'gauge', label: 'Gauge', hint: 'A circular reading', icon: 'gauge' },
]

const ACTIONABLE_DOMAINS = new Set([
  'scene',
  'script',
  'light',
  'switch',
  'fan',
  'lock',
  'cover',
  'input_boolean',
  'automation',
])

export function CardEditor({ card, entities, onSave, onClose }: CardEditorProps) {
  const [type, setType] = useState<CardType>(card?.type ?? 'entity')
  const [entityId, setEntityId] = useState(card?.entityId ?? '')
  const [title, setTitle] = useState(card?.title ?? '')
  const [content, setContent] = useState(card?.content ?? '')
  const [width, setWidth] = useState(card?.width ?? 'normal')
  const [columns, setColumns] = useState<GroupColumns>(card?.columns ?? 2)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const candidates = useMemo(() => {
    const query = search.trim().toLowerCase()
    return Object.values(entities)
      .filter((entity) => {
        if (type !== 'action') return true
        return ACTIONABLE_DOMAINS.has(domainOf(entity.entity_id)) && isActionable(entity)
      })
      .filter((entity) => {
        if (!query) return true
        return (
          entity.entity_id.toLowerCase().includes(query) ||
          entityName(entity).toLowerCase().includes(query)
        )
      })
      .sort((a, b) => entityName(a).localeCompare(entityName(b)))
  }, [entities, search, type])

  const selectedEntity = entityId ? entities[entityId] : undefined

  const chooseEntity = (id: string) => {
    const next = entities[id]
    setEntityId(id)
    setError('')
    if (!title.trim() && next) setTitle(entityName(next))
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmedContent = content.trim()

    if (type === 'note') {
      if (!trimmedContent) {
        setError('Add some note text first.')
        return
      }
    } else if (type !== 'group' && !entityId) {
      setError('Choose an entity for this card.')
      return
    } else if (type === 'action' && !isActionable(entities[entityId])) {
      setError('That entity cannot be run as an action. Pick a scene, script, or switch.')
      return
    }

    onSave({
      id: card?.id ?? createId(),
      type,
      title: title.trim().slice(0, 80),
      entityId: type === 'note' || type === 'group' ? undefined : entityId,
      content: type === 'note' ? trimmedContent.slice(0, 2000) : undefined,
      width,
      children: type === 'group' ? (card?.children ?? []) : undefined,
      columns: type === 'group' ? columns : undefined,
    })
  }

  return (
    <div
      className="overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-editor-title"
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">{card ? 'Edit card' : 'New card'}</p>
            <h2 id="card-editor-title">{card ? 'Edit card' : 'Add a card'}</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close card editor"
          >
            <Icon name="x" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="editor-form">
          <div className="field">
            <span className="field-label">Card type</span>
            <div className="type-grid" role="group" aria-label="Card type">
              {TYPE_CHOICES.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  className={`type-choice ${type === choice.id ? 'is-selected' : ''}`}
                  aria-pressed={type === choice.id}
                  onClick={() => {
                    setType(choice.id)
                    setError('')
                    if (choice.id === 'note') setEntityId('')
                  }}
                >
                  <span className="type-icon">
                    <Icon name={choice.icon} size={18} />
                  </span>
                  <span>
                    <strong>{choice.label}</strong>
                    <small>{choice.hint}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {type === 'note' ? (
            <label className="field">
              <span className="field-label">Note text</span>
              <textarea
                className="text-input note-input"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Shoes off at the door. Bins go out on Tuesday."
                rows={4}
              />
            </label>
          ) : type === 'group' ? (
            <>
              <div className="editor-tip">
                <Icon name="grid" size={18} />
                <p>
                  This is a nested grid. After saving, use the <strong>Add to grid</strong>{' '}
                  tile inside it to place cards. Grids can be nested inside other grids.
                </p>
              </div>
              <div className="field">
                <span className="field-label">Grid columns</span>
                <div className="segmented" role="group" aria-label="Grid columns">
                  {([1, 2, 3] as GroupColumns[]).map((count) => (
                    <button
                      key={count}
                      type="button"
                      aria-pressed={columns === count}
                      className={columns === count ? 'is-active' : ''}
                      onClick={() => setColumns(count)}
                    >
                      {count} {count === 1 ? 'column' : 'columns'}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <label className="field">
                <span className="field-label">Search entities</span>
                <input
                  className="text-input"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name or entity id"
                />
              </label>

              {selectedEntity ? (
                <div className="selected-entity">
                  <span className="selected-icon">
                    <Icon name={iconForCard(type, selectedEntity, entityId)} size={18} />
                  </span>
                  <span>
                    <strong>{entityName(selectedEntity)}</strong>
                    <small>{selectedEntity.entity_id}</small>
                  </span>
                  <button
                    type="button"
                    className="tool-button"
                    onClick={() => setEntityId('')}
                    aria-label="Clear selected entity"
                  >
                    <Icon name="x" size={16} />
                  </button>
                </div>
              ) : null}

              <div className="entity-list" role="listbox" aria-label="Entities">
                {candidates.length === 0 ? (
                  <p className="entity-empty">
                    No matching entities. Connect Home Assistant in settings to load your devices.
                  </p>
                ) : (
                  candidates.map((entity) => (
                    <button
                      key={entity.entity_id}
                      type="button"
                      role="option"
                      aria-selected={entity.entity_id === entityId}
                      className={`entity-option ${entity.entity_id === entityId ? 'is-selected' : ''}`}
                      onClick={() => chooseEntity(entity.entity_id)}
                    >
                      <span className="entity-option-icon">
                        <Icon name={iconForCard(type, entity, entity.entity_id)} size={17} />
                      </span>
                      <span className="entity-option-text">
                        <strong>{entityName(entity)}</strong>
                        <small>{entity.entity_id}</small>
                      </span>
                      <span className="entity-option-state">{entity.state}</span>
                    </button>
                  ))
                )}
              </div>
            </>
          )}

          <label className="field">
            <span className="field-label">Card title</span>
            <input
              className="text-input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={type === 'note' ? 'Welcome home' : type === 'group' ? 'Quick controls' : 'Leave blank to use the entity name'}
              maxLength={80}
            />
          </label>

          <div className="field">
            <span className="field-label">Card width</span>
            <div className="segmented" role="group" aria-label="Card width">
              <button
                type="button"
                aria-pressed={width === 'normal'}
                className={width === 'normal' ? 'is-active' : ''}
                onClick={() => setWidth('normal')}
              >
                Standard
              </button>
              <button
                type="button"
                aria-pressed={width === 'wide'}
                className={width === 'wide' ? 'is-active' : ''}
                onClick={() => setWidth('wide')}
              >
                Wide
              </button>
              <button
                type="button"
                aria-pressed={width === 'full'}
                className={width === 'full' ? 'is-active' : ''}
                onClick={() => setWidth('full')}
              >
                Full
              </button>
            </div>
          </div>

          {error ? (
            <p className="form-error" role="alert">
              <Icon name="alert" size={16} />
              {error}
            </p>
          ) : null}

          <div className="modal-footer">
            <button type="button" className="button ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button primary">
              {card ? 'Save changes' : 'Add card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
