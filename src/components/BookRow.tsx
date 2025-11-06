import { Pencil, Trash2 } from 'lucide-react';
import { Book } from '../types/index';

interface BookRowProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
}

export function BookRow({ book, onEdit, onDelete }: BookRowProps) {
  const handleDelete = () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${book.name}"?`);
    if (confirmDelete) {
      onDelete(book.id);
    }
  };

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="py-3 px-4 text-sm text-slate-800">{book.name}</td>
      <td className="py-3 px-4">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(book)}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit book"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete book"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
