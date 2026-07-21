import { useState } from 'react'
import type { Memo } from '../storage/memoStorage'

interface Props {
  memo: Memo
  onBack: () => void
  onSave?: (id: string, title: string, body: string) => void
}

export default function MemoDetail({ memo, onBack, onSave }: Props) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(memo.title)
  const [editBody, setEditBody] = useState(memo.body)

  function handleEdit() {
    setEditTitle(memo.title)
    setEditBody(memo.body)
    setEditing(true)
  }

  function handleSave() {
    onSave?.(memo.id, editTitle, editBody)
    setEditing(false)
  }

  function handleCancel() {
    setEditing(false)
  }

  if (editing) {
    return (
      <div data-testid="memo-detail">
        <button data-testid="back-button" onClick={onBack}>← Back</button>
        <input
          data-testid="edit-title"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          maxLength={100}
        />
        <textarea
          data-testid="edit-body"
          value={editBody}
          onChange={(e) => setEditBody(e.target.value)}
          maxLength={5000}
        />
        <button data-testid="save-button" onClick={handleSave}>Save</button>
        <button data-testid="cancel-button" onClick={handleCancel}>Cancel</button>
      </div>
    )
  }

  return (
    <div data-testid="memo-detail">
      <button data-testid="back-button" onClick={onBack}>← Back</button>
      {onSave && (
        <button data-testid="edit-button" onClick={handleEdit}>Edit</button>
      )}
      <h2>{memo.title}</h2>
      <p>{memo.body}</p>
    </div>
  )
}
