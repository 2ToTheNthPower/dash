import type { HomeAssistantEntity } from '../types'

type SocketFactory = (url: string) => WebSocket

interface PendingRequest {
  resolve: (value: unknown) => void
  reject: (error: Error) => void
}

interface HAMessage {
  id?: number
  type?: string
  success?: boolean
  result?: unknown
  error?: { message?: string }
  event?: {
    event_type?: string
    data?: {
      entity_id?: string
      new_state?: HomeAssistantEntity | null
    }
  }
}

export type EntitiesListener = (entities: Record<string, HomeAssistantEntity>) => void

const HA_UI_SEGMENTS = new Set([
  'lovelace',
  'dashboard',
  'dashboards',
  'overview',
  'config',
  'history',
  'logbook',
  'energy',
  'map',
  'media-browser',
  'developer-tools',
  'profile',
  'todo',
  'calendar',
  'mailbox',
  'hacs',
])

export function websocketUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) throw new Error('Enter your Home Assistant URL.')

  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`
  let url: URL
  try {
    url = new URL(withScheme)
  } catch {
    throw new Error('That URL does not look right. Paste the address you use to open Home Assistant.')
  }

  if (url.protocol === 'http:') url.protocol = 'ws:'
  else if (url.protocol === 'https:') url.protocol = 'wss:'
  else if (url.protocol !== 'ws:' && url.protocol !== 'wss:') {
    throw new Error('Use an http(s) or ws(s) URL.')
  }

  url.hash = ''
  url.search = ''

  const pathname = url.pathname.replace(/\/+$/, '')
  if (/\/api\/websocket$/i.test(pathname)) {
    url.pathname = pathname
    return url.toString()
  }

  const segments = pathname.split('/').filter(Boolean)
  const uiIndex = segments.findIndex((segment) =>
    HA_UI_SEGMENTS.has(segment.toLowerCase()),
  )
  const baseSegments = uiIndex >= 0 ? segments.slice(0, uiIndex) : segments
  url.pathname = `/${[...baseSegments, 'api', 'websocket'].join('/')}`
  return url.toString()
}

export type Reachability = 'reachable' | 'unreachable' | 'unknown'

function httpAddress(endpoint: string): string {
  const url = new URL(endpoint)
  url.protocol = url.protocol === 'wss:' ? 'https:' : 'http:'
  url.pathname = url.pathname.replace(/\/api\/websocket$/i, '/')
  url.search = ''
  url.hash = ''
  return url.toString()
}

export async function probeHomeAssistant(
  endpoint: string,
  fetchImpl: typeof fetch | null | undefined = typeof fetch === 'function' ? fetch : undefined,
  timeoutMs = 4000,
): Promise<Reachability> {
  if (!fetchImpl) return 'unknown'

  let timer: ReturnType<typeof setTimeout> | undefined
  let controller: AbortController | undefined

  try {
    if (typeof AbortController !== 'undefined') {
      controller = new AbortController()
      timer = setTimeout(() => controller?.abort(), timeoutMs)
    }

    await fetchImpl(httpAddress(endpoint), {
      mode: 'no-cors',
      cache: 'no-store',
      signal: controller?.signal,
    })
    return 'reachable'
  } catch {
    return 'unreachable'
  } finally {
    if (timer) clearTimeout(timer)
  }
}

export function connectionFailureMessage(
  endpoint: string,
  reachability: Reachability,
): string {
  const pageUrl = httpAddress(endpoint)
  const host = new URL(endpoint).host

  if (reachability === 'reachable') {
    return `The Home Assistant page at ${pageUrl} responded, but the realtime WebSocket connection failed. A reverse proxy, firewall, or the browser's local-network protection may be blocking WebSockets. If you installed Dash through HACS, open it from the Home Assistant sidebar instead.`
  }

  if (reachability === 'unreachable') {
    return `This browser could not open a realtime connection to ${host}. Open ${pageUrl} in a new tab. If that page loads but Connect still fails, your browser is blocking this page's WebSocket or local-network access, or a proxy is blocking WebSockets. The HACS sidebar panel avoids this entirely because it runs inside Home Assistant. If the page does not load, use the numeric IP address of Home Assistant (for example http://192.168.1.50:8123), the URL from the Home Assistant app, or your Nabu Casa HTTPS address instead of homeassistant.local.`
  }

  return `Could not reach Home Assistant at ${endpoint}. Check the URL, that Home Assistant is running, and that this browser can reach it. If the page opens in a tab but this still fails, the browser is blocking the app's local-network connection.`
}

export function hasMixedContent(
  wsUrl: string,
  pageProtocol: string = typeof window === 'undefined' ? 'http:' : window.location.protocol,
): boolean {
  return pageProtocol === 'https:' && wsUrl.startsWith('ws://')
}

export class HomeAssistantClient {
  private socket: WebSocket | null = null
  private messageId = 1
  private pending = new Map<number, PendingRequest>()
  private entities = new Map<string, HomeAssistantEntity>()
  private listeners = new Set<EntitiesListener>()
  private readonly socketFactory: SocketFactory

