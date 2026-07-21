import type { Memo } from '../storage/memoStorage'

interface Props {
  memos: Memo[]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString()
}

export default function MemoList({ memos }: Props) {
  if (memos.length === 0) {
    return <p data-testid="empty-state">No memos yet. Create one above!</p>
  }

  return (
    <ul data-testid="memo-list">
      {memos.map((memo) => (
        <li key={memo.id} data-testid="memo-item">
          <span className="memo-title">{memo.title}</span>
          <span className="memo-timestamp">{formatDate(memo.updatedAt)}</span>
        </li>
      ))}
    </ul>
  )
}
