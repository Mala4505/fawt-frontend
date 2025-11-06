import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from "../components/LoadingSpinner";
import PageRangeForm from '../components/PageRangeForm';
import EntryList from '../components/EntryList';
import { useAuth } from '../context/AuthContext';
import { Entry, Group } from "../types/index";
import axios from 'axios';
import { toast } from 'react-hot-toast';


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

export default function StudentDashboard() {
  const { user } = useAuth();

  const [books, setBooks] = useState<{ id: string; name: string }[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [myPending, setMyPending] = useState<{ book: string; pendingPages: number[] }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEntries = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`/api/entries/?user=${user.id}`);
      const mapped = res.data.map((e: any) => ({
        id: Number(e.id),
        studentTr: e.user.tr_number,
        studentName: e.user.name,
        bookName: e.book.name,
        fromPage: e.from_page,
        toPage: e.to_page
      }));
      setEntries(mapped);
    } catch {
      toast.error("Failed to fetch entries");
    }
  };

  const fetchGroupData = async () => {
    try {
      const res = await axios.get('/api/group-list/');
      const allGroups = res.data.groups || [];
      const allPending = res.data.pending || [];

      const filteredGroups = allGroups.filter((g: Group) =>
        g.members.includes(user?.name)
      );

      const filteredPending = allPending
        .filter((p: any) => p.name === user?.name)
        .map((p: any) => ({
          book: p.book,
          pendingPages: p.unmatchedPages
        }));

      setMyGroups(filteredGroups);
      setMyPending(filteredPending);
    } catch {
      toast.error("Failed to fetch group data");
    }
  };

  useEffect(() => {
    axios.get('/api/books/').then(res => {
      setBooks(res.data);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchEntries();
    fetchGroupData();
  }, [user]);

  const handleAddEntry = async (entry: {
    bookId: string;
    bookName: string;
    fromPage: number;
    toPage: number;
  }) => {
    if (!user) return;

    try {
      setLoading(true);
      await axios.post('/api/entries/', {
        user_id: user.id,
        book_id: entry.bookId,
        from_page: entry.fromPage,
        to_page: entry.toPage,
        revised: false
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      toast.success("Entry added successfully");
      await fetchEntries();
      await fetchGroupData();
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message;
      toast.error(`Failed to add entry: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (id: string | number) => {
    try {
      setLoading(true);
      await axios.delete(`/api/entries/${id}/`);
      toast.success("Entry deleted");
      await fetchEntries();
      await fetchGroupData();
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message;
      toast.error(`Failed to delete entry: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedBookObj = books.find(b => String(b.id) === String(selectedBookId));

  const bookEntries = useMemo(() => {
    const filtered = selectedBookObj
      ? entries.filter(e => e.bookName === selectedBookObj.name)
      : entries;

    return filtered.sort((a, b) => a.fromPage - b.fromPage);
  }, [entries, selectedBookObj]);

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Book</label>
          <select
            value={selectedBookId}
            onChange={e => setSelectedBookId(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none"
          >
            <option value="">Select Book</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>{book.name}</option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Add Page Range</h2>
              {user && selectedBookObj ? (
                <PageRangeForm
                  userId={user.id}
                  bookId={selectedBookObj.id}
                  bookName={selectedBookObj.name}
                  entries={bookEntries}
                  onAdd={handleAddEntry}
                />
              ) : (
                <p className="text-sm text-slate-500">Please select a book to add entries.</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">My Entries</h2>
              <EntryList entries={bookEntries} onDelete={handleDeleteEntry} />
            </div>
          </div>

          <div className="space-y-6">
            {myGroups.map((group, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-slate-900 truncate">{group.book}</h3>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Group</span>

                </div>
                <p className="text-sm text-slate-600 mb-1">
                  Pages: <span className="font-medium text-slate-700">{formatPageRanges(group.sharedPages)}</span>
                </p>
                <div className="mt-2">
                  <p className="text-xs text-slate-500 mb-1">Members:</p>
                  <div className="flex flex-wrap gap-2">
                    {group.members.map((name, i) => (
                      <span key={i} className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            ))}


            {myPending.length > 0 && (
              <div className="bg-red border border-red-300 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-red-600">Pending Pages</h3>
                  {/* <span className="text-xs text-red-500">Unmatched</span> */}
                </div>
                {myPending.map((p, idx) => (
                  <div key={idx} className="mb-2">
                    <p className="text-sm text-slate-700">
                      <span className="font-bold text-slate-800">{p.book}</span>: {formatPageRanges(p.pendingPages)}
                    </p>
                  </div>
                ))}
              </div>

              // <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
              //   <h3 className="text-lg font-semibold text-red-700 mb-2">Pending Pages</h3>
              //   {myPending.map((p, idx) => (
              //     <p key={idx} className="text-sm text-red-600">
              //       {p.book}: {formatPageRanges(p.pendingPages)}
              //     </p>
              //   ))}
              // </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
