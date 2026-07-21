import { useState } from 'react'

const TITLE_MAX = 100
const BODY_MAX = 5000

interface Props {
  onCreate: (title: string, body: string) => void
}

export default function CreateMemoForm({ onCreate }: Props) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({})

  function validate(): boolean {
    const next: typeof errors = {}
    if (!title.trim()) next.title = 'Title is required.'
    else if (title.length > TITLE_MAX) next.title = `Title must be at most ${TITLE_MAX} characters.`
    if (body.length > BODY_MAX) next.body = `Body must be at most ${BODY_MAX} characters.`
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    onCreate(title.trim(), body)
    setTitle('')
    setBody('')
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} data-testid="create-form">
      <div>
        <label htmlFor="memo-title">Title</label>
        <input
          id="memo-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={TITLE_MAX}
          data-testid="title-input"
        />
        {errors.title && <span role="alert" data-testid="title-error">{errors.title}</span>}
      </div>
      <div>
        <label htmlFor="memo-body">Body</label>
        <textarea
          id="memo-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={BODY_MAX}
          data-testid="body-input"
        />
        {errors.body && <span role="alert" data-testid="body-error">{errors.body}</span>}
      </div>
      <button type="submit">Create Memo</button>
    </form>
  )
}
