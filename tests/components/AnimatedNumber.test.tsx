import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import AnimatedNumber from '@/components/ui/AnimatedNumber'

describe('AnimatedNumber', () => {
  beforeEach(() => {
    // Mock requestAnimationFrame to run callbacks synchronously
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(performance.now() + 2000) // Simulate time passed beyond duration
      return 0
    })
  })

  it('renders a span element', () => {
    const { container } = render(<AnimatedNumber value={100} />)
    const span = container.querySelector('span')
    expect(span).toBeTruthy()
  })

  it('applies custom className', () => {
    const { container } = render(
      <AnimatedNumber value={42} className="text-red-500" />
    )
    const span = container.querySelector('span')
    expect(span?.className).toContain('text-red-500')
  })

  it('applies custom style', () => {
    const { container } = render(
      <AnimatedNumber value={42} style={{ color: 'red' }} />
    )
    const span = container.querySelector('span')
    expect(span?.style.color).toBe('red')
  })

  it('uses custom format function', () => {
    const format = (n: number) => `$${n.toFixed(2)}`
    const { container } = render(
      <AnimatedNumber value={0} format={format} />
    )
    const span = container.querySelector('span')
    expect(span?.textContent).toContain('$')
  })

  it('renders without crashing with zero value', () => {
    const { container } = render(<AnimatedNumber value={0} />)
    expect(container.querySelector('span')).toBeTruthy()
  })

  it('renders without crashing with large values', () => {
    const { container } = render(<AnimatedNumber value={1000000000} />)
    expect(container.querySelector('span')).toBeTruthy()
  })

  it('renders without crashing with negative values', () => {
    const { container } = render(<AnimatedNumber value={-50} />)
    expect(container.querySelector('span')).toBeTruthy()
  })
})
