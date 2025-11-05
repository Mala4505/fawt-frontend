import React from 'react';
import { Trash2 } from 'lucide-react';
import { Entry } from '../types';

interface EntryListProps {
  entries: Entry[];
  onDelete: (id: string | number) => void;
}

export default function EntryList({ entries, onDelete }: EntryListProps) {
  const grouped = entries.reduce((acc: Record<string, Entry[]>, entry) => {
    if (!acc[entry.bookName]) acc[entry.bookName] = [];
    acc[entry.bookName].push(entry);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([bookName, bookEntries]) => {
        const totalPages = bookEntries.reduce(
          (sum, entry) => sum + (entry.toPage - entry.fromPage + 1),
          0
        );

        return (
          <div key={bookName} className="border-b border-slate-200 pb-4">
            <div className="mb-3">
              <h3 className="text-md font-semibold text-slate-800">{bookName}</h3>
              <p className="text-sm text-slate-500">
                Total pages revised: <span className="font-medium text-slate-700">{totalPages}</span>
              </p>
            </div>

            <div className="space-y-2">
              {bookEntries
                .sort((a, b) => a.fromPage - b.fromPage)
                .map(entry => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div>
                      <p className="font-medium text-slate-800">
                        Pages {entry.fromPage} – {entry.toPage}
                      </p>
                      <p className="text-sm text-slate-500">{entry.studentName}</p>
                    </div>
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
