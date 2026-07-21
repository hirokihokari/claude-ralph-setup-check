import { useState, useEffect } from 'react'
import { listMemos, createMemo, getMemo, type Memo } from './storage/memoStorage'
import MemoList from './components/MemoList'
import CreateMemoForm from './components/CreateMemoForm'
import MemoDetail from './components/MemoDetail'

function App() {
  const [memos, setMemos] = useState<Memo[]>([])
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null)

  useEffect(() => {
    setMemos(listMemos())
  }, [])

  function handleCreate(title: string, body: string) {
    createMemo({ title, body })
    setMemos(listMemos())
  }

  function handleSelect(id: string) {
    const memo = getMemo(id)
    if (memo) setSelectedMemo(memo)
  }

  function handleBack() {
    setSelectedMemo(null)
  }

  if (selectedMemo) {
    return (
      <main>
        <h1>Memo App</h1>
        <MemoDetail memo={selectedMemo} onBack={handleBack} />
      </main>
    )
  }

  return (
    <main>
      <h1>Memo App</h1>
      <CreateMemoForm onCreate={handleCreate} />
      <MemoList memos={memos} onSelect={handleSelect} />
    </main>
  )
}

export default App
