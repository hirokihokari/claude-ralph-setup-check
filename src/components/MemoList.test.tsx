import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MemoList from './MemoList'
import type { Memo } from '../storage/memoStorage'

function makeMemo(overrides: Partial<Memo> = {}): Memo {
  return {
    id: '1',
    title: 'Test Memo',
    body: 'body text',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('MemoList', () => {
  it('shows empty state when no memos', () => {
    render(<MemoList memos={[]} />)
    expect(screen.getByTestId('empty-state')).toBeDefined()
  })

  it('does not show the memo list when empty', () => {
    render(<MemoList memos={[]} />)
    expect(screen.queryByTestId('memo-list')).toBeNull()
  })

  it('renders a memo item for each memo', () => {
    const memos = [makeMemo({ id: '1', title: 'First' }), makeMemo({ id: '2', title: 'Second' })]
    render(<MemoList memos={memos} />)
    const items = screen.getAllByTestId('memo-item')
    expect(items).toHaveLength(2)
  })

  it('displays memo title', () => {
    render(<MemoList memos={[makeMemo({ title: 'My Memo' })]} />)
    expect(screen.getByText('My Memo')).toBeDefined()
  })

  it('displays memo updatedAt timestamp', () => {
    const updatedAt = '2026-06-15T12:30:00.000Z'
    render(<MemoList memos={[makeMemo({ updatedAt })]} />)
    const formatted = new Date(updatedAt).toLocaleString()
    expect(screen.getByText(formatted)).toBeDefined()
  })

  it('does not show empty state when memos exist', () => {
    render(<MemoList memos={[makeMemo()]} />)
    expect(screen.queryByTestId('empty-state')).toBeNull()
  })
})
