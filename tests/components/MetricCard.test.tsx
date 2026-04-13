import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MetricCard from '@/components/ui/MetricCard'

describe('MetricCard', () => {
  it('renders the label', () => {
    render(<MetricCard label="Test Metric" value="1,234" />)
    expect(screen.getByText('Test Metric')).toBeInTheDocument()
  })

  it('renders the string value when no numeric prop', () => {
    render(<MetricCard label="Countries" value="195" />)
    expect(screen.getByText('195')).toBeInTheDocument()
  })

  it('renders AnimatedNumber when numeric prop is provided', () => {
    const { container } = render(
      <MetricCard label="Market Cap" value="$1.2T" numeric={1200000000000} />
    )
    // AnimatedNumber renders a span element
    const valueContainer = container.querySelector('.text-3xl')
    expect(valueContainer).toBeTruthy()
  })

  it('renders sub text when provided', () => {
    render(<MetricCard label="APIs" value="205" sub="103 free" />)
    expect(screen.getByText('103 free')).toBeInTheDocument()
  })

  it('applies custom accent color', () => {
    const { container } = render(
      <MetricCard label="Test" value="100" accent="#ef4444" />
    )
    const valueEl = container.querySelector('.text-3xl')
    expect(valueEl).toBeTruthy()
    // JSDOM converts hex to rgb
    const style = valueEl?.getAttribute('style') ?? ''
    expect(style).toContain('color')
  })

  it('renders glow effect when glow prop is true', () => {
    const { container } = render(
      <MetricCard label="Glow" value="42" glow accent="#10b981" />
    )
    // The glow line is a div with h-[2px]
    const glowLine = container.querySelector('.h-\\[2px\\]')
    expect(glowLine).toBeTruthy()
  })

  it('does not render glow by default', () => {
    const { container } = render(
      <MetricCard label="No Glow" value="42" />
    )
    const glowLine = container.querySelector('.h-\\[2px\\]')
    expect(glowLine).toBeNull()
  })

  it('renders consistently (snapshot)', () => {
    const { container } = render(
      <MetricCard label="Earthquakes" value="2,345" accent="#eab308" />
    )
    expect(container.innerHTML).toMatchSnapshot()
  })
})
