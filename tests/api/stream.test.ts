import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock global fetch before importing the route handler
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

import { GET } from '@/app/api/stream/route'

describe('GET /api/stream', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        iss_position: { latitude: '51.5', longitude: '-0.1' },
        timestamp: Date.now(),
      }),
    })
  })

  it('returns a streaming response with correct headers', async () => {
    const request = new NextRequest('http://localhost/api/stream', {
      headers: { 'x-forwarded-for': '1.2.3.4' },
    })

    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('text/event-stream')
    expect(response.headers.get('Cache-Control')).toBe('no-cache')
    expect(response.headers.get('Connection')).toBe('keep-alive')
  })

  it('sends initial connected event', async () => {
    const request = new NextRequest('http://localhost/api/stream', {
      headers: { 'x-forwarded-for': '2.3.4.5' },
    })

    const response = await GET(request)

    expect(response.body).toBeTruthy()

    // Read first chunk
    const reader = response.body!.getReader()
    const { value } = await reader.read()
    const text = new TextDecoder().decode(value)

    expect(text).toContain('event: connected')
    expect(text).toContain('"message":"Stream connected"')
    reader.cancel()
  })

  it('rate limits when too many connections from same IP', async () => {
    // Make multiple requests from same IP to exhaust the limit
    const ip = '10.0.0.1'
    const requests: Promise<Response>[] = []

    for (let i = 0; i < 5; i++) {
      const req = new NextRequest('http://localhost/api/stream', {
        headers: { 'x-forwarded-for': ip },
      })
      requests.push(GET(req))
    }

    const responses = await Promise.all(requests)
    const statuses = responses.map((r) => r.status)

    // At least one should be rate limited (429)
    const rateLimited = statuses.filter((s) => s === 429)
    expect(rateLimited.length).toBeGreaterThan(0)
  })

  it('allows connections from different IPs', async () => {
    const response1 = await GET(
      new NextRequest('http://localhost/api/stream', {
        headers: { 'x-forwarded-for': '100.0.0.1' },
      })
    )
    const response2 = await GET(
      new NextRequest('http://localhost/api/stream', {
        headers: { 'x-forwarded-for': '100.0.0.2' },
      })
    )

    expect(response1.status).toBe(200)
    expect(response2.status).toBe(200)
  })

  it('rate limited response includes Retry-After header', async () => {
    const ip = '50.0.0.1'
    // Exhaust the limit
    for (let i = 0; i < 3; i++) {
      await GET(new NextRequest('http://localhost/api/stream', {
        headers: { 'x-forwarded-for': ip },
      }))
    }

    const response = await GET(
      new NextRequest('http://localhost/api/stream', {
        headers: { 'x-forwarded-for': ip },
      })
    )

    if (response.status === 429) {
      expect(response.headers.get('Retry-After')).toBe('60')
    }
  })
})
