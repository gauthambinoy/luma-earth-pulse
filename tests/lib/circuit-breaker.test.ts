import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCircuitBreaker, getAllMetrics } from '@/lib/circuit-breaker'

// Helper: create a uniquely-named breaker per test to avoid shared state
let counter = 0
function freshBreaker(config?: { failureThreshold?: number; resetTimeout?: number; halfOpenRequests?: number }) {
  const name = `test-breaker-${counter++}`
  return getCircuitBreaker(name, {
    failureThreshold: config?.failureThreshold ?? 3,
    resetTimeout: config?.resetTimeout ?? 100,
    halfOpenRequests: config?.halfOpenRequests ?? 1,
  })
}

describe('CircuitBreaker', () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  it('initial state is CLOSED', () => {
    const cb = freshBreaker()
    expect(cb.getMetrics().state).toBe('closed')
  })

  it('executes a successful call and stays CLOSED', async () => {
    const cb = freshBreaker()
    const result = await cb.execute(async () => 42)
    expect(result).toBe(42)
    expect(cb.getMetrics().state).toBe('closed')
  })

  it('tracks success count correctly', async () => {
    const cb = freshBreaker()
    await cb.execute(async () => 1)
    await cb.execute(async () => 2)
    expect(cb.getMetrics().successes).toBe(2)
  })

  it('tracks failure count correctly', async () => {
    const cb = freshBreaker({ failureThreshold: 10 })
    for (let i = 0; i < 3; i++) {
      await cb.execute(async () => { throw new Error('fail') }, () => null)
    }
    expect(cb.getMetrics().failures).toBe(3)
  })

  it('opens after reaching failure threshold', async () => {
    const cb = freshBreaker({ failureThreshold: 3 })
    for (let i = 0; i < 3; i++) {
      await cb.execute(async () => { throw new Error('fail') }, () => null)
    }
    expect(cb.getMetrics().state).toBe('open')
  })

  it('throws when circuit is OPEN and no fallback provided', async () => {
    const cb = freshBreaker({ failureThreshold: 2 })
    for (let i = 0; i < 2; i++) {
      await cb.execute(async () => { throw new Error('fail') }, () => null)
    }
    await expect(cb.execute(async () => 'ok')).rejects.toThrow(/OPEN/)
  })

  it('uses fallback when circuit is OPEN', async () => {
    const cb = freshBreaker({ failureThreshold: 2 })
    for (let i = 0; i < 2; i++) {
      await cb.execute(async () => { throw new Error('fail') }, () => null)
    }
    const result = await cb.execute(async () => 'ok', () => 'fallback')
    expect(result).toBe('fallback')
  })

  it('transitions to HALF_OPEN after resetTimeout elapses', async () => {
    vi.useFakeTimers()
    const cb = freshBreaker({ failureThreshold: 2, resetTimeout: 500 })

    for (let i = 0; i < 2; i++) {
      await cb.execute(async () => { throw new Error('fail') }, () => null)
    }
    expect(cb.getMetrics().state).toBe('open')

    vi.advanceTimersByTime(600)

    // The next execute call checks the timeout and transitions to half_open
    await cb.execute(async () => 'test', () => null)
    // After success in half_open, with halfOpenRequests=1, it should close
    expect(cb.getMetrics().state).toBe('closed')

    vi.useRealTimers()
  })

  it('resets to CLOSED on success in HALF_OPEN state', async () => {
    vi.useFakeTimers()
    const cb = freshBreaker({ failureThreshold: 2, resetTimeout: 100, halfOpenRequests: 1 })

    for (let i = 0; i < 2; i++) {
      await cb.execute(async () => { throw new Error('fail') }, () => null)
    }

    vi.advanceTimersByTime(200)

    await cb.execute(async () => 'success')
    expect(cb.getMetrics().state).toBe('closed')
    expect(cb.getMetrics().failures).toBe(0)

    vi.useRealTimers()
  })

  it('tracks totalRequests correctly', async () => {
    const cb = freshBreaker()
    await cb.execute(async () => 1)
    await cb.execute(async () => 2)
    await cb.execute(async () => { throw new Error('x') }, () => null)
    expect(cb.getMetrics().totalRequests).toBe(3)
  })

  it('calculates errorRate as percentage', async () => {
    const cb = freshBreaker({ failureThreshold: 10 })
    await cb.execute(async () => 1)
    await cb.execute(async () => { throw new Error('x') }, () => null)
    // 1 error out of 2 total = 50%
    expect(cb.getMetrics().errorRate).toBe(50)
  })

  it('resets failure count to 0 after a success in CLOSED state', async () => {
    const cb = freshBreaker({ failureThreshold: 5 })
    await cb.execute(async () => { throw new Error('x') }, () => null)
    await cb.execute(async () => { throw new Error('x') }, () => null)
    expect(cb.getMetrics().failures).toBe(2)
    await cb.execute(async () => 'ok')
    expect(cb.getMetrics().failures).toBe(0)
  })

  it('getAllMetrics returns metrics for all registered breakers', async () => {
    const cb = freshBreaker()
    await cb.execute(async () => 1)
    const all = getAllMetrics()
    expect(all.some((m) => m.name === cb.name)).toBe(true)
  })

  it('records lastResponseMs after execution', async () => {
    const cb = freshBreaker()
    await cb.execute(async () => 'ok')
    expect(cb.getMetrics().lastResponseMs).toBeTypeOf('number')
    expect(cb.getMetrics().lastResponseMs).toBeGreaterThanOrEqual(0)
  })
})
