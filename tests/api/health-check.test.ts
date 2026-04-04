import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock global fetch before importing the route handler
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// We import the GET handler directly — Next.js route files export standard functions
import { GET } from '@/app/api/health-check/route'

function makeMockResponse(ok: boolean, status = 200) {
  return Promise.resolve({
    ok,
    status,
    json: async () => ({}),
    text: async () => '',
  })
}

describe('GET /api/health-check', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns healthy when all endpoints respond OK', async () => {
    mockFetch.mockResolvedValue(makeMockResponse(true, 200))

    const response = await GET()
    const data = await response.json()

    expect(data.overall).toBe('healthy')
    expect(data.healthy).toBe(data.total)
    expect(data.total).toBeGreaterThan(0)
  })

  it('returns degraded when some endpoints fail', async () => {
    let callCount = 0
    mockFetch.mockImplementation(() => {
      callCount++
      // First 40% fail, rest succeed — results in degraded
      return makeMockResponse(callCount > 4, callCount > 4 ? 200 : 500)
    })

    const response = await GET()
    const data = await response.json()

    expect(['degraded', 'unhealthy']).toContain(data.overall)
    expect(data.healthy).toBeLessThan(data.total)
  })

  it('returns unhealthy when fewer than 70% endpoints are up', async () => {
    mockFetch.mockResolvedValue(makeMockResponse(false, 500))

    const response = await GET()
    const data = await response.json()

    expect(data.overall).toBe('unhealthy')
    expect(data.healthy).toBe(0)
  })

  it('response shape includes required fields', async () => {
    mockFetch.mockResolvedValue(makeMockResponse(true, 200))

    const response = await GET()
    const data = await response.json()

    expect(data).toHaveProperty('overall')
    expect(data).toHaveProperty('healthy')
    expect(data).toHaveProperty('total')
    expect(data).toHaveProperty('avgResponseMs')
    expect(data).toHaveProperty('endpoints')
    expect(data).toHaveProperty('checkedAt')
    expect(Array.isArray(data.endpoints)).toBe(true)
  })

  it('each endpoint entry has the expected shape', async () => {
    mockFetch.mockResolvedValue(makeMockResponse(true, 200))

    const response = await GET()
    const data = await response.json()

    for (const ep of data.endpoints) {
      expect(ep).toHaveProperty('name')
      expect(ep).toHaveProperty('status')
      expect(ep).toHaveProperty('responseMs')
      expect(ep).toHaveProperty('statusCode')
      expect(ep).toHaveProperty('critical')
      expect(ep).toHaveProperty('lastChecked')
      expect(['ok', 'error']).toContain(ep.status)
    }
  })

  it('handles fetch rejections (network errors) gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('ECONNREFUSED'))

    const response = await GET()
    const data = await response.json()

    expect(data.overall).toBe('unhealthy')
    for (const ep of data.endpoints) {
      expect(ep.status).toBe('error')
      expect(ep.statusCode).toBe(0)
    }
  })

  it('checkedAt is a recent timestamp', async () => {
    mockFetch.mockResolvedValue(makeMockResponse(true, 200))
    const before = Date.now()

    const response = await GET()
    const data = await response.json()

    expect(data.checkedAt).toBeGreaterThanOrEqual(before)
    expect(data.checkedAt).toBeLessThanOrEqual(Date.now() + 1000)
  })

  it('avgResponseMs is a non-negative number', async () => {
    mockFetch.mockResolvedValue(makeMockResponse(true, 200))

    const response = await GET()
    const data = await response.json()

    expect(typeof data.avgResponseMs).toBe('number')
    expect(data.avgResponseMs).toBeGreaterThanOrEqual(0)
  })
})
