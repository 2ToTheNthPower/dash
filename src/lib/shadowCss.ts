const DARK_ACCENT_PATTERN = /\[data-mode="dark"\]\[data-accent="([^"]+)"\]/g
const BACKGROUND_PATTERN = /\[data-bg="([^"]+)"\]\s+body::before/g

export function shadowCss(css: string): string {
  const combined: Array<[string, string]> = []

  const withTokens = css.replace(DARK_ACCENT_PATTERN, (_match, accent: string) => {
    const token = `__DASH_DARK_ACCENT_${accent.toUpperCase()}__`
    combined.push([token, `:host([data-mode="dark"][data-accent="${accent}"])`])
    return token
  })

  let output = withTokens
    .replace(BACKGROUND_PATTERN, ':host([data-bg="$1"])::before')
    .replace(/body::before/g, ':host::before')
    .replace(/^html,\s*body,\s*#root\s*\{/m, ':host, #dash-root {')
    .replace(/^body\s*\{/m, ':host {')
    .replace(/:root\b/g, ':host')
    .replace(/\[data-mode="dark"\]/g, ':host([data-mode="dark"])')
    .replace(/\[data-accent="([^"]+)"\]/g, ':host([data-accent="$1"])')

  for (const [token, replacement] of combined) {
    output = output.replace(token, replacement)
  }

  return output
}

export const PANEL_BASE_CSS = `
:host {
  display: block;
  box-sizing: border-box;
  height: 100vh;
  height: 100dvh;
  padding-top: var(--safe-area-inset-top, 0px);
  padding-bottom: var(--safe-area-inset-bottom, 0px);
  padding-left: var(--safe-area-content-inset-left, var(--safe-area-inset-left, 0px));
  padding-right: var(--safe-area-content-inset-right, var(--safe-area-inset-right, 0px));
  overflow-y: auto;
  background: var(--bg);
  isolation: isolate;
}

#dash-root {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
}
`