  constructor(socketFactory: SocketFactory = (url) => new WebSocket(url)) {
    this.socketFactory = socketFactory
  }

  onEntities(listener: EntitiesListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getEntities(): Record<string, HomeAssistantEntity> {
    return Object.fromEntries(this.entities)
  }

  connect(url: string, token: string): Promise<HomeAssistantEntity[]> {
    this.disconnect()

    return new Promise((resolve, reject) => {
      let settled = false

      const fail = (error: Error) => {
        if (settled) return
        settled = true
        clearTimeout(timeout)
        this.disconnect()
        reject(error)
      }

      const timeout = setTimeout(() => {
        fail(new Error('Connection timed out. Check the URL and that Home Assistant is reachable from this browser.'))
      }, 12000)

      let socket: WebSocket
      let endpoint = ''
      try {
        endpoint = websocketUrl(url)
        if (hasMixedContent(endpoint)) {
          throw new Error(
            'This page is served over HTTPS, so Home Assistant must use HTTPS too. Open Dash from Home Assistant or use your https:// address.',
          )
        }
        socket = this.socketFactory(endpoint)
      } catch (error) {
        fail(error instanceof Error ? error : new Error('Could not build a WebSocket URL.'))
        return
      }
      this.socket = socket

      const reachability = probeHomeAssistant(endpoint)
      const networkFailure = () =>
        reachability.then(
          (result) => new Error(connectionFailureMessage(endpoint, result)),
        )

      const send = (payload: Record<string, unknown>) => {
        socket.send(JSON.stringify(payload))
      }

      socket.onerror = () => {
        void networkFailure().then(fail)
      }

      socket.onclose = () => {
        if (!settled) {
          void networkFailure().then(fail)
          return
        }
        this.rejectPending(new Error('Lost the connection to Home Assistant.'))
      }

      socket.onmessage = (event) => {
        let message: HAMessage
        try {
          message = JSON.parse(String(event.data)) as HAMessage
        } catch {
          return
        }

        if (message.type === 'auth_required') {
          send({ type: 'auth', access_token: token })
          return
        }

        if (message.type === 'auth_invalid') {
          fail(
            new Error(
              'Home Assistant rejected that access token. Create a new long-lived token under Profile → Security and paste the whole value.',
            ),
          )
          return
        }

        if (message.type === 'auth_ok') {
          clearTimeout(timeout)

          this.request<HomeAssistantEntity[]>('get_states')
            .then((states) => {
              if (settled) return
              settled = true
              this.entities = new Map(states.map((state) => [state.entity_id, state]))
              this.emit()
              this.request('subscribe_events', { event_type: 'state_changed' }).catch(
                () => undefined,
              )
              resolve(states)
            })
            .catch((error: unknown) => {
              fail(error instanceof Error ? error : new Error('Could not load Home Assistant states.'))
            })
          return
        }

        if (message.type === 'event') {
          this.handleEvent(message)
          return
        }

        if (message.type === 'result' && typeof message.id === 'number') {
          const pending = this.pending.get(message.id)
          if (!pending) return
          this.pending.delete(message.id)
          if (message.success) pending.resolve(message.result)
          else {
            pending.reject(
              new Error(message.error?.message ?? 'Home Assistant rejected the request.'),
            )
          }
        }
      }
    })
  }

  async callService(
    domain: string,
    service: string,
    data: Record<string, unknown> = {},
  ): Promise<unknown> {
    return this.request('call_service', { domain, service, service_data: data })
  }

  disconnect(): void {
    const socket = this.socket
    this.socket = null
    this.rejectPending(new Error('Disconnected from Home Assistant.'))

    if (socket) {
      socket.onopen = null
      socket.onmessage = null
      socket.onerror = null
      socket.onclose = null
      try {
        socket.close()
      } catch {
      }
    }
  }

  private request<T = unknown>(type: string, payload: Record<string, unknown> = {}): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const socket = this.socket
      if (!socket || socket.readyState !== 1) {
        reject(new Error('Not connected to Home Assistant.'))
        return
      }

      const id = this.messageId++
      this.pending.set(id, {
        resolve: (value) => resolve(value as T),
        reject,
      })

      try {
        socket.send(JSON.stringify({ id, type, ...payload }))
      } catch {
        this.pending.delete(id)
        reject(new Error('Could not send the request to Home Assistant.'))
      }
    })
  }

  private rejectPending(error: Error): void {
    for (const pending of this.pending.values()) pending.reject(error)
    this.pending.clear()
  }

  private handleEvent(message: HAMessage): void {
    if (message.event?.event_type !== 'state_changed') return

    const entityId = message.event.data?.entity_id
    const newState = message.event.data?.new_state
    if (!entityId) return

    if (newState) this.entities.set(entityId, newState)
    else this.entities.delete(entityId)
    this.emit()
  }

  private emit(): void {
    const snapshot = this.getEntities()
    for (const listener of this.listeners) listener(snapshot)
  }
}
