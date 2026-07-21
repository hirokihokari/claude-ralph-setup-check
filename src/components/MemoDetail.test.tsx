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

  it('renders an edit button', () => {
    render(<MemoDetail memo={makeMemo()} onBack={() => {}} onSave={() => {}} />)
    expect(screen.getByTestId('edit-button')).toBeDefined()
  })

  it('switches to edit mode when edit button is clicked', async () => {
    render(<MemoDetail memo={makeMemo()} onBack={() => {}} onSave={() => {}} />)
    await userEvent.click(screen.getByTestId('edit-button'))
    expect(screen.getByTestId('edit-title')).toBeDefined()
    expect(screen.getByTestId('edit-body')).toBeDefined()
  })

  it('pre-fills edit fields with current memo values', async () => {
    const memo = makeMemo({ title: 'My Title', body: 'My Body' })
    render(<MemoDetail memo={memo} onBack={() => {}} onSave={() => {}} />)
    await userEvent.click(screen.getByTestId('edit-button'))
    expect((screen.getByTestId('edit-title') as HTMLInputElement).value).toBe('My Title')
    expect((screen.getByTestId('edit-body') as HTMLTextAreaElement).value).toBe('My Body')
  })

  it('calls onSave with updated values when save is clicked', async () => {
    const onSave = vi.fn()
    const memo = makeMemo({ id: 'abc', title: 'Old', body: 'Old body' })
    render(<MemoDetail memo={memo} onBack={() => {}} onSave={onSave} />)
    await userEvent.click(screen.getByTestId('edit-button'))
    await userEvent.clear(screen.getByTestId('edit-title'))
    await userEvent.type(screen.getByTestId('edit-title'), 'New Title')
    await userEvent.clear(screen.getByTestId('edit-body'))
    await userEvent.type(screen.getByTestId('edit-body'), 'New body text')
    await userEvent.click(screen.getByTestId('save-button'))
    expect(onSave).toHaveBeenCalledWith('abc', 'New Title', 'New body text')
  })

  it('returns to view mode when cancel is clicked', async () => {
    render(<MemoDetail memo={makeMemo()} onBack={() => {}} onSave={() => {}} />)
    await userEvent.click(screen.getByTestId('edit-button'))
    await userEvent.click(screen.getByTestId('cancel-button'))
    expect(screen.queryByTestId('edit-title')).toBeNull()
    expect(screen.getByTestId('edit-button')).toBeDefined()
  })

  it('does not render edit button when onSave is not provided', () => {
    render(<MemoDetail memo={makeMemo()} onBack={() => {}} />)
    expect(screen.queryByTestId('edit-button')).toBeNull()
  })
})
