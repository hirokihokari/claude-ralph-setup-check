import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CreateMemoForm from './CreateMemoForm'

function getForm() {
  return screen.getByTestId('create-form')
}

describe('CreateMemoForm', () => {
  it('renders title and body inputs', () => {
    render(<CreateMemoForm onCreate={vi.fn()} />)
    expect(screen.getByTestId('title-input')).toBeDefined()
    expect(screen.getByTestId('body-input')).toBeDefined()
  })

  it('shows title required error when submitted empty', () => {
    render(<CreateMemoForm onCreate={vi.fn()} />)
    fireEvent.submit(getForm())
    expect(screen.getByTestId('title-error')).toBeDefined()
  })

  it('does not call onCreate when title is empty', () => {
    const onCreate = vi.fn()
    render(<CreateMemoForm onCreate={onCreate} />)
    fireEvent.submit(getForm())
    expect(onCreate).not.toHaveBeenCalled()
  })

  it('calls onCreate with trimmed title and body on valid submit', () => {
    const onCreate = vi.fn()
    render(<CreateMemoForm onCreate={onCreate} />)
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: '  Hello  ' } })
    fireEvent.change(screen.getByTestId('body-input'), { target: { value: 'World' } })
    fireEvent.submit(getForm())
    expect(onCreate).toHaveBeenCalledWith('Hello', 'World')
  })

  it('clears form after successful submit', () => {
    render(<CreateMemoForm onCreate={vi.fn()} />)
    const titleInput = screen.getByTestId('title-input') as HTMLInputElement
    fireEvent.change(titleInput, { target: { value: 'Test' } })
    fireEvent.submit(getForm())
    expect(titleInput.value).toBe('')
  })

  it('shows title error when title exceeds 100 chars', () => {
    render(<CreateMemoForm onCreate={vi.fn()} />)
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'a'.repeat(101) } })
    fireEvent.submit(getForm())
    expect(screen.getByTestId('title-error')).toBeDefined()
  })

  it('shows body error when body exceeds 5000 chars', () => {
    render(<CreateMemoForm onCreate={vi.fn()} />)
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Title' } })
    fireEvent.change(screen.getByTestId('body-input'), { target: { value: 'b'.repeat(5001) } })
    fireEvent.submit(getForm())
    expect(screen.getByTestId('body-error')).toBeDefined()
  })

  it('does not show errors on initial render', () => {
    render(<CreateMemoForm onCreate={vi.fn()} />)
    expect(screen.queryByTestId('title-error')).toBeNull()
    expect(screen.queryByTestId('body-error')).toBeNull()
  })

  it('accepts body-only whitespace when title is valid', () => {
    const onCreate = vi.fn()
    render(<CreateMemoForm onCreate={onCreate} />)
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Good Title' } })
    fireEvent.submit(getForm())
    expect(onCreate).toHaveBeenCalledWith('Good Title', '')
  })
})
