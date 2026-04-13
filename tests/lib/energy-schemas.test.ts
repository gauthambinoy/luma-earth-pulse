import { describe, it, expect } from 'vitest'
import {
  EnergyCountrySchema,
  EnergySourceSchema,
  EnergyResponseSchema,
} from '@/lib/schemas'

describe('EnergyCountrySchema', () => {
  const validCountry = {
    code: 'USA',
    name: 'United States',
    flag: '🇺🇸',
    annualTWh: 4050,
    consumedTWh: 1200.5,
    perCapitaMWh: 12.13,
    mwhPerSecond: 128.4,
    mix: { fossil: 60, nuclear: 18, renewable: 22 },
    population: 334000000,
  }

  it('accepts valid country data', () => {
    const result = EnergyCountrySchema.safeParse(validCountry)
    expect(result.success).toBe(true)
  })

  it('applies defaults for optional numeric fields', () => {
    const data = {
      code: 'CHN',
      name: 'China',
      flag: '🇨🇳',
      annualTWh: 8637,
      mix: {},
    }
    const result = EnergyCountrySchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.consumedTWh).toBe(0)
      expect(result.data.perCapitaMWh).toBe(0)
      expect(result.data.mix.fossil).toBe(0)
      expect(result.data.mix.renewable).toBe(0)
    }
  })

  it('rejects missing required code', () => {
    const { code: _code, ...withoutCode } = validCountry
    const result = EnergyCountrySchema.safeParse(withoutCode)
    expect(result.success).toBe(false)
  })

  it('rejects missing required name', () => {
    const { name: _name, ...withoutName } = validCountry
    const result = EnergyCountrySchema.safeParse(withoutName)
    expect(result.success).toBe(false)
  })
})

describe('EnergySourceSchema', () => {
  const validSource = {
    name: 'Coal',
    share: 0.355,
    annualTWh: 10354,
    color: '#57534e',
    icon: '🪨',
  }

  it('accepts valid source data', () => {
    const result = EnergySourceSchema.safeParse(validSource)
    expect(result.success).toBe(true)
  })

  it('rejects missing required name', () => {
    const { name: _name, ...withoutName } = validSource
    const result = EnergySourceSchema.safeParse(withoutName)
    expect(result.success).toBe(false)
  })

  it('rejects non-number share', () => {
    const data = { ...validSource, share: 'high' }
    const result = EnergySourceSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})

describe('EnergyResponseSchema', () => {
  const validResponse = {
    global: {
      totalAnnualTWh: 29165,
      consumedTWh: 8750.5,
      mwhPerSecond: 924147.0,
      renewableShare: 30,
      fossilShare: 60.7,
      nuclearShare: 9.3,
    },
    countries: [
      {
        code: 'CHN',
        name: 'China',
        flag: '🇨🇳',
        annualTWh: 8637,
        consumedTWh: 2500,
        perCapitaMWh: 6.12,
        mwhPerSecond: 273.8,
        mix: { fossil: 61, nuclear: 5, renewable: 34 },
        population: 1412000000,
      },
    ],
    sources: [
      {
        name: 'Coal',
        share: 0.355,
        annualTWh: 10354,
        color: '#57534e',
        icon: '🪨',
      },
    ],
    timestamp: Date.now(),
  }

  it('accepts valid full response', () => {
    const result = EnergyResponseSchema.safeParse(validResponse)
    expect(result.success).toBe(true)
  })

  it('defaults countries and sources to empty arrays', () => {
    const data = {
      global: {
        totalAnnualTWh: 29165,
      },
      timestamp: Date.now(),
    }
    const result = EnergyResponseSchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.countries).toEqual([])
      expect(result.data.sources).toEqual([])
      expect(result.data.global.consumedTWh).toBe(0)
      expect(result.data.global.renewableShare).toBe(0)
    }
  })

  it('rejects missing timestamp', () => {
    const { timestamp: _ts, ...withoutTs } = validResponse
    const result = EnergyResponseSchema.safeParse(withoutTs)
    expect(result.success).toBe(false)
  })

  it('rejects missing global totalAnnualTWh', () => {
    const data = {
      global: {},
      timestamp: Date.now(),
    }
    const result = EnergyResponseSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})
