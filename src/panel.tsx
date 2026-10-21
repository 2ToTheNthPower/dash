import { createRoot, type Root } from 'react-dom/client'
import App from './App'
import { PANEL_BASE_CSS, shadowCss } from './lib/shadowCss'
import type { HassLike } from './lib/hass'
import styles from './styles.css?inline'
import flowStyles from '@xyflow/react/dist/style.css?inline'

class DashPanel extends HTMLElement {
  private reactRoot?: Root
  private hassState?: HassLike
  private renderQueued = false

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' })
      const style = document.createElement('style')
      style.textContent = `${shadowCss(styles)}\n${shadowCss(flowStyles)}\n${PANEL_BASE_CSS}`
      shadow.appendChild(style)

      const mount = document.createElement('div')
      mount.id = 'dash-root'
      shadow.appendChild(mount)
      this.reactRoot = createRoot(mount)
    }

    const upgradedHass = (this as DashPanel).hass
    if (!this.hassState && upgradedHass) this.hassState = upgradedHass

    this.scheduleRender()
  }

  get hass(): HassLike | undefined {
    return this.hassState
  }

  set hass(value: HassLike | undefined) {
    this.hassState = value
    this.scheduleRender()
  }

  private scheduleRender(): void {
    if (!this.reactRoot || this.renderQueued) return
    this.renderQueued = true

    const render = () => {
      this.renderQueued = false
      this.reactRoot?.render(<App hass={this.hassState} embedded themeRoot={this} />)
    }

    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(render)
    else setTimeout(render, 0)
  }
}

if (!customElements.get('dash-panel')) {
  customElements.define('dash-panel', DashPanel)
}
