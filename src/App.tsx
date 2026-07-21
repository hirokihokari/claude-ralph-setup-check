import { useState, useEffect } from 'react'
import { listMemos, createMemo, type Memo } from './storage/memoStorage'
import MemoList from './components/MemoList'
import CreateMemoForm from './components/CreateMemoForm'

function App() {
  const [memos, setMemos] = useState<Memo[]>([])

  useEffect(() => {
    setMemos(listMemos())
  }, [])

  function handleCreate(title: string, body: string) {
    createMemo({ title, body })
    setMemos(listMemos())
  }

  return (
    <main>
      <h1>Memo App</h1>
      <CreateMemoForm onCreate={handleCreate} />
      <MemoList memos={memos} />
    </main>
  )
}

export default App
