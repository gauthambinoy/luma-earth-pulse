import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LiveBadge from '@/components/ui/LiveBadge'

describe('LiveBadge', () => {
  it('renders the LIVE label', () => {
    render(<LiveBadge />)
    expect(screen.getByText('LIVE')).toBeInTheDocument()
  })

  it('renders with the expected container structure', () => {
    const { container } = render(<LiveBadge />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toBeTruthy()
    expect(wrapper.tagName).toBe('DIV')
  })

  it('contains an animated dot element', () => {
    const { container } = render(<LiveBadge />)
    // The animated dot is a span with animate-blink class
    const dot = container.querySelector('.animate-blink')
    expect(dot).toBeTruthy()
  })

  it('renders consistently (snapshot)', () => {
    const { container } = render(<LiveBadge />)
    expect(container.innerHTML).toMatchSnapshot()
  })
})
