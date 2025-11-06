import { Book } from '../types/index'
import { BookRow } from './BookRow'
interface BookTableProps {
  books: Book[]
  onEdit: (book: Book) => void
  onDelete: (id: number) => void
}
export function BookTable({ books, onEdit, onDelete }: BookTableProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-sm">
          No books added yet. Add your first book using the form above.
        </p>
      </div>
    )
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
              Book Name
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <BookRow
              key={book.id}
              book={book}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
