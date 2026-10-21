import type { EntityMap, HomeAssistantEntity } from '../types'

export interface HassThemes {
  darkMode?: boolean
}

export interface HassLike {
  states: Record<string, HomeAssistantEntity>
  callService: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
  ) => Promise<unknown>
  callApi?: (method: string, path: string, body?: unknown) => Promise<unknown>
  themes?: HassThemes
  language?: string
}

export function hassEntities(hass: HassLike | undefined): EntityMap {
  if (!hass?.states) return {}
  return { ...hass.states }
}
