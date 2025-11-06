import { useEffect, useState } from 'react'
import { Book } from '../types/index'

interface BookFormProps {
  onSubmit: (name: string) => void
  editingBook: Book | null
  onUpdate: (id: number, name: string) => void
  onCancelEdit: () => void
}
export function BookForm({
  onSubmit,
  editingBook,
  onUpdate,
  onCancelEdit,
}: BookFormProps) {
  const [bookName, setBookName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    if (editingBook) {
      setBookName(editingBook.name)
    } else {
      setBookName('')
    }
  }, [editingBook])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookName.trim()) {
      setError('Book name is required')
      return
    }
    setIsLoading(true)
    setError('')
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (editingBook) {
      onUpdate(editingBook.id, bookName.trim())
    } else {
      onSubmit(bookName.trim())
    }
    setBookName('')
    setIsLoading(false)
  }
  const handleCancel = () => {
    setBookName('')
    setError('')
    onCancelEdit()
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="bookName"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Book Name
        </label>
        <input
          type="text"
          id="bookName"
          value={bookName}
          onChange={(e) => {
            setBookName(e.target.value)
            setError('')
          }}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          placeholder="Enter book name"
          disabled={isLoading}
        />
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading
            ? 'Processing...'
            : editingBook
              ? 'Update Book'
              : 'Add Book'}
        </button>
        {editingBook && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
