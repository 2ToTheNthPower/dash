import { describe, expect, it } from 'vitest'
import type { DashboardCard } from '../types'
import { moveCard, moveCardByOffset } from './reorder'

function card(id: string): DashboardCard {
  return { id, type: 'entity', title: id, width: 'normal' }
}

const cards = [card('a'), card('b'), card('c'), card('d')]
const ids = (list: DashboardCard[]) => list.map((item) => item.id)

describe('moveCard', () => {
  it('moves a card down to another card position', () => {
    expect(ids(moveCard(cards, 'a', 'c'))).toEqual(['b', 'c', 'a', 'd'])
  })

  it('moves a card up to another card position', () => {
    expect(ids(moveCard(cards, 'd', 'b'))).toEqual(['a', 'd', 'b', 'c'])
  })

  it('returns a copy when ids match or are unknown', () => {
    const same = moveCard(cards, 'a', 'a')
    const unknown = moveCard(cards, 'a', 'missing')
    expect(same).toEqual(cards)
    expect(same).not.toBe(cards)
    expect(unknown).toEqual(cards)
    expect(unknown).not.toBe(cards)
  })

  it('does not mutate the original list', () => {
    moveCard(cards, 'a', 'd')
    expect(ids(cards)).toEqual(['a', 'b', 'c', 'd'])
  })
})

describe('moveCardByOffset', () => {
  it('moves a card by one position in both directions', () => {
    expect(ids(moveCardByOffset(cards, 'b', 1))).toEqual(['a', 'c', 'b', 'd'])
    expect(ids(moveCardByOffset(cards, 'c', -1))).toEqual(['a', 'c', 'b', 'd'])
  })

  it('ignores moves past either edge and unknown ids', () => {
    expect(ids(moveCardByOffset(cards, 'a', -1))).toEqual(['a', 'b', 'c', 'd'])
    expect(ids(moveCardByOffset(cards, 'd', 1))).toEqual(['a', 'b', 'c', 'd'])
    expect(ids(moveCardByOffset(cards, 'missing', 1))).toEqual(['a', 'b', 'c', 'd'])
    expect(ids(moveCardByOffset(cards, 'b', 0))).toEqual(['a', 'b', 'c', 'd'])
  })
})
