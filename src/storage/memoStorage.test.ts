import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  createMemo,
  getMemo,
  listMemos,
  updateMemo,
  deleteMemo,
} from './memoStorage'

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('createMemo', () => {
  it('returns a memo with uuid id', () => {
    const memo = createMemo({ title: 'Test', body: 'Hello' })
    expect(memo.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
  })

  it('sets createdAt and updatedAt to the same time', () => {
    const memo = createMemo({ title: 'Test', body: '' })
    expect(memo.createdAt).toBe(memo.updatedAt)
  })

  it('persists the memo to localStorage', () => {
    const memo = createMemo({ title: 'Persist', body: 'body' })
    expect(getMemo(memo.id)).toEqual(memo)
  })
})

describe('getMemo', () => {
  it('returns null for unknown id', () => {
    expect(getMemo('nonexistent')).toBeNull()
  })

  it('returns the correct memo by id', () => {
    const memo = createMemo({ title: 'Hello', body: 'World' })
    expect(getMemo(memo.id)).toEqual(memo)
  })
})

describe('listMemos', () => {
  it('returns empty array when no memos exist', () => {
    expect(listMemos()).toEqual([])
  })

  it('returns all memos ordered by updatedAt descending', () => {
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
    const first = createMemo({ title: 'First', body: '' })
    vi.setSystemTime(new Date('2024-01-01T00:00:01.000Z'))
    const second = createMemo({ title: 'Second', body: '' })
    const list = listMemos()
    expect(list[0].id).toBe(second.id)
    expect(list[1].id).toBe(first.id)
  })

  it('reflects updated order after an update', () => {
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
    const a = createMemo({ title: 'A', body: '' })
    vi.setSystemTime(new Date('2024-01-01T00:00:01.000Z'))
    createMemo({ title: 'B', body: '' })
    vi.setSystemTime(new Date('2024-01-01T00:00:02.000Z'))
    updateMemo(a.id, { title: 'A updated' })
    const list = listMemos()
    expect(list[0].id).toBe(a.id)
  })
})

describe('updateMemo', () => {
  it('updates title and body', () => {
    const memo = createMemo({ title: 'Old', body: 'Old body' })
    const updated = updateMemo(memo.id, { title: 'New', body: 'New body' })
    expect(updated?.title).toBe('New')
    expect(updated?.body).toBe('New body')
  })

  it('sets updatedAt to a new value', () => {
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
    const memo = createMemo({ title: 'X', body: '' })
    const original = memo.updatedAt
    vi.setSystemTime(new Date('2024-01-01T00:00:01.000Z'))
    const updated = updateMemo(memo.id, { title: 'Y' })
    expect(updated?.updatedAt).not.toBe(original)
  })

  it('does not change createdAt', () => {
    const memo = createMemo({ title: 'X', body: '' })
    const updated = updateMemo(memo.id, { title: 'Y' })
    expect(updated?.createdAt).toBe(memo.createdAt)
  })

  it('returns null for unknown id', () => {
    expect(updateMemo('nope', { title: 'X' })).toBeNull()
  })

  it('persists the update across reads', () => {
    const memo = createMemo({ title: 'Old', body: '' })
    updateMemo(memo.id, { title: 'Persisted' })
    expect(getMemo(memo.id)?.title).toBe('Persisted')
  })
})

describe('deleteMemo', () => {
  it('removes the memo from storage', () => {
    const memo = createMemo({ title: 'Delete me', body: '' })
    deleteMemo(memo.id)
    expect(getMemo(memo.id)).toBeNull()
  })

  it('removes the memo from the list', () => {
    const memo = createMemo({ title: 'Gone', body: '' })
    deleteMemo(memo.id)
    expect(listMemos().find((m) => m.id === memo.id)).toBeUndefined()
  })

  it('returns true when deletion succeeds', () => {
    const memo = createMemo({ title: 'X', body: '' })
    expect(deleteMemo(memo.id)).toBe(true)
  })

  it('returns false for unknown id', () => {
    expect(deleteMemo('unknown')).toBe(false)
  })
})
