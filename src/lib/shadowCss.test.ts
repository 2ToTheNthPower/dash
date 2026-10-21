import { describe, expect, it } from 'vitest'
import { PANEL_BASE_CSS, shadowCss } from './shadowCss'

describe('shadowCss', () => {
  it('rewrites document selectors for a shadow root', () => {
    const css = `:root {
  --bg: white;
}
[data-mode="dark"] {
  --bg: black;
}
[data-accent="violet"] {
  --accent: violet;
}
[data-mode="dark"][data-accent="rose"] {
  --accent: rose;
}
[data-bg="grid"] body::before {
  color: red;
}
body::before {
  color: blue;
}
html,
body,
#root {
  min-height: 100%;
}
body {
  margin: 0;
}`

    const output = shadowCss(css)

    expect(output).toContain(':host {')
    expect(output).toContain(':host([data-mode="dark"]) {')
    expect(output).toContain(':host([data-accent="violet"]) {')
    expect(output).toContain(':host([data-mode="dark"][data-accent="rose"]) {')
    expect(output).toContain(':host([data-bg="grid"])::before')
    expect(output).toContain(':host::before')
    expect(output).toContain(':host, #dash-root {')
    expect(output).not.toContain(':root')
    expect(output).not.toMatch(/(^|\n)body\s*\{/)
    expect(output).not.toContain('[data-mode="dark"]\n')
  })

  it('defines a full-height host for the panel', () => {
    expect(PANEL_BASE_CSS).toContain('height: 100dvh')
    expect(PANEL_BASE_CSS).toContain('#dash-root')
  })
})
