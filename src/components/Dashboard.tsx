import { useState, type DragEvent, type KeyboardEvent } from 'react'
import type { DashboardCard, EntityMap, GroupColumns, HomeAssistantEntity } from '../types'
import { describeEntity, domainOf, entityName, sensorValue } from '../lib/format'
import { iconForCard } from '../lib/icons'
import { isActionable } from '../lib/services'
import { Icon } from './Icon'

interface DashboardProps {
  cards: DashboardCard[]
  entities: EntityMap
  editing: boolean
  onReorder: (parentId: string | null, fromId: string, toId: string) => void
  onNudge: (id: string, offset: number) => void
  onEdit: (card: DashboardCard) => void
  onRemove: (id: string) => void
  onAdd: (parentId: string | null) => void
  onAction: (entityId: string) => void
}

interface GridProps extends Omit<DashboardProps, 'cards' | 'onAdd'> {
  cards: DashboardCard[]
  parentId: string | null
  nested?: boolean
  label?: string
  columns?: GroupColumns
  onAdd: (parentId: string | null) => void
}

interface CardBodyProps {
  card: DashboardCard
  entity: HomeAssistantEntity | undefined
  entities: EntityMap
  editing: boolean
  onAction: (entityId: string) => void
  onReorder: GridProps['onReorder']
  onNudge: GridProps['onNudge']
  onEdit: GridProps['onEdit']
  onRemove: GridProps['onRemove']
  onAdd: GridProps['onAdd']
}

function cardName(card: DashboardCard, entity: HomeAssistantEntity | undefined): string {
  if (card.type === 'group') return card.title || 'Untitled grid'
  return card.title || entityName(entity, card.entityId)
}

function stateTone(entity: HomeAssistantEntity | undefined): string {
  if (!entity) return 'muted'
  if (entity.state === 'unavailable' || entity.state === 'unknown') return 'muted'
  if (entity.state === 'on' || entity.state === 'playing' || entity.state === 'heat') return 'on'
  if (entity.state === 'locked' || entity.state === 'closed') return 'off'
  return 'neutral'
}

function CardBody({
  card,
  entity,
  entities,
  editing,
  onAction,
  onReorder,
  onNudge,
  onEdit,
  onRemove,
  onAdd,
}: CardBodyProps) {
  const name = cardName(card, entity)
  const icon = iconForCard(card.type, entity, card.entityId)
  const summary = describeEntity(entity)
  const actionable = isActionable(entity)
  const canAct =
    !editing &&
    actionable &&
    (card.type === 'action' || card.type === 'entity') &&
    entity !== undefined

  const activate = () => {
    if (canAct && card.entityId) onAction(card.entityId)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!canAct) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      activate()
    }
  }

  if (card.type === 'group') {
    const children = card.children ?? []
    const columns = card.columns ?? 2

    return (
      <div className={`card-surface group-surface nested-cols-${columns}`}>
        <div className="group-heading">
          <span className="icon-wrap">
            <Icon name={icon} />
          </span>
          <div className="group-heading-copy">
            <h3>{name}</h3>
            <p>
              {children.length} {children.length === 1 ? 'card' : 'cards'} · {columns}{' '}
              {columns === 1 ? 'column' : 'columns'}
            </p>
          </div>
          <span className="pill neutral">Grid</span>
        </div>
        <CardGrid
          cards={children}
          parentId={card.id}
          label={name}
          columns={columns}
          nested
          entities={entities}
          editing={editing}
          onReorder={onReorder}
          onNudge={onNudge}
          onEdit={onEdit}
          onRemove={onRemove}
          onAdd={onAdd}
          onAction={onAction}
        />
        {children.length === 0 && !editing ? (
          <p className="group-empty">This grid is empty. Add cards in edit mode.</p>
        ) : null}
      </div>
    )
  }

  if (card.type === 'note') {
    return (
      <div className="card-surface note-surface">
        <div className="card-top">
          <span className="icon-wrap">
            <Icon name={icon} />
          </span>
          <span className="pill neutral">Note</span>
        </div>
        <div className="card-copy">
          <h3>{name}</h3>
          <p className="note-content">{card.content || 'Add some text in edit mode.'}</p>
        </div>
      </div>
    )
  }

  if (card.type === 'sensor') {
    const value = sensorValue(entity)
    return (
      <div className={`card-surface sensor-surface tone-${stateTone(entity)}`}>
        <div className="card-top">
          <span className="icon-wrap">
            <Icon name={icon} />
          </span>
          <span className="pill neutral">Sensor</span>
        </div>
        <div className="sensor-reading">
          <span className="sensor-value">{value.value}</span>
          {value.unit ? <span className="sensor-unit">{value.unit}</span> : null}
        </div>
        {value.ratio !== undefined ? (
          <span className="meter" aria-hidden="true">
            <span className="meter-fill" style={{ width: `${Math.round(value.ratio * 100)}%` }} />
          </span>
        ) : null}
        <h3>{name}</h3>
      </div>
    )
  }

  if (card.type === 'gauge') {
    const value = sensorValue(entity)
    const unit =
      typeof entity?.attributes.unit_of_measurement === 'string'
        ? entity.attributes.unit_of_measurement
        : undefined
    const parsed = entity ? Number(entity.state) : Number.NaN
    const fallbackRatio =
      unit === '%' && Number.isFinite(parsed)
        ? Math.min(1, Math.max(0, parsed / 100))
        : undefined
    const ratio = value.ratio ?? fallbackRatio
    const percent = ratio === undefined ? 0 : Math.round(ratio * 100)

    return (
      <div className={`card-surface gauge-surface tone-${stateTone(entity)}`}>
        <div className="card-top">
          <span className="icon-wrap">
            <Icon name={icon} />
          </span>
          <span className="pill neutral">Gauge</span>
        </div>
        <div
          className="gauge-ring"
          style={{
            background: `conic-gradient(var(--accent) ${percent}%, var(--seg-bg) 0)`,
          }}
          aria-hidden="true"
        >
          <div className="gauge-center">
            <span className="gauge-value">{value.value}</span>
            {value.unit ? <span className="gauge-unit">{value.unit}</span> : null}
          </div>
        </div>
        <h3>{name}</h3>
      </div>
    )
  }

  return (
    <div
      className={`card-surface interactive-surface ${canAct ? 'is-interactive' : ''} tone-${stateTone(entity)}`}
      role={canAct ? 'button' : undefined}
      tabIndex={canAct ? 0 : undefined}
      onClick={canAct ? activate : undefined}
      onKeyDown={onKeyDown}
      aria-label={canAct ? `${summary.primary}: ${name}` : undefined}
    >
      <div className="card-top">
        <span className={`icon-wrap ${card.type === 'action' ? 'action-icon' : ''}`}>
          <Icon name={icon} />
        </span>
        {card.type === 'action' ? (
          <span className="pill neutral">Action</span>
        ) : (
          <span className={`pill ${stateTone(entity)}`}>{summary.primary}</span>
        )}
      </div>
      <div className="card-copy">
        <h3>{name}</h3>
        <p>{card.type === 'action' ? (summary.secondary ?? 'Tap to activate') : summary.secondary}</p>
      </div>
      {canAct ? (
        <span className="card-hint" aria-hidden="true">
          {domainOf(entity?.entity_id ?? '') === 'scene' || domainOf(entity?.entity_id ?? '') === 'script'
            ? 'Run'
            : 'Toggle'}
        </span>
      ) : null}
    </div>
  )
}

