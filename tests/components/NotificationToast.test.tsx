import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { NotificationProvider, useNotifications } from '@/components/ui/NotificationToast'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => {
      const { initial, animate, exit, transition, layout, ...rest } = props as Record<string, unknown>
      return <div {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>
    },
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

function TestConsumer() {
  const { addNotification, notifications, clearAll } = useNotifications()
  return (
    <div>
      <button onClick={() => addNotification({ type: 'info', title: 'Test Info', message: 'Info message' })}>
        Add Info
      </button>
      <button onClick={() => addNotification({ type: 'alert', title: 'Test Alert', message: 'Alert message', icon: '🚨' })}>
        Add Alert
      </button>
      <button onClick={() => addNotification({ type: 'success', title: 'Persistent', message: 'Stays forever', duration: 0 })}>
        Add Persistent
      </button>
      <button onClick={() => clearAll()}>Clear All</button>
      <div data-testid="count">{notifications.length}</div>
    </div>
  )
}

describe('NotificationToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders provider without crashing', () => {
    render(
      <NotificationProvider>
        <div>child</div>
      </NotificationProvider>
    )
    expect(screen.getByText('child')).toBeTruthy()
  })

  it('adds and displays a notification', async () => {
    render(
      <NotificationProvider>
        <TestConsumer />
      </NotificationProvider>
    )

    act(() => {
      screen.getByText('Add Info').click()
    })

    expect(screen.getByText('Test Info')).toBeTruthy()
    expect(screen.getByText('Info message')).toBeTruthy()
  })

  it('shows custom icon for alert notifications', async () => {
    render(
      <NotificationProvider>
        <TestConsumer />
      </NotificationProvider>
    )

    act(() => {
      screen.getByText('Add Alert').click()
    })

    expect(screen.getByText('Test Alert')).toBeTruthy()
    expect(screen.getByText('🚨')).toBeTruthy()
  })

  it('auto-dismisses notifications after duration', async () => {
    render(
      <NotificationProvider>
        <TestConsumer />
      </NotificationProvider>
    )

    act(() => {
      screen.getByText('Add Info').click()
    })

    expect(screen.getByTestId('count').textContent).toBe('1')

    // Fast-forward past the 5s default duration
    act(() => {
      vi.advanceTimersByTime(6000)
    })

    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('does NOT auto-dismiss when duration is 0', async () => {
    render(
      <NotificationProvider>
        <TestConsumer />
      </NotificationProvider>
    )

    act(() => {
      screen.getByText('Add Persistent').click()
    })

    expect(screen.getByTestId('count').textContent).toBe('1')

    act(() => {
      vi.advanceTimersByTime(60000)
    })

    // Should still be there
    expect(screen.getByTestId('count').textContent).toBe('1')
  })

  it('clears all notifications', async () => {
    render(
      <NotificationProvider>
        <TestConsumer />
      </NotificationProvider>
    )

    act(() => {
      screen.getByText('Add Info').click()
      screen.getByText('Add Alert').click()
    })

    expect(screen.getByTestId('count').textContent).toBe('2')

    act(() => {
      screen.getByText('Clear All').click()
    })

    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('limits to max 5 notifications', async () => {
    render(
      <NotificationProvider>
        <TestConsumer />
      </NotificationProvider>
    )

    act(() => {
      for (let i = 0; i < 8; i++) {
        screen.getByText('Add Info').click()
      }
    })

    // Should keep max 5 (latest 4 + the new one)
    const count = parseInt(screen.getByTestId('count').textContent || '0', 10)
    expect(count).toBeLessThanOrEqual(5)
  })
})
