import { describe, it, expect } from 'vitest'
import { LIVE_STATS, computeLiveValue, STAT_CATEGORIES } from '@/lib/live-stats'

describe('LIVE_STATS', () => {
  it('has at least 40 stats', () => {
    expect(LIVE_STATS.length).toBeGreaterThanOrEqual(40)
  })

  it('includes energy stats', () => {
    const energyStats = LIVE_STATS.filter((s) => s.category === 'Energy')
    expect(energyStats.length).toBeGreaterThanOrEqual(8)
  })

  it('includes all expected categories', () => {
    const expectedCategories = [
      'Demographics', 'Health', 'Environment', 'Energy',
      'Economy', 'Technology', 'Food & Water', 'Education',
      'Transport', 'Society',
    ]
    expectedCategories.forEach((cat) => {
      expect(LIVE_STATS.some((s) => s.category === cat)).toBe(true)
    })
  })

  it('all stats have required fields', () => {
    LIVE_STATS.forEach((stat) => {
      expect(stat.id).toBeTruthy()
      expect(stat.label).toBeTruthy()
      expect(stat.category).toBeTruthy()
      expect(stat.icon).toBeTruthy()
      expect(stat.source).toBeTruthy()
      expect(stat.color).toBeTruthy()
      expect(['up', 'down', 'neutral']).toContain(stat.direction)
    })
  })

  it('all stat IDs are unique', () => {
    const ids = LIVE_STATS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('computeLiveValue', () => {
  it('returns baseValue for neutral stats (perSecond = 0)', () => {
    const stat = LIVE_STATS.find((s) => s.direction === 'neutral')!
    expect(stat).toBeTruthy()
    const value = computeLiveValue(stat)
    expect(value).toBe(stat.baseValue)
  })

  it('returns a positive number for "Today" stats', () => {
    const stat = LIVE_STATS.find((s) => s.label.includes('Today') && s.perSecond > 0)!
    expect(stat).toBeTruthy()
    const value = computeLiveValue(stat)
    expect(value).toBeGreaterThan(0)
  })

  it('returns a positive number for "Year" stats', () => {
    const stat = LIVE_STATS.find((s) => s.label.includes('Year') && s.perSecond > 0)!
    expect(stat).toBeTruthy()
    const value = computeLiveValue(stat)
    expect(value).toBeGreaterThan(0)
  })

  it('returns increasing values over time for up-direction stats', () => {
    const stat = LIVE_STATS.find((s) => s.direction === 'up' && !s.label.includes('Today') && !s.label.includes('Year'))!
    if (stat) {
      const value = computeLiveValue(stat)
      expect(value).toBeGreaterThanOrEqual(stat.baseValue)
    }
  })
})

describe('STAT_CATEGORIES', () => {
  it('contains all unique categories from LIVE_STATS', () => {
    const expected = [...new Set(LIVE_STATS.map((s) => s.category))]
    expect(STAT_CATEGORIES).toEqual(expected)
  })

  it('has at least 10 categories', () => {
    expect(STAT_CATEGORIES.length).toBeGreaterThanOrEqual(10)
  })
})