function CardTile({
  card,
  index,
  count,
  entities,
  editing,
  nested,
  parentId,
  dragId,
  dragOverId,
  setDragId,
  setDragOverId,
  onReorder,
  onNudge,
  onEdit,
  onRemove,
  onAdd,
  onAction,
}: {
  card: DashboardCard
  index: number
  count: number
  entities: EntityMap
  editing: boolean
  nested: boolean
  parentId: string | null
  dragId: string | null
  dragOverId: string | null
  setDragId: (id: string | null) => void
  setDragOverId: (id: string | null) => void
  onReorder: GridProps['onReorder']
  onNudge: GridProps['onNudge']
  onEdit: GridProps['onEdit']
  onRemove: GridProps['onRemove']
  onAdd: GridProps['onAdd']
  onAction: GridProps['onAction']
}) {
  const entity = card.entityId ? entities[card.entityId] : undefined
  const name = cardName(card, entity)
  const widthClass =
    card.width === 'full' ? 'is-full' : card.width === 'wide' ? 'is-wide' : ''

  const className = [
    'dash-card',
    `card-type-${card.type}`,
    widthClass,
    nested ? 'is-nested' : '',
    editing ? 'is-editing' : '',
    dragId === card.id ? 'is-dragging' : '',
    dragOverId === card.id && dragId !== card.id ? 'is-drop-target' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const handleDragStart = (event: DragEvent<HTMLElement>) => {
    if (!editing) {
      event.preventDefault()
      return
    }
    event.stopPropagation()
    setDragId(card.id)
    event.dataTransfer?.setData('text/plain', card.id)
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnter = (event: DragEvent<HTMLElement>) => {
    if (!editing || !dragId || dragId === card.id) return
    event.stopPropagation()
    setDragOverId(card.id)
    onReorder(parentId, dragId, card.id)
  }

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    if (!editing) return
    event.preventDefault()
    event.stopPropagation()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (!editing || !dragId) return
    onReorder(parentId, dragId, card.id)
    setDragId(null)
    setDragOverId(null)
  }

  const handleDragEnd = () => {
    setDragId(null)
    setDragOverId(null)
  }

  const handleDragLeave = () => {
    if (dragOverId === card.id) setDragOverId(null)
  }

  const content = (
    <>
      {editing ? (
        <div className="card-tools">
          <span className="drag-handle" title="Drag to reorder">
            <Icon name="grip" size={16} />
          </span>
          <div className="tool-buttons">
            <button
              type="button"
              className="tool-button"
              aria-label={`Move ${name} up`}
              title="Move up"
              disabled={index === 0}
              onClick={() => onNudge(card.id, -1)}
            >
              <Icon name="arrow-up" size={16} />
            </button>
            <button
              type="button"
              className="tool-button"
              aria-label={`Move ${name} down`}
              title="Move down"
              disabled={index === count - 1}
              onClick={() => onNudge(card.id, 1)}
            >
              <Icon name="arrow-down" size={16} />
            </button>
            <button
              type="button"
              className="tool-button"
              aria-label={`Edit ${name}`}
              title="Edit card"
              onClick={() => onEdit(card)}
            >
              <Icon name="edit" size={16} />
            </button>
            <button
              type="button"
              className="tool-button danger"
              aria-label={`Remove ${name}`}
              title="Remove card"
              onClick={() => onRemove(card.id)}
            >
              <Icon name="trash" size={16} />
            </button>
          </div>
        </div>
      ) : null}

      <CardBody
        card={card}
        entity={entity}
        entities={entities}
        editing={editing}
        onReorder={onReorder}
        onNudge={onNudge}
        onEdit={onEdit}
        onRemove={onRemove}
        onAdd={onAdd}
        onAction={onAction}
      />
    </>
  )

  if (nested) {
    return (
      <div
        className={className}
        data-testid={`card-${card.id}`}
        onDragStart={handleDragStart}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        onDragLeave={handleDragLeave}
        draggable={editing}
      >
        {content}
      </div>
    )
  }

  return (
    <article
      className={className}
      data-testid={`card-${card.id}`}
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      onDragLeave={handleDragLeave}
      draggable={editing}
    >
      {content}
    </article>
  )
}

function CardGrid({
  cards,
  entities,
  editing,
  parentId,
  nested = false,
  label,
  columns = 2,
  onReorder,
  onNudge,
  onEdit,
  onRemove,
  onAdd,
  onAction,
}: GridProps) {
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const addButton = editing ? (
    <button
      type="button"
      className="add-tile"
      onClick={() => onAdd(parentId)}
      aria-label={parentId ? 'Add card to grid' : 'Add another card'}
    >
      <Icon name="plus" size={20} />
      <span>{parentId ? 'Add to grid' : 'Add card'}</span>
    </button>
  ) : null

  if (nested) {
    return (
      <div
        className={`nested-grid nested-cols-${columns}`}
        role="group"
        aria-label={label ?? 'Nested cards'}
      >
        {cards.map((card, index) => (
          <CardTile
            key={card.id}
            card={card}
            index={index}
            count={cards.length}
            entities={entities}
            editing={editing}
            nested
            parentId={parentId}
            dragId={dragId}
            dragOverId={dragOverId}
            setDragId={setDragId}
            setDragOverId={setDragOverId}
            onReorder={onReorder}
            onNudge={onNudge}
            onEdit={onEdit}
            onRemove={onRemove}
            onAdd={onAdd}
            onAction={onAction}
          />
        ))}
        {addButton}
      </div>
    )
  }

  return (
    <section className="card-grid" aria-label="Dashboard cards">
      {cards.map((card, index) => (
        <CardTile
          key={card.id}
          card={card}
          index={index}
          count={cards.length}
          entities={entities}
          editing={editing}
          nested={false}
          parentId={parentId}
          dragId={dragId}
          dragOverId={dragOverId}
          setDragId={setDragId}
          setDragOverId={setDragOverId}
          onReorder={onReorder}
          onNudge={onNudge}
          onEdit={onEdit}
          onRemove={onRemove}
          onAdd={onAdd}
          onAction={onAction}
        />
      ))}
      {addButton}
    </section>
  )
}

export function Dashboard({
  cards,
  entities,
  editing,
  onReorder,
  onNudge,
  onEdit,
  onRemove,
  onAdd,
  onAction,
}: DashboardProps) {
  if (cards.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">
          <Icon name="home" size={30} />
        </span>
        <h2>Nothing here yet</h2>
        <p>
          {editing
            ? 'Add a light, a sensor, a scene, a note, or a nested grid to get started.'
            : 'Switch to edit mode to add your first card.'}
        </p>
        {editing ? (
          <button type="button" className="button primary" onClick={() => onAdd(null)}>
            <Icon name="plus" size={18} />
            Add your first card
          </button>
        ) : null}
      </div>
    )
  }

  return (
    <CardGrid
      cards={cards}
      entities={entities}
      editing={editing}
      parentId={null}
      onReorder={onReorder}
      onNudge={onNudge}
      onEdit={onEdit}
      onRemove={onRemove}
      onAdd={onAdd}
      onAction={onAction}
    />
  )
}
