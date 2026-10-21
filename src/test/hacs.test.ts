import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const readJson = (path: string) => JSON.parse(readFileSync(join(root, path), 'utf8'))

describe('HACS integration structure', () => {
  it('has a valid hacs.json for an integration repository', () => {
    const hacs = readJson('hacs.json')
    expect(hacs.name).toBe('Dash')
    expect(hacs.render_readme).toBe(true)
    expect(hacs.content_in_root).toBe(false)
    expect(hacs.homeassistant).toBeTruthy()
  })

  it('has a complete integration manifest', () => {
    const manifest = readJson('custom_components/dash/manifest.json')

    expect(manifest.domain).toBe('dash')
    expect(manifest.name).toBe('Dash')
    expect(manifest.version).toMatch(/^\d+\.\d+\.\d+$/)
    expect(manifest.config_flow).toBe(true)
    expect(manifest.dependencies).toEqual(
      expect.arrayContaining(['http', 'frontend', 'panel_custom']),
    )
    expect(manifest.documentation).toMatch(/^https:\/\//)
    expect(manifest.issue_tracker).toMatch(/^https:\/\//)
    expect(Array.isArray(manifest.codeowners)).toBe(true)
  })

  it('ships Python setup, config flow, translations, and brand assets', () => {
    for (const path of [
      'custom_components/dash/__init__.py',
      'custom_components/dash/config_flow.py',
      'custom_components/dash/const.py',
      'custom_components/dash/strings.json',
      'custom_components/dash/translations/en.json',
      'custom_components/dash/brand/icon.png',
    ]) {
      expect(statSync(join(root, path)).size).toBeGreaterThan(0)
    }

    const setup = readFileSync(join(root, 'custom_components/dash/__init__.py'), 'utf8')
    expect(setup).toContain('panel_custom.async_register_panel')
    expect(setup).toContain('StaticPathConfig')
    expect(setup).toContain('webcomponent_name="dash-panel"')
  })

  it('ships a built panel bundle that registers the custom element', () => {
    const bundle = readFileSync(
      join(root, 'custom_components/dash/frontend/dash-panel.js'),
      'utf8',
    )
    expect(bundle.length).toBeGreaterThan(10000)
    expect(bundle).toContain('dash-panel')
    expect(bundle).toContain('customElements')
  })
})
