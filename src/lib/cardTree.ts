import type { DashboardCard } from '../types'
import { moveCard, moveCardByOffset } from './reorder'

export function findCard(
  cards: readonly DashboardCard[],
  id: string,
): DashboardCard | undefined {
  for (const card of cards) {
    if (card.id === id) return card
    if (card.type === 'group' && card.children) {
      const found = findCard(card.children, id)
      if (found) return found
    }
  }
  return undefined
}

export function findCardParentId(
  cards: readonly DashboardCard[],
  id: string,
  parentId: string | null = null,
): string | null | undefined {
  for (const card of cards) {
    if (card.id === id) return parentId
    if (card.type === 'group' && card.children) {
      const found = findCardParentId(card.children, id, card.id)
      if (found !== undefined) return found
    }
  }
  return undefined
}

export function updateCard(
  cards: readonly DashboardCard[],
  updated: DashboardCard,
): DashboardCard[] {
  return cards.map((card) => {
    if (card.id === updated.id) return updated
    if (card.type === 'group' && card.children) {
      return { ...card, children: updateCard(card.children, updated) }
    }
    return card
  })
}

export function removeCard(cards: readonly DashboardCard[], id: string): DashboardCard[] {
  return cards
    .filter((card) => card.id !== id)
    .map((card) => {
      if (card.type === 'group' && card.children) {
        return { ...card, children: removeCard(card.children, id) }
      }
      return card
    })
}

export function insertCard(
  cards: readonly DashboardCard[],
  card: DashboardCard,
  parentId: string | null,
): DashboardCard[] {
  if (parentId === null) return [...cards, card]

  return cards.map((item) => {
    if (item.id === parentId && item.type === 'group') {
      return { ...item, children: [...(item.children ?? []), card] }
    }
    if (item.type === 'group' && item.children) {
      return { ...item, children: insertCard(item.children, card, parentId) }
    }
    return item
  })
}

function replaceGrid(
  cards: readonly DashboardCard[],
  parentId: string | null,
  transform: (cards: readonly DashboardCard[]) => DashboardCard[],
): DashboardCard[] {
  if (parentId === null) return transform(cards)

  return cards.map((card) => {
    if (card.id === parentId && card.type === 'group') {
      return { ...card, children: transform(card.children ?? []) }
    }
    if (card.type === 'group' && card.children) {
      return { ...card, children: replaceGrid(card.children, parentId, transform) }
    }
    return card
  })
}

export function reorderInGrid(
  cards: readonly DashboardCard[],
  parentId: string | null,
  fromId: string,
  toId: string,
): DashboardCard[] {
  return replaceGrid(cards, parentId, (children) => moveCard(children, fromId, toId))
}

export function nudgeCard(
  cards: readonly DashboardCard[],
  id: string,
  offset: number,
): DashboardCard[] {
  const parentId = findCardParentId(cards, id)
  if (parentId === undefined) return [...cards]

  return replaceGrid(cards, parentId, (children) => moveCardByOffset(children, id, offset))
}

export function countCards(cards: readonly DashboardCard[]): number {
  return cards.reduce(
    (total, card) =>
      total +
      1 +
      (card.type === 'group' && card.children ? countCards(card.children) : 0),
    0,
  )
}

export function maxDepth(cards: readonly DashboardCard[]): number {
  return cards.reduce((depth, card) => {
    if (card.type !== 'group' || !card.children?.length) return Math.max(depth, 1)
    return Math.max(depth, 1 + maxDepth(card.children))
  }, 0)
}
