import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { HassLike } from './lib/hass'
import App from './App'

function fakeHass(overrides: Partial<HassLike> = {}): HassLike {
  return {
    states: {
      'light.living_room': {
        entity_id: 'light.living_room',
        state: 'on',
        attributes: { friendly_name: 'Living room lights', brightness: 255 },
        last_changed: new Date().toISOString(),
      },
      'sensor.temperature': {
        entity_id: 'sensor.temperature',
        state: '21.5',
        attributes: { friendly_name: 'Temperature', unit_of_measurement: '°C' },
        last_changed: new Date().toISOString(),
      },
    },
    callService: vi.fn().mockResolvedValue({}),
    callApi: vi.fn().mockResolvedValue({}),
    themes: { darkMode: false },
    ...overrides,
  }
}

describe('Dash dashboard builder', () => {
  it('renders the demo dashboard, toggles a light, and switches theme quickly', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'My home' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Living room' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'On: Living room' }))
    expect(screen.getByRole('button', { name: 'Off: Living room' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /switch to dark theme/i }))
    expect(document.documentElement.dataset.mode).toBe('dark')
    expect(
      screen.getByRole('button', { name: /switch to light theme/i }),
    ).toBeInTheDocument()
  })

  it('adds a note card and persists it across reloads', async () => {
    const user = userEvent.setup()
    const view = render(<App />)

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.click(screen.getByRole('button', { name: 'Add card' }))

    const dialog = screen.getByRole('dialog', { name: 'Add a card' })
    await user.click(within(dialog).getByRole('button', { name: /note/i }))
    await user.type(within(dialog).getByLabelText('Note text'), 'Bins go out on Tuesday.')
    await user.type(within(dialog).getByLabelText('Card title'), 'House rules')
    await user.click(within(dialog).getByRole('button', { name: 'Add card' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'House rules' })).toBeInTheDocument()
    expect(screen.getByText('Bins go out on Tuesday.')).toBeInTheDocument()
    expect(window.localStorage.getItem('dash.dashboard.v1')).toContain('House rules')

    view.unmount()
    render(<App />)
    expect(screen.getByRole('heading', { name: 'House rules' })).toBeInTheDocument()
  })

  it('adds an entity card from the searchable entity picker', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.click(screen.getByRole('button', { name: 'Add card' }))

    const dialog = screen.getByRole('dialog', { name: 'Add a card' })
    await user.type(within(dialog).getByLabelText('Search entities'), 'kitchen')
    await user.click(within(dialog).getByRole('option', { name: /Kitchen lights/i }))

    expect(within(dialog).getByLabelText('Card title')).toHaveValue('Kitchen lights')
    await user.click(within(dialog).getByRole('button', { name: 'Add card' }))

    expect(screen.getByRole('heading', { name: 'Kitchen lights' })).toBeInTheDocument()
  })

  it('removes cards and reorders them with accessible arrow buttons', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Edit' }))

    let articles = screen.getAllByRole('article')
    expect(within(articles[0]).getByRole('heading', { level: 3 })).toHaveTextContent(
      'Living room',
    )

    await user.click(screen.getByRole('button', { name: 'Move Temperature up' }))
    articles = screen.getAllByRole('article')
    expect(within(articles[0]).getByRole('heading', { level: 3 })).toHaveTextContent(
      'Temperature',
    )

    await user.click(screen.getByRole('button', { name: 'Remove Living room' }))
    expect(screen.queryByRole('heading', { name: 'Living room' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(6)
  })

  it('reorders cards with drag and drop', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Edit' }))

    const articles = screen.getAllByRole('article')
    fireEvent.dragStart(articles[0])
    fireEvent.dragEnter(articles[1])
    fireEvent.dragEnd(articles[1])

    const reordered = screen.getAllByRole('article')
    expect(within(reordered[0]).getByRole('heading', { level: 3 })).toHaveTextContent(
      'Temperature',
    )
  })

  it('renders a nested grid and adds a card inside it', async () => {
    const user = userEvent.setup()
    render(<App />)

    const initialGroup = screen.getByRole('group', { name: 'Quick controls' })
    expect(within(initialGroup).getByText('Kitchen')).toBeInTheDocument()
    expect(within(initialGroup).getByText('Humidity')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    const group = screen.getByRole('group', { name: 'Quick controls' })
    await user.click(within(group).getByRole('button', { name: 'Add card to grid' }))

    const dialog = screen.getByRole('dialog', { name: 'Add a card' })
    await user.click(within(dialog).getByRole('button', { name: /note/i }))
    await user.type(within(dialog).getByLabelText('Note text'), 'Wi-Fi password is on the fridge.')
    await user.type(within(dialog).getByLabelText('Card title'), 'Grid note')
    await user.click(within(dialog).getByRole('button', { name: 'Add card' }))

    const updatedGroup = screen.getByRole('group', { name: 'Quick controls' })
    expect(within(updatedGroup).getByRole('heading', { name: 'Grid note' })).toBeInTheDocument()
    expect(within(updatedGroup).getByText('Wi-Fi password is on the fridge.')).toBeInTheDocument()
    expect(within(updatedGroup).getAllByTestId(/^card-/)).toHaveLength(3)
  })

  it('opens the automation graph editor and adds a node from the palette', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Automations' }))

    expect(await screen.findByRole('heading', { name: 'Automations' })).toBeInTheDocument()
    expect(await screen.findByLabelText('Automation name')).toHaveValue(
      'Hallway lights on motion',
    )
    expect(screen.getByText('Motion detected')).toBeInTheDocument()

    const before = document.querySelectorAll('.react-flow__node').length
    await user.click(screen.getByRole('button', { name: /^Delay/i }))

    expect(document.querySelectorAll('.react-flow__node').length).toBe(before + 1)
    expect(await screen.findByLabelText('Node settings')).toBeInTheDocument()
  })

  it('switches accent, theme mode, and background from settings', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Open dashboard settings' }))
    const settings = screen.getByRole('dialog', { name: 'Settings' })

    await user.click(within(settings).getByRole('button', { name: 'Violet accent' }))
    expect(document.documentElement.dataset.accent).toBe('violet')

    await user.click(within(settings).getByRole('button', { name: 'Dark' }))
    expect(document.documentElement.dataset.mode).toBe('dark')

    await user.click(within(settings).getByRole('button', { name: /^Grid/i }))
    expect(document.documentElement.dataset.bg).toBe('grid')

    await user.click(within(settings).getByRole('button', { name: 'Close settings' }))
    expect(screen.queryByRole('dialog', { name: 'Settings' })).not.toBeInTheDocument()
  })

  it('welcomes first-time users and lets them explore the demo', async () => {
    window.localStorage.removeItem('dash.onboarded.v1')
    const user = userEvent.setup()
    render(<App />)

    const dialog = screen.getByRole('dialog', { name: /welcome to your home/i })
    await user.click(within(dialog).getByRole('button', { name: /explore the demo/i }))

    expect(screen.queryByRole('dialog', { name: /welcome to your home/i })).not.toBeInTheDocument()
    expect(window.localStorage.getItem('dash.onboarded.v1')).toBe('1')
  })

  it('uses the Home Assistant connection automatically in embedded mode', async () => {
    const user = userEvent.setup()
    const themeRoot = document.createElement('div')
    const hass = fakeHass()
    render(<App hass={hass} embedded themeRoot={themeRoot} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Connected through Home Assistant')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Living room lights' })).toBeInTheDocument()
    expect(themeRoot.dataset.mode).toBe('light')
    expect(themeRoot.dataset.accent).toBe('azure')
    expect(window.localStorage.getItem('dash.dashboard.v1')).toContain('light.living_room')

    await user.click(screen.getByRole('button', { name: 'On: Living room lights' }))
    expect(hass.callService).toHaveBeenCalledWith('homeassistant', 'toggle', {
      entity_id: 'light.living_room',
    })

    await user.click(screen.getByRole('button', { name: 'Open dashboard settings' }))
    const settings = screen.getByRole('dialog', { name: 'Settings' })
    expect(within(settings).getByText('Running inside Home Assistant')).toBeInTheDocument()
    expect(within(settings).queryByLabelText('URL')).not.toBeInTheDocument()
    expect(within(settings).queryByLabelText('Long-lived access token')).not.toBeInTheDocument()
  })

  it('renders gauge cards with a progress ring', () => {
    const { container } = render(<App />)

    expect(screen.getByText('Energy today')).toBeInTheDocument()
    expect(container.querySelector('.gauge-ring')).not.toBeNull()
  })

  it('undoes and redoes dashboard card changes', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.click(screen.getByRole('button', { name: 'Remove Living room' }))
    expect(screen.queryByRole('heading', { name: 'Living room' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(screen.getByRole('heading', { name: 'Living room' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Redo' }))
    expect(screen.queryByRole('heading', { name: 'Living room' })).not.toBeInTheDocument()
  })

  it('opens help with guided tasks and shortcuts', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Open help' }))
    const help = screen.getByRole('dialog', { name: 'Help and tips' })
    expect(within(help).getByText('Build a dashboard')).toBeInTheDocument()
    expect(within(help).getByText('Keyboard shortcuts')).toBeInTheDocument()

    await user.click(within(help).getByRole('button', { name: 'Close help' }))
    expect(screen.queryByRole('dialog', { name: 'Help and tips' })).not.toBeInTheDocument()
  })

  it('saves an automation through Home Assistant when embedded', async () => {
    const user = userEvent.setup()
    const hass = fakeHass()
    render(<App hass={hass} embedded />)

    await user.click(screen.getByRole('button', { name: 'Automations' }))
    await screen.findByLabelText('Automation name')
    await user.click(screen.getByRole('button', { name: /save to ha/i }))

    expect(hass.callApi).toHaveBeenCalledTimes(1)
    const [method, path, body] = vi.mocked(hass.callApi!).mock.calls[0]
    expect(method).toBe('POST')
    expect(path).toBe('config/automation/config/demo-motion-lights')
    expect(body).toMatchObject({ alias: 'Hallway lights on motion' })
    expect(await screen.findByText('Saved to Home Assistant.')).toBeInTheDocument()
  })
})
