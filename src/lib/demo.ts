import type { DashboardCard, DashboardConfig, EntityMap, HomeAssistantEntity } from '../types'
import { createId } from './id'

function entity(
  entityId: string,
  state: string,
  attributes: HomeAssistantEntity['attributes'] = {},
): HomeAssistantEntity {
  return {
    entity_id: entityId,
    state,
    attributes,
    last_changed: new Date().toISOString(),
  }
}

export const demoEntities: EntityMap = {
  'light.living_room': entity('light.living_room', 'on', {
    friendly_name: 'Living room lights',
    brightness: 190,
  }),
  'light.kitchen': entity('light.kitchen', 'off', { friendly_name: 'Kitchen lights' }),
  'climate.thermostat': entity('climate.thermostat', 'heat', {
    friendly_name: 'Thermostat',
    current_temperature: 21.5,
    temperature: 22,
  }),
  'sensor.living_room_temperature': entity('sensor.living_room_temperature', '21.5', {
    friendly_name: 'Living room temperature',
    unit_of_measurement: '°C',
  }),
  'sensor.energy_today': entity('sensor.energy_today', '6.4', {
    friendly_name: 'Energy today',
    unit_of_measurement: 'kWh',
    min: 0,
    max: 20,
  }),
  'sensor.humidity': entity('sensor.humidity', '43', {
    friendly_name: 'Humidity',
    unit_of_measurement: '%',
    min: 0,
    max: 100,
  }),
  'media_player.living_room_tv': entity('media_player.living_room_tv', 'playing', {
    friendly_name: 'Living room TV',
    media_title: 'The Bear',
  }),
  'lock.front_door': entity('lock.front_door', 'locked', { friendly_name: 'Front door' }),
  'cover.garage_door': entity('cover.garage_door', 'closed', { friendly_name: 'Garage door' }),
  'scene.movie_night': entity('scene.movie_night', '2026-10-19T20:00:00+00:00', {
    friendly_name: 'Movie night',
  }),
  'script.good_morning': entity('script.good_morning', 'off', { friendly_name: 'Good morning' }),
  'fan.bedroom': entity('fan.bedroom', 'on', { friendly_name: 'Bedroom fan', percentage: 40 }),
  'weather.home': entity('weather.home', 'sunny', {
    friendly_name: 'Home weather',
    temperature: 18,
  }),
  'binary_sensor.hallway_motion': entity('binary_sensor.hallway_motion', 'off', {
    friendly_name: 'Hallway motion',
  }),
}

export function createDefaultConfig(): DashboardConfig {
  return {
    version: 1,
    title: 'My home',
    subtitle: 'A calm, simple dashboard that stays out of your way.',
    theme: { mode: 'system', accent: 'azure' },
    background: 'aurora',
    cards: [
      {
        id: 'living-room',
        type: 'entity',
        title: 'Living room',
        entityId: 'light.living_room',
        width: 'normal',
      },
      {
        id: 'temperature',
        type: 'sensor',
        title: 'Temperature',
        entityId: 'sensor.living_room_temperature',
        width: 'normal',
      },
      {
        id: 'thermostat',
        type: 'entity',
        title: 'Thermostat',
        entityId: 'climate.thermostat',
        width: 'normal',
      },
      {
        id: 'energy',
        type: 'gauge',
        title: 'Energy today',
        entityId: 'sensor.energy_today',
        width: 'normal',
      },
      {
        id: 'movie-night',
        type: 'action',
        title: 'Movie night',
        entityId: 'scene.movie_night',
        width: 'normal',
      },
      {
        id: 'welcome',
        type: 'note',
        title: 'Welcome home',
        content:
          'Drag any card to reorder it. Try the accent colours and dark mode in settings. Everything is saved in this browser.',
        width: 'normal',
      },
      {
        id: 'quick-controls',
        type: 'group',
        title: 'Quick controls',
        width: 'wide',
        columns: 2,
        children: [
          {
            id: 'kitchen-light',
            type: 'entity',
            title: 'Kitchen',
            entityId: 'light.kitchen',
            width: 'normal',
          },
          {
            id: 'humidity',
            type: 'sensor',
            title: 'Humidity',
            entityId: 'sensor.humidity',
            width: 'normal',
          },
        ],
      },
    ],
  }
}

export function cloneDefaultConfig(): DashboardConfig {
  return JSON.parse(JSON.stringify(createDefaultConfig())) as DashboardConfig
}

const STARTER_DOMAINS = [
  'light',
  'climate',
  'switch',
  'fan',
  'cover',
  'lock',
  'media_player',
  'scene',
  'script',
  'sensor',
  'binary_sensor',
  'weather',
]

function starterCard(entity: HomeAssistantEntity): DashboardCard {
  const domain = entity.entity_id.split('.')[0]
  let type: DashboardCard['type'] = 'entity'
  if (domain === 'scene' || domain === 'script') type = 'action'
  else if (domain === 'sensor') {
    const hasRange =
      typeof entity.attributes.min === 'number' &&
      typeof entity.attributes.max === 'number'
    type = hasRange ? 'gauge' : 'sensor'
  }

  return {
    id: createId('card'),
    type,
    title: '',
    entityId: entity.entity_id,
    width: 'normal',
  }
}

export function createStarterConfig(entities: EntityMap): DashboardConfig {
  const ranked = Object.values(entities)
    .filter((entity) => entity.state !== 'unavailable' && entity.state !== 'unknown')
    .sort((left, right) => {
      const leftDomain = left.entity_id.split('.')[0]
      const rightDomain = right.entity_id.split('.')[0]
      const leftRank = STARTER_DOMAINS.indexOf(leftDomain)
      const rightRank = STARTER_DOMAINS.indexOf(rightDomain)
      const rank = (leftRank < 0 ? 99 : leftRank) - (rightRank < 0 ? 99 : rightRank)
      if (rank !== 0) return rank
      return String(left.attributes.friendly_name ?? left.entity_id).localeCompare(
        String(right.attributes.friendly_name ?? right.entity_id),
      )
    })
    .slice(0, 8)

  const cards = ranked.map(starterCard)

  return {
    version: 1,
    title: 'My home',
    subtitle: 'Your home at a glance.',
    theme: { mode: 'system', accent: 'azure' },
    background: 'aurora',
    cards:
      cards.length > 0
        ? cards
        : [
            {
              id: createId('card'),
              type: 'note',
              title: 'Welcome to Dash',
              content:
                'Open Edit and add your first card. Your Home Assistant entities will appear in the picker.',
              width: 'wide',
            },
          ],
  }
}
