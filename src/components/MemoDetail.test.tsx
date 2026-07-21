import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MemoDetail from './MemoDetail'
import type { Memo } from '../storage/memoStorage'

function makeMemo(overrides: Partial<Memo> = {}): Memo {
  return {
    id: '1',
    title: 'Test Title',
    body: 'Test body content here',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('MemoDetail', () => {
  it('renders the memo title', () => {
    render(<MemoDetail memo={makeMemo({ title: 'My Important Memo' })} onBack={() => {}} />)
    expect(screen.getByText('My Important Memo')).toBeDefined()
  })

  it('renders the memo body', () => {
    render(<MemoDetail memo={makeMemo({ body: 'Full body content' })} onBack={() => {}} />)
    expect(screen.getByText('Full body content')).toBeDefined()
  })

  it('renders a back button', () => {
    render(<MemoDetail memo={makeMemo()} onBack={() => {}} />)
    expect(screen.getByTestId('back-button')).toBeDefined()
  })

  it('calls onBack when back button is clicked', async () => {
    const onBack = vi.fn()
    render(<MemoDetail memo={makeMemo()} onBack={onBack} />)
    await userEvent.click(screen.getByTestId('back-button'))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('renders empty body without error', () => {
    render(<MemoDetail memo={makeMemo({ body: '' })} onBack={() => {}} />)
    expect(screen.getByTestId('memo-detail')).toBeDefined()
  })
})
