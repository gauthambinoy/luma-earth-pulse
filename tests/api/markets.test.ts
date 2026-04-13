import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock global fetch before importing the route handler
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

import { GET } from '@/app/api/markets/route'

function makeCoinData(overrides = {}) {
  return {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://example.com/btc.png',
    current_price: 50000,
    market_cap: 1000000000000,
    market_cap_rank: 1,
    total_volume: 30000000000,
    price_change_percentage_24h: 2.5,
    sparkline_in_7d: { price: [49000, 50000, 51000] },
    ...overrides,
  }
}

describe('GET /api/markets', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('returns coins and trending when both APIs succeed', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('coins/markets')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => [makeCoinData(), makeCoinData({ id: 'ethereum', symbol: 'eth', name: 'Ethereum' })],
        })
      }
      if (url.includes('search/trending')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ coins: [{ item: { id: 'pepe', name: 'Pepe' } }] }),
        })
      }
      return Promise.resolve({ ok: false, status: 404 })
    })

    const response = await GET()
    const data = await response.json()

    expect(data).toHaveProperty('coins')
    expect(data).toHaveProperty('trending')
    expect(Array.isArray(data.coins)).toBe(true)
    expect(data.coins.length).toBe(2)
    expect(data.coins[0].id).toBe('bitcoin')
  })

  it('validates coin data through Zod schema', async () => {
    // Invalid data missing required fields
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('coins/markets')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => [{ invalid: true }],
        })
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ coins: [] }),
      })
    })

    const response = await GET()
    const data = await response.json()

    // Should return empty array on validation failure, not crash
    expect(data.coins).toEqual([])
  })

  it('returns empty coins when market API fails', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('coins/markets')) {
        return Promise.resolve({
          ok: false,
          status: 429,
          json: async () => ({ error: 'rate limited' }),
        })
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ coins: [] }),
      })
    })

    const response = await GET()
    const data = await response.json()

    expect(data.coins).toEqual([])
  })

  it('handles network errors gracefully with fallback', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    const response = await GET()
    const data = await response.json()

    // Circuit breaker catches the error and returns fallback empty arrays
    expect(data.coins).toEqual([])
    expect(data.trending).toEqual([])
  })

  it('coin data has correct shape after validation', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('coins/markets')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => [makeCoinData()],
        })
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ coins: [] }),
      })
    })

    const response = await GET()
    const data = await response.json()

    const coin = data.coins[0]
    expect(coin).toHaveProperty('id')
    expect(coin).toHaveProperty('symbol')
    expect(coin).toHaveProperty('name')
    expect(coin).toHaveProperty('current_price')
    expect(coin).toHaveProperty('market_cap')
    expect(typeof coin.current_price).toBe('number')
  })

  it('returns empty trending when trending API fails', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('coins/markets')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => [makeCoinData()],
        })
      }
      return Promise.resolve({
        ok: false,
        status: 500,
        json: async () => ({}),
      })
    })

    const response = await GET()
    const data = await response.json()

    expect(data.coins.length).toBe(1)
    expect(data.trending).toEqual([])
  })
})
