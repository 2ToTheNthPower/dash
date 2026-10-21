import type { DashboardCard } from '../types'

export function moveCard(
  cards: readonly DashboardCard[],
  fromId: string,
  toId: string,
): DashboardCard[] {
  if (fromId === toId) return [...cards]

  const fromIndex = cards.findIndex((card) => card.id === fromId)
  const toIndex = cards.findIndex((card) => card.id === toId)
  if (fromIndex < 0 || toIndex < 0) return [...cards]

  const next = [...cards]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

export function moveCardByOffset(
  cards: readonly DashboardCard[],
  id: string,
  offset: number,
): DashboardCard[] {
  const fromIndex = cards.findIndex((card) => card.id === id)
  if (fromIndex < 0) return [...cards]

  const toIndex = fromIndex + offset
  if (offset === 0 || toIndex < 0 || toIndex >= cards.length) return [...cards]

  const next = [...cards]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}
