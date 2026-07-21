import { v4 as uuidv4 } from 'uuid'

export interface Memo {
  id: string
  title: string
  body: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'memos'

function loadAll(): Memo[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Memo[]
  } catch {
    return []
  }
}

function saveAll(memos: Memo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memos))
}

export function createMemo(input: { title: string; body: string }): Memo {
  const now = new Date().toISOString()
  const memo: Memo = {
    id: uuidv4(),
    title: input.title,
    body: input.body,
    createdAt: now,
    updatedAt: now,
  }
  const memos = loadAll()
  memos.push(memo)
  saveAll(memos)
  return memo
}

export function getMemo(id: string): Memo | null {
  return loadAll().find((m) => m.id === id) ?? null
}

export function listMemos(): Memo[] {
  return loadAll().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export function updateMemo(
  id: string,
  patch: Partial<Pick<Memo, 'title' | 'body'>>
): Memo | null {
  const memos = loadAll()
  const idx = memos.findIndex((m) => m.id === id)
  if (idx === -1) return null
  memos[idx] = {
    ...memos[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  saveAll(memos)
  return memos[idx]
}

export function deleteMemo(id: string): boolean {
  const memos = loadAll()
  const idx = memos.findIndex((m) => m.id === id)
  if (idx === -1) return false
  memos.splice(idx, 1)
  saveAll(memos)
  return true
}
