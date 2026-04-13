import { describe, it, expect } from 'vitest'
import {
  COLORS,
  TABS,
  CITIES,
  WEATHER_ICONS,
  weatherLabel,
  weatherIcon,
  BASE_POPULATION,
  BASE_TIMESTAMP,
  GROWTH_PER_SECOND,
  FOREX_CURRENCIES,
  ECONOMY_COUNTRIES,
  type TabId,
} from '@/lib/constants'

describe('constants', () => {
  describe('COLORS', () => {
    it('has at least 8 colors', () => {
      expect(COLORS.length).toBeGreaterThanOrEqual(8)
    })

    it('all colors are valid hex strings', () => {
      for (const color of COLORS) {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      }
    })
  })

  describe('TABS', () => {
    it('has 16 tabs', () => {
      expect(TABS.length).toBe(16)
    })

    it('each tab has id, icon, label', () => {
      for (const tab of TABS) {
        expect(tab.id).toBeTruthy()
        expect(tab.icon).toBeTruthy()
        expect(tab.label).toBeTruthy()
      }
    })

    it('tab IDs are unique', () => {
      const ids = TABS.map((t) => t.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('first tab is overview', () => {
      expect(TABS[0].id).toBe('overview')
    })

    it('includes energy tab', () => {
      expect(TABS.some((t) => t.id === 'energy')).toBe(true)
    })
  })

  describe('CITIES', () => {
    it('has 8 cities', () => {
      expect(CITIES.length).toBe(8)
    })

    it('each city has name, lat, lon, flag', () => {
      for (const city of CITIES) {
        expect(city.name).toBeTruthy()
        expect(typeof city.lat).toBe('number')
        expect(typeof city.lon).toBe('number')
        expect(city.flag).toBeTruthy()
      }
    })

    it('latitudes are within valid range', () => {
      for (const city of CITIES) {
        expect(city.lat).toBeGreaterThanOrEqual(-90)
        expect(city.lat).toBeLessThanOrEqual(90)
      }
    })

    it('longitudes are within valid range', () => {
      for (const city of CITIES) {
        expect(city.lon).toBeGreaterThanOrEqual(-180)
        expect(city.lon).toBeLessThanOrEqual(180)
      }
    })
  })

  describe('weatherLabel', () => {
    it('returns correct labels', () => {
      expect(weatherLabel(0)).toBe('Clear sky')
      expect(weatherLabel(1)).toBe('Partly cloudy')
      expect(weatherLabel(3)).toBe('Overcast')
      expect(weatherLabel(45)).toBe('Foggy')
      expect(weatherLabel(55)).toBe('Rainy')
      expect(weatherLabel(73)).toBe('Snow')
      expect(weatherLabel(81)).toBe('Showers')
      expect(weatherLabel(95)).toBe('Stormy')
    })
  })

  describe('weatherIcon', () => {
    it('returns correct icon for known codes', () => {
      expect(weatherIcon(0)).toBe('☀️')
      expect(weatherIcon(3)).toBe('☁️')
      expect(weatherIcon(95)).toBe('⛈')
    })

    it('returns fallback for unknown code', () => {
      expect(weatherIcon(999)).toBe('🌡')
    })
  })

  describe('Population constants', () => {
    it('BASE_POPULATION is a large number', () => {
      expect(BASE_POPULATION).toBeGreaterThan(8_000_000_000)
    })

    it('GROWTH_PER_SECOND is positive', () => {
      expect(GROWTH_PER_SECOND).toBeGreaterThan(0)
    })

    it('BASE_TIMESTAMP is in the past', () => {
      expect(BASE_TIMESTAMP).toBeLessThan(Date.now())
    })
  })

  describe('FOREX_CURRENCIES', () => {
    it('has 10 currencies', () => {
      expect(FOREX_CURRENCIES.length).toBe(10)
    })

    it('includes EUR, GBP, JPY', () => {
      expect(FOREX_CURRENCIES).toContain('EUR')
      expect(FOREX_CURRENCIES).toContain('GBP')
      expect(FOREX_CURRENCIES).toContain('JPY')
    })
  })

  describe('ECONOMY_COUNTRIES', () => {
    it('has 10 countries', () => {
      expect(ECONOMY_COUNTRIES.length).toBe(10)
    })

    it('each has code and name', () => {
      for (const c of ECONOMY_COUNTRIES) {
        expect(c.code).toBeTruthy()
        expect(c.name).toBeTruthy()
        expect(c.code.length).toBe(3)
      }
    })

    it('includes USA and China', () => {
      expect(ECONOMY_COUNTRIES.some((c) => c.code === 'USA')).toBe(true)
      expect(ECONOMY_COUNTRIES.some((c) => c.code === 'CHN')).toBe(true)
    })
  })
})
