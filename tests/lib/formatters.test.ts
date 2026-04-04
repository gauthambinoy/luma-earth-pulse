import { describe, it, expect } from 'vitest'
import { fmt, fmtUsd, fmtDate, fmtTemp, magColor, aqiColor } from '@/lib/formatters'

describe('fmt (number formatter)', () => {
  it('returns — for null', () => {
    expect(fmt(null)).toBe('—')
  })

  it('returns — for undefined', () => {
    expect(fmt(undefined)).toBe('—')
  })

  it('formats zero as localeString', () => {
    expect(fmt(0)).toBe('0')
  })

  it('formats numbers below 1000 as localeString', () => {
    expect(fmt(999)).toBe('999')
    expect(fmt(42)).toBe('42')
  })

  it('formats thousands with K suffix', () => {
    expect(fmt(1000)).toBe('1.0K')
    expect(fmt(1500)).toBe('1.5K')
    expect(fmt(999999)).toBe('1000.0K')
  })

  it('formats millions with M suffix', () => {
    expect(fmt(1_000_000)).toBe('1.0M')
    expect(fmt(2_500_000)).toBe('2.5M')
  })

  it('formats billions with B suffix', () => {
    expect(fmt(1_000_000_000)).toBe('1.0B')
    expect(fmt(8_000_000_000)).toBe('8.0B')
  })

  it('formats trillions with T suffix (2 decimal places)', () => {
    expect(fmt(1_000_000_000_000)).toBe('1.00T')
    expect(fmt(2_500_000_000_000)).toBe('2.50T')
  })
})

describe('fmtUsd (currency formatter)', () => {
  it('returns — for null', () => {
    expect(fmtUsd(null)).toBe('—')
  })

  it('returns — for undefined', () => {
    expect(fmtUsd(undefined)).toBe('—')
  })

  it('formats zero with dollar sign', () => {
    expect(fmtUsd(0)).toBe('$0')
  })

  it('formats small amounts with dollar sign and localeString', () => {
    expect(fmtUsd(500)).toBe('$500')
    expect(fmtUsd(999)).toBe('$999')
  })

  it('formats thousands with $K suffix', () => {
    expect(fmtUsd(1000)).toBe('$1.0K')
    expect(fmtUsd(50000)).toBe('$50.0K')
  })

  it('formats millions with $M suffix', () => {
    expect(fmtUsd(1_000_000)).toBe('$1.0M')
  })

  it('formats billions with $B suffix', () => {
    expect(fmtUsd(1_000_000_000)).toBe('$1.0B')
  })

  it('formats trillions with $T suffix', () => {
    expect(fmtUsd(1_000_000_000_000)).toBe('$1.00T')
    expect(fmtUsd(25_000_000_000_000)).toBe('$25.00T')
  })
})

describe('fmtDate (relative time formatter)', () => {
  it('returns "just now" for timestamps under 60 seconds ago', () => {
    expect(fmtDate(Date.now() - 5000)).toBe('just now')
    expect(fmtDate(Date.now() - 59000)).toBe('just now')
  })

  it('returns minutes ago for timestamps under 1 hour', () => {
    expect(fmtDate(Date.now() - 2 * 60 * 1000)).toBe('2m ago')
    expect(fmtDate(Date.now() - 45 * 60 * 1000)).toBe('45m ago')
  })

  it('returns hours ago for timestamps under 24 hours', () => {
    expect(fmtDate(Date.now() - 3 * 60 * 60 * 1000)).toBe('3h ago')
    expect(fmtDate(Date.now() - 23 * 60 * 60 * 1000)).toBe('23h ago')
  })

  it('returns days ago for timestamps under 30 days', () => {
    expect(fmtDate(Date.now() - 5 * 24 * 60 * 60 * 1000)).toBe('5d ago')
  })

  it('returns months ago for timestamps over 30 days', () => {
    expect(fmtDate(Date.now() - 60 * 24 * 60 * 60 * 1000)).toBe('2mo ago')
  })

  it('accepts ISO string input', () => {
    const ts = new Date(Date.now() - 5000).toISOString()
    expect(fmtDate(ts)).toBe('just now')
  })
})

describe('fmtTemp (temperature formatter)', () => {
  it('rounds and appends °C', () => {
    expect(fmtTemp(20)).toBe('20°C')
    expect(fmtTemp(20.6)).toBe('21°C')
    expect(fmtTemp(-5.3)).toBe('-5°C')
  })
})

describe('magColor (magnitude color)', () => {
  it('returns red for magnitude >= 7', () => {
    expect(magColor(7)).toBe('#B91C1C')
    expect(magColor(8.5)).toBe('#B91C1C')
  })

  it('returns appropriate colors for lower magnitudes', () => {
    expect(magColor(6)).toBe('#EF4444')
    expect(magColor(5)).toBe('#F87171')
    expect(magColor(4)).toBe('#FB923C')
    expect(magColor(3)).toBe('#FCD34D')
    expect(magColor(1)).toBe('#6EE7B7')
  })
})

describe('aqiColor (AQI color/label)', () => {
  it('returns Good for AQI <= 50', () => {
    const result = aqiColor(25)
    expect(result.label).toBe('Good')
    expect(result.color).toBe('#6EE7B7')
  })

  it('returns Moderate for AQI <= 100', () => {
    const result = aqiColor(75)
    expect(result.label).toBe('Moderate')
  })

  it('returns Unhealthy (Sensitive) for AQI <= 150', () => {
    const result = aqiColor(120)
    expect(result.label).toBe('Unhealthy (Sensitive)')
  })

  it('returns Unhealthy for AQI <= 200', () => {
    const result = aqiColor(175)
    expect(result.label).toBe('Unhealthy')
  })

  it('returns Very Unhealthy for AQI <= 300', () => {
    const result = aqiColor(250)
    expect(result.label).toBe('Very Unhealthy')
  })

  it('returns Hazardous for AQI > 300', () => {
    const result = aqiColor(400)
    expect(result.label).toBe('Hazardous')
    expect(result.color).toBe('#B91C1C')
  })
})
