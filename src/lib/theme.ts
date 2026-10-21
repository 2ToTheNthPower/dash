import type { AccentName, BackgroundStyle, DashboardTheme, ThemeMode } from '../types'

export interface AccentDefinition {
  id: AccentName
  label: string
  light: string
  dark: string
}

export const ACCENTS: AccentDefinition[] = [
  { id: 'azure', label: 'Azure', light: '#0284c7', dark: '#38bdf8' },
  { id: 'violet', label: 'Violet', light: '#7c3aed', dark: '#a78bfa' },
  { id: 'emerald', label: 'Emerald', light: '#047857', dark: '#34d399' },
  { id: 'sunset', label: 'Sunset', light: '#ea580c', dark: '#fb923c' },
  { id: 'rose', label: 'Rose', light: '#e11d48', dark: '#fb7185' },
]

export const BACKGROUNDS: { id: BackgroundStyle; label: string; description: string }[] = [
  { id: 'aurora', label: 'Aurora', description: 'Soft colour glows' },
  { id: 'grid', label: 'Grid', description: 'Faint blueprint' },
  { id: 'plain', label: 'Plain', description: 'Just the cards' },
]

export function resolveMode(mode: ThemeMode, prefersDark: boolean): 'light' | 'dark' {
  if (mode === 'system') return prefersDark ? 'dark' : 'light'
  return mode
}

export function systemPrefersDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function applyTheme(
  theme: DashboardTheme,
  background: BackgroundStyle,
  root: HTMLElement = document.documentElement,
  prefersDark: boolean = systemPrefersDark(),
): 'light' | 'dark' {
  const resolved = resolveMode(theme.mode, prefersDark)
  root.dataset.mode = resolved
  root.dataset.accent = theme.accent
  root.dataset.bg = background
  root.style.colorScheme = resolved
  return resolved
}
