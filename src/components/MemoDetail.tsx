import type { Memo } from '../storage/memoStorage'

interface Props {
  memo: Memo
  onBack: () => void
}

export default function MemoDetail({ memo, onBack }: Props) {
  return (
    <div data-testid="memo-detail">
      <button data-testid="back-button" onClick={onBack}>← Back</button>
      <h2>{memo.title}</h2>
      <p>{memo.body}</p>
    </div>
  )
}
