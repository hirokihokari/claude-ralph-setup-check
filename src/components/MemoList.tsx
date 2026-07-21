import type { Memo } from '../storage/memoStorage'

interface Props {
  memos: Memo[]
  onSelect: (id: string) => void
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString()
}

export default function MemoList({ memos, onSelect }: Props) {
  if (memos.length === 0) {
    return <p data-testid="empty-state">No memos yet. Create one above!</p>
  }

  return (
    <ul data-testid="memo-list">
      {memos.map((memo) => (
        <li key={memo.id} data-testid="memo-item" onClick={() => onSelect(memo.id)} style={{ cursor: 'pointer' }}>
          <span className="memo-title">{memo.title}</span>
          <span className="memo-timestamp">{formatDate(memo.updatedAt)}</span>
        </li>
      ))}
    </ul>
  )
}
