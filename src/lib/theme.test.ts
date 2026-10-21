import { describe, expect, it } from 'vitest'
import { ACCENTS, applyTheme, resolveMode } from './theme'

describe('resolveMode', () => {
  it('honours explicit modes', () => {
    expect(resolveMode('light', true)).toBe('light')
    expect(resolveMode('dark', false)).toBe('dark')
  })

  it('follows the system preference', () => {
    expect(resolveMode('system', true)).toBe('dark')
    expect(resolveMode('system', false)).toBe('light')
  })
})

describe('applyTheme', () => {
  it('writes mode, accent, background and color-scheme to the document', () => {
    const resolved = applyTheme(
      { mode: 'dark', accent: 'violet' },
      'grid',
      document.documentElement,
      true,
    )

    expect(resolved).toBe('dark')
    expect(document.documentElement.dataset.mode).toBe('dark')
    expect(document.documentElement.dataset.accent).toBe('violet')
    expect(document.documentElement.dataset.bg).toBe('grid')
    expect(document.documentElement.style.colorScheme).toBe('dark')
  })

  it('resolves system mode from the supplied preference', () => {
    applyTheme({ mode: 'system', accent: 'emerald' }, 'plain', document.documentElement, false)
    expect(document.documentElement.dataset.mode).toBe('light')

    applyTheme({ mode: 'system', accent: 'emerald' }, 'plain', document.documentElement, true)
    expect(document.documentElement.dataset.mode).toBe('dark')
  })

  it('offers a full set of accents', () => {
    expect(ACCENTS).toHaveLength(5)
    expect(ACCENTS.map((accent) => accent.id)).toEqual([
      'azure',
      'violet',
      'emerald',
      'sunset',
      'rose',
    ])
  })
})
