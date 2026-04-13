import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

import { POST } from '@/app/api/ai-query/route'

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/ai-query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/ai-query', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('validates input — rejects empty query', async () => {
    const response = await POST(makeRequest({ query: '' }))
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })

  it('validates input — rejects missing query field', async () => {
    const response = await POST(makeRequest({}))
    const data = await response.json()

    expect(response.status).toBe(400)
  })

  it('validates input — rejects query longer than 500 chars', async () => {
    const response = await POST(makeRequest({ query: 'a'.repeat(501) }))
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('too long')
  })

  it('matches bitcoin price pattern', async () => {
    const response = await POST(makeRequest({ query: 'bitcoin price now' }))
    const data = await response.json()

    expect(data.method).toBe('pattern-match')
    expect(data.source).toContain('CoinGecko')
    expect(data.answer).toBeTruthy()
    expect(data.suggestion).toBeTruthy()
  })

  it('matches earthquake pattern', async () => {
    const response = await POST(makeRequest({ query: 'earthquake today' }))
    const data = await response.json()

    expect(data.method).toBe('pattern-match')
    expect(data.source).toContain('USGS')
  })

  it('matches weather pattern', async () => {
    const response = await POST(makeRequest({ query: 'weather in London' }))
    const data = await response.json()

    expect(data.method).toBe('pattern-match')
    expect(data.source).toContain('Open-Meteo')
  })

  it('matches ISS/space station pattern', async () => {
    const response = await POST(makeRequest({ query: 'ISS position' }))
    const data = await response.json()

    expect(data.method).toBe('pattern-match')
    expect(data.source).toContain('Open Notify')
  })

  it('matches GDP/economy pattern', async () => {
    const response = await POST(makeRequest({ query: 'GDP of India' }))
    const data = await response.json()

    expect(data.method).toBe('pattern-match')
    expect(data.source).toContain('World Bank')
  })

  it('matches energy pattern', async () => {
    const response = await POST(makeRequest({ query: 'energy consumption global' }))
    const data = await response.json()

    expect(data.method).toBe('pattern-match')
    expect(data.source).toContain('IEA')
  })

  it('matches country population pattern', async () => {
    const response = await POST(makeRequest({ query: 'top countries by population' }))
    const data = await response.json()

    expect(data.method).toBe('pattern-match')
  })

  it('matches forex/currency pattern', async () => {
    const response = await POST(makeRequest({ query: 'currency exchange rates' }))
    const data = await response.json()

    expect(data.method).toBe('pattern-match')
  })

  it('returns fallback for unmatched queries', async () => {
    const response = await POST(makeRequest({ query: 'something random' }))
    const data = await response.json()

    expect(data.method).toBe('fallback')
    expect(data.answer).toContain('Try asking about')
  })

  it('trims whitespace from query', async () => {
    const response = await POST(makeRequest({ query: '  bitcoin price  ' }))
    const data = await response.json()

    expect(data.method).toBe('pattern-match')
  })

  it('handles invalid JSON gracefully', async () => {
    const request = new Request('http://localhost/api/ai-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toHaveProperty('error')
  })
})
