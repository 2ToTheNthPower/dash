import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { HomeAssistantEntity } from '../types'
import {
  HomeAssistantClient,
  connectionFailureMessage,
  hasMixedContent,
  probeHomeAssistant,
  websocketUrl,
} from './ha'

const kitchen: HomeAssistantEntity = {
  entity_id: 'light.kitchen',
  state: 'on',
  attributes: { friendly_name: 'Kitchen lights' },
}

class FakeSocket {
  static instances: FakeSocket[] = []

  url: string
  readyState = 0
  onopen: (() => void) | null = null
  onmessage: ((event: { data: string }) => void) | null = null
  onerror: (() => void) | null = null
  onclose: (() => void) | null = null
  sent: Array<Record<string, unknown>> = []

  constructor(url: string) {
    this.url = url
    FakeSocket.instances.push(this)
  }

  send(raw: string): void {
    const message = JSON.parse(raw) as Record<string, unknown>
    this.sent.push(message)

    if (message.type === 'get_states') {
      queueMicrotask(() => {
        this.emit({ type: 'result', id: message.id, success: true, result: [kitchen] })
      })
    } else if (message.type === 'subscribe_events' || message.type === 'call_service') {
      queueMicrotask(() => {
        this.emit({ type: 'result', id: message.id, success: true, result: null })
      })
    }
  }

  close(): void {
    this.readyState = 3
  }

  emit(message: unknown): void {
    this.onmessage?.({ data: JSON.stringify(message) })
  }
}

function createClient(): HomeAssistantClient {
  FakeSocket.instances = []
  return new HomeAssistantClient((url) => new FakeSocket(url) as unknown as WebSocket)
}

describe('websocketUrl', () => {
  it('converts http and https base URLs into websocket URLs', () => {
    expect(websocketUrl('http://homeassistant.local:8123')).toBe(
      'ws://homeassistant.local:8123/api/websocket',
    )
    expect(websocketUrl('https://ha.example.com/')).toBe(
      'wss://ha.example.com/api/websocket',
    )
  })

  it('adds a missing scheme and drops query strings and hashes', () => {
    expect(websocketUrl('ha.local:8123/?token=x#y')).toBe(
      'ws://ha.local:8123/api/websocket',
    )
  })

  it('keeps an explicit websocket URL intact', () => {
    expect(websocketUrl('ws://ha.local:8123/api/websocket')).toBe(
      'ws://ha.local:8123/api/websocket',
    )
    expect(websocketUrl('ws://ha.local:8123/api/websocket/')).toBe(
      'ws://ha.local:8123/api/websocket',
    )
  })

  it('accepts dashboard URLs and strips Home Assistant UI paths', () => {
    expect(websocketUrl('http://ha.local:8123/lovelace/0?edit=1#x')).toBe(
      'ws://ha.local:8123/api/websocket',
    )
    expect(websocketUrl('https://example.com/ha/lovelace/home')).toBe(
      'wss://example.com/ha/api/websocket',
    )
    expect(websocketUrl('https://example.com/config/dashboard')).toBe(
      'wss://example.com/api/websocket',
    )
  })

  it('flags insecure websocket URLs on HTTPS pages', () => {
    expect(hasMixedContent('ws://ha.local:8123/api/websocket', 'https:')).toBe(true)
    expect(hasMixedContent('wss://ha.local:8123/api/websocket', 'https:')).toBe(false)
    expect(hasMixedContent('ws://ha.local:8123/api/websocket', 'http:')).toBe(false)
  })

  it('probes whether the Home Assistant page is reachable', async () => {
    const reachable = vi.fn().mockResolvedValue({ type: 'opaque' })
    const unreachable = vi.fn().mockRejectedValue(new Error('no route'))

    expect(await probeHomeAssistant('ws://ha.local:8123/api/websocket', reachable as unknown as typeof fetch)).toBe('reachable')
    expect(await probeHomeAssistant('ws://ha.local:8123/api/websocket', unreachable as unknown as typeof fetch)).toBe('unreachable')
    expect(await probeHomeAssistant('ws://ha.local:8123/api/websocket', null)).toBe('unknown')
  })

  it('explains .local resolution failures and proxy blocks', () => {
    const unreachable = connectionFailureMessage(
      'ws://homeassistant.local:8123/api/websocket',
      'unreachable',
    )
    const blocked = connectionFailureMessage(
      'ws://homeassistant.local:8123/api/websocket',
      'reachable',
    )

    expect(unreachable).toContain('homeassistant.local')
    expect(unreachable).toContain('IP address')
    expect(unreachable).toContain('HACS')
    expect(unreachable).toMatch(/page loads but Connect still fails/i)
    expect(blocked).toMatch(/WebSocket|reverse proxy/i)
    expect(blocked).toContain('HACS')
  })

  it('rejects empty or unsupported URLs', () => {
    expect(() => websocketUrl('')).toThrow(/Enter your Home Assistant URL/i)
    expect(() => websocketUrl('ftp://ha.local')).toThrow(/http/i)
  })
})

describe('HomeAssistantClient', () => {
  beforeEach(() => {
    FakeSocket.instances = []
  })

  it('authenticates, loads states, subscribes, and applies live updates', async () => {
    const client = createClient()
    const listener = vi.fn()
    client.onEntities(listener)

    const promise = client.connect('http://ha.local:8123', 'secret-token')
    const socket = FakeSocket.instances[0]

    expect(socket.url).toBe('ws://ha.local:8123/api/websocket')

    socket.readyState = 1
    socket.onopen?.()
    socket.emit({ type: 'auth_required' })
    expect(socket.sent.at(-1)).toEqual({ type: 'auth', access_token: 'secret-token' })

    socket.emit({ type: 'auth_ok' })
    const states = await promise

    expect(states).toEqual([kitchen])
    expect(client.getEntities()['light.kitchen'].state).toBe('on')
    expect(socket.sent.some((message) => message.type === 'subscribe_events')).toBe(true)
    expect(listener).toHaveBeenCalled()

    socket.emit({
      type: 'event',
      event: {
        event_type: 'state_changed',
        data: {
          entity_id: 'light.kitchen',
          new_state: { ...kitchen, state: 'off' },
        },
      },
    })

    expect(client.getEntities()['light.kitchen'].state).toBe('off')
    expect(listener).toHaveBeenLastCalledWith(
      expect.objectContaining({
        'light.kitchen': expect.objectContaining({ state: 'off' }),
      }),
    )

    client.disconnect()
  })

  it('sends service calls once connected', async () => {
    const client = createClient()
    const promise = client.connect('http://ha.local:8123', 'token')
    const socket = FakeSocket.instances[0]
    socket.readyState = 1
    socket.emit({ type: 'auth_required' })
    socket.emit({ type: 'auth_ok' })
    await promise

    const result = await client.callService('light', 'toggle', {
      entity_id: 'light.kitchen',
    })

    expect(result).toBeNull()
    expect(
      socket.sent.some(
        (message) =>
          message.type === 'call_service' &&
          message.domain === 'light' &&
          message.service === 'toggle',
      ),
    ).toBe(true)

    client.disconnect()
  })

  it('rejects invalid tokens', async () => {
    const client = createClient()
    const promise = client.connect('https://ha.example.com', 'bad-token')
    const socket = FakeSocket.instances[0]

    socket.readyState = 1
    socket.emit({ type: 'auth_required' })
    socket.emit({ type: 'auth_invalid' })

    await expect(promise).rejects.toThrow(/rejected/i)
  })
})
