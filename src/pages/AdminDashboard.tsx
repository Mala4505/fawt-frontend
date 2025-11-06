import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Download, Users, BookOpen } from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Entry } from "../types/index";
import { BookForm } from '../components/BookForm';
import { BookTable } from '../components/BookTable';
import { Book } from '../types/index';


export default function AdminDashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [groupData, setGroupData] = useState<{ groups: any[]; pending: any[] }>({ groups: [], pending: [] });
  const [filterBook, setFilterBook] = useState<string>('all');
  const [filterStudent, setFilterStudent] = useState<string>('all');
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    axios.get('/api/entries/').then(res => {
      const mapped = res.data.map((e: any) => ({
        id: e.id,
        studentTr: e.user.tr_number,
        studentName: e.user.name,
        bookName: e.book.name,
        fromPage: e.from_page,
        toPage: e.to_page
      }));
      setEntries(mapped);
    });

    axios.get('/api/group-list/').then(res => {
      setGroupData(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get('/api/books/').then(res => {
      setBooks(res.data);
    });
  }, []);

  const handleAddBook = async (name: string) => {
    try {
      const res = await axios.post('/api/books/', { name });
      setBooks(prev => [...prev, res.data]);
    } catch {
      console.error('Failed to add book');
    }
  };

  const handleUpdateBook = async (id: number, name: string) => {
    try {
      await axios.put(`/api/books/${id}/`, { name });
      setBooks(prev => prev.map(book => (book.id === id ? { ...book, name } : book)));
      setEditingBook(null);
    } catch {
      console.error('Failed to update book');
    }
  };

  const handleDeleteBook = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this book?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/books/${id}/`);
      setBooks(prev => prev.filter(book => book.id !== id));
    } catch {
      console.error('Failed to delete book');
    }
  };

  const cancelEdit = () => setEditingBook(null);

  const students = Array.from(new Set(entries.map(e => e.studentTr)));

  const filteredEntries = entries.filter(entry => {
    if (filterBook !== 'all' && entry.bookName !== filterBook) return false;
    if (filterStudent !== 'all' && entry.studentTr !== filterStudent) return false;
    return true;
  });

  function formatPageRanges(pages: number[]): string {
    if (!pages.length) return '';
    const sorted = [...new Set(pages)].sort((a, b) => a - b);
    const ranges: string[] = [];

    let start = sorted[0];
    let end = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === end + 1) {
        end = sorted[i];
      } else {
        ranges.push(start === end ? `${start}` : `${start}–${end}`);
        start = end = sorted[i];
      }
    }

    ranges.push(start === end ? `${start}` : `${start}–${end}`);
    return ranges.join(', ');
  }

  const exportEntries = () => {
    const data = filteredEntries.map(e => ({
      'Student TR': e.studentTr,
      'Student Name': e.studentName,
      Book: e.bookName,
      'From Page': e.fromPage,
      'To Page': e.toPage
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Entries');
    XLSX.writeFile(wb, 'student_entries.xlsx');
  };

  const exportGroups = () => {
    const data = groupData.groups.flatMap(group =>
      group.members.map((name: string) => ({
        Book: group.book,
        'Student Name': name,
        'Shared Pages': formatPageRanges(group.sharedPages)
      }))
    );
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Groups');
    XLSX.writeFile(wb, 'student_groups.xlsx');
  };

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">Admin Dashboard</h1>
          <div className="flex space-x-3">
            <button onClick={exportEntries} className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition">
              <Download className="w-4 h-4" />
              <span>Export Entries</span>
            </button>
            <button onClick={exportGroups} className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition">
              <Download className="w-4 h-4" />
              <span>Export Groups</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Book</label>
            <select value={filterBook} onChange={e => setFilterBook(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none">
              <option value="all">All Books</option>
              {books.map(book => (
                <option key={book.id} value={book.name}>{book.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Student</label>
            <select value={filterStudent} onChange={e => setFilterStudent(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none">
              <option value="all">All Students</option>
              {students.map(student => (
                <option key={student} value={student}>{student}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-5 h-5 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-800">All Entries</h2>
              <span className="text-sm text-slate-500">({filteredEntries.length})</span>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredEntries.map(entry => (
                <div key={entry.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-slate-800">{entry.studentName}</p>
                      <p className="text-sm text-slate-500">{entry.studentTr}</p>
                    </div>
                    <span className="px-2 py-1 bg-white text-slate-600 text-xs rounded border border-slate-200">{entry.bookName}</span>
                  </div>
                  <p className="text-sm text-slate-600">Pages {entry.fromPage} - {entry.toPage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* <div className="max-w-4xl mx-auto py-8"> */}
          <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h1 className="text-2xl font-bold mb-6">Manage Books</h1>
            <BookForm
              onSubmit={handleAddBook}
              editingBook={editingBook}
              onUpdate={handleUpdateBook}
              onCancelEdit={cancelEdit}
            />
            <div className="mt-6">
              <BookTable
                books={books}
                onEdit={setEditingBook}
                onDelete={handleDeleteBook}
              />
            </div>
          </div>
          {/* </div> */}

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-5 h-5 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-800">Auto-Generated Groups</h2>
              <span className="text-sm text-slate-500">({groupData.groups.length})</span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {groupData.groups.map((group, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-slate-800">Shared Pages</h3>
                    <span className="px-2 py-1 bg-white text-slate-600 text-xs rounded border border-slate-200">{group.book}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    Pages: {formatPageRanges(group.sharedPages)}
                  </p>
                  <p className="text-xs text-slate-500 mb-1">Members:</p>
                  <div className="space-y-1">
                    {group.members.map((name: string, i: number) => (
                      <p key={i} className="text-sm text-slate-600">{name}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Uncomment if you want to show pending students */}
            {/* {groupData.pending.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-red-700 mb-2">Pending Students</h3>
                <div className="space-y-2">
                  {groupData.pending.map((p, idx) => (
                    <div key={idx} className="text-sm text-red-600">
                      {p.name} – {p.book} (unmatched pages: {formatPageRanges(p.unmatchedPages)})
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
