import { describe, expect, it } from 'vitest'
import { createDefaultConfig } from './demo'
import {
  countCards,
  findCard,
  findCardParentId,
  insertCard,
  maxDepth,
  nudgeCard,
  removeCard,
  reorderInGrid,
  updateCard,
} from './cardTree'
import type { DashboardCard } from '../types'

function card(id: string, overrides: Partial<DashboardCard> = {}): DashboardCard {
  return { id, type: 'entity', title: id, width: 'normal', ...overrides }
}

function group(id: string, children: DashboardCard[]): DashboardCard {
  return {
    id,
    type: 'group',
    title: id,
    width: 'wide',
    columns: 2,
    children,
  }
}

describe('card tree helpers', () => {
  it('finds cards and their parent grid at any depth', () => {
    const tree = [group('outer', [card('one'), group('inner', [card('two')])])]

    expect(findCard(tree, 'two')?.id).toBe('two')
    expect(findCardParentId(tree, 'one')).toBe('outer')
    expect(findCardParentId(tree, 'two')).toBe('inner')
    expect(findCardParentId(tree, 'missing')).toBeUndefined()
  })

  it('inserts cards into root or a nested grid', () => {
    const tree = [group('outer', [card('one')])]
    const atRoot = insertCard(tree, card('root'), null)
    const inGroup = insertCard(tree, card('two'), 'outer')

    expect(atRoot.map((item) => item.id)).toEqual(['outer', 'root'])
    expect(inGroup[0].children?.map((item) => item.id)).toEqual(['one', 'two'])
  })

  it('updates and removes cards recursively', () => {
    const tree = [group('outer', [card('one'), card('two')])]
    const updated = updateCard(tree, { ...card('one'), title: 'Updated' })
    const removed = removeCard(tree, 'two')

    expect(findCard(updated, 'one')?.title).toBe('Updated')
    expect(findCard(removed, 'two')).toBeUndefined()
    expect(updated[0].children).toHaveLength(2)
    expect(removed[0].children).toHaveLength(1)
  })

  it('reorders inside a specific grid without touching the root order', () => {
    const tree = [group('outer', [card('one'), card('two'), card('three')]), card('root')]
    const reordered = reorderInGrid(tree, 'outer', 'one', 'three')

    expect(reordered[0].children?.map((item) => item.id)).toEqual(['two', 'three', 'one'])
    expect(reordered.map((item) => item.id)).toEqual(['outer', 'root'])
  })

  it('nudges a card inside its own grid', () => {
    const tree = [group('outer', [card('one'), card('two')])]
    const nudged = nudgeCard(tree, 'two', -1)

    expect(nudged[0].children?.map((item) => item.id)).toEqual(['two', 'one'])
  })

  it('counts nested cards and measures nesting depth', () => {
    const tree = [group('outer', [card('one'), group('inner', [card('two')])]), card('three')]

    expect(countCards(tree)).toBe(5)
    expect(maxDepth(tree)).toBe(3)
    expect(maxDepth(createDefaultConfig().cards)).toBe(2)
  })
})
