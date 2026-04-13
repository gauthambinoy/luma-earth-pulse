import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CommandPalette from '@/components/ui/CommandPalette'

// Mock framer-motion to simplify testing
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => {
      const { initial, animate, exit, transition, layout, ...rest } = props as Record<string, unknown>
      return <div {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>
    },
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('CommandPalette', () => {
  const mockOnSelectTab = vi.fn()

  beforeEach(() => {
    mockOnSelectTab.mockReset()
  })

  it('opens when ⌘K is pressed', async () => {
    render(<CommandPalette onSelectTab={mockOnSelectTab} currentTab="overview" />)

    // Initially palette should not be visible
    expect(screen.queryByPlaceholderText('Jump to tab...')).toBeNull()

    // Press Cmd+K
    fireEvent.keyDown(window, { key: 'k', metaKey: true })

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Jump to tab...')).toBeTruthy()
    })
  })

  it('closes when Escape is pressed', async () => {
    render(<CommandPalette onSelectTab={mockOnSelectTab} currentTab="overview" />)

    // Open
    fireEvent.keyDown(window, { key: 'k', metaKey: true })
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Jump to tab...')).toBeTruthy()
    })

    // Close
    fireEvent.keyDown(window, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Jump to tab...')).toBeNull()
    })
  })

  it('shows all tabs when no query is entered', async () => {
    render(<CommandPalette onSelectTab={mockOnSelectTab} currentTab="overview" />)

    fireEvent.keyDown(window, { key: 'k', metaKey: true })

    await waitFor(() => {
      // Should show the Overview tab at minimum
      expect(screen.getByText('Overview')).toBeTruthy()
      expect(screen.getByText('Weather')).toBeTruthy()
      expect(screen.getByText('Markets')).toBeTruthy()
    })
  })

  it('filters tabs by query', async () => {
    const user = userEvent.setup()
    render(<CommandPalette onSelectTab={mockOnSelectTab} currentTab="overview" />)

    fireEvent.keyDown(window, { key: 'k', metaKey: true })

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Jump to tab...')).toBeTruthy()
    })

    // Type a query
    const input = screen.getByPlaceholderText('Jump to tab...')
    await user.type(input, 'weath')

    // Wait for debounce
    await waitFor(() => {
      expect(screen.getByText('Weather')).toBeTruthy()
    }, { timeout: 500 })
  })

  it('selects tab on click', async () => {
    render(<CommandPalette onSelectTab={mockOnSelectTab} currentTab="overview" />)

    fireEvent.keyDown(window, { key: 'k', metaKey: true })

    await waitFor(() => {
      expect(screen.getByText('Weather')).toBeTruthy()
    })

    fireEvent.click(screen.getByText('Weather'))

    expect(mockOnSelectTab).toHaveBeenCalledWith('weather')
  })

  it('marks current tab as active', async () => {
    render(<CommandPalette onSelectTab={mockOnSelectTab} currentTab="markets" />)

    fireEvent.keyDown(window, { key: 'k', metaKey: true })

    await waitFor(() => {
      expect(screen.getByText('active')).toBeTruthy()
    })
  })

  it('supports keyboard navigation with Enter', async () => {
    render(<CommandPalette onSelectTab={mockOnSelectTab} currentTab="overview" />)

    fireEvent.keyDown(window, { key: 'k', metaKey: true })

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Jump to tab...')).toBeTruthy()
    })

    const input = screen.getByPlaceholderText('Jump to tab...')

    // Press Down arrow then Enter
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })

    // Should have selected second tab (Weather)
    expect(mockOnSelectTab).toHaveBeenCalled()
  })

  it('shows "no tabs match" when query has no results', async () => {
    const user = userEvent.setup()
    render(<CommandPalette onSelectTab={mockOnSelectTab} currentTab="overview" />)

    fireEvent.keyDown(window, { key: 'k', metaKey: true })

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Jump to tab...')).toBeTruthy()
    })

    const input = screen.getByPlaceholderText('Jump to tab...')
    await user.type(input, 'xyznonexistent')

    await waitFor(() => {
      expect(screen.getByText(/No tabs match/)).toBeTruthy()
    }, { timeout: 500 })
  })
})
