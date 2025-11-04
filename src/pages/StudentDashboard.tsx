// import { useState, useEffect } from 'react';
// import Navbar from '../components/Navbar';
// import PageRangeForm from '../components/PageRangeForm';
// import EntryList from '../components/EntryList';
// import GroupView from '../components/GroupView';
// import { useAuth } from '../context/AuthContext';
// import { Entry, Group } from "../types/index";
// import axios from 'axios';

// export default function StudentDashboard() {
//   const { user } = useAuth();

//   const [books, setBooks] = useState<{ id: string; name: string }[]>([]);
//   const [selectedBookId, setSelectedBookId] = useState<number | ''>('');
//   const [entries, setEntries] = useState<Entry[]>([]);
//   const [studentGroup, setStudentGroup] = useState<Group | undefined>(undefined);

//   useEffect(() => {
//     axios.get('/api/books/').then(res => {
//       setBooks(res.data);
//     });
//   }, []);

//   useEffect(() => {
//     if (!user) return;

//     axios.get(`/api/entries/?user=${user.id}`).then(res => {
//       const mapped = res.data.map((e: any) => ({
//         id: e.id,
//         studentTr: e.user.tr_number,
//         studentName: e.user.name,
//         bookName: e.book.name,
//         fromPage: e.from_page,
//         toPage: e.to_page
//       }));
//       setEntries(mapped);
//     });

//     axios.get('/api/group-list/').then(res => {
//       const group = res.data.find((g: Group) =>
//         g.members.some(m => m.trNumber === user.trNumber)
//       );
//       setStudentGroup(group);
//     });
//   }, [user]);

//   const handleAddEntry = (entry: {
//     bookId: string;
//     bookName: string;
//     fromPage: number;
//     toPage: number;
//   }) => {
//     if (!user) return;

//     axios
//       .post('/api/entries/', {
//         user: user.id,
//         book: entry.bookId,
//         from_page: entry.fromPage,
//         to_page: entry.toPage,
//         revised: false
//       })
//       .then(res => {
//         const newEntry: Entry = {
//           id: res.data.id,
//           studentTr: user.trNumber,
//           studentName: user.name,
//           bookName: entry.bookName,
//           fromPage: entry.fromPage,
//           toPage: entry.toPage
//         };
//         setEntries(prev => [...prev, newEntry]);
//       });
//   };

//   const handleDeleteEntry = (id: string) => {
//     axios.delete(`/api/entries/${id}/`).then(() => {
//       setEntries(prev => prev.filter(e => e.id !== id));
//     });
//   };

// const selectedBookObj =
//   selectedBookId === '' ? undefined : books.find(b => Number(b.id) === selectedBookId);
//   const bookEntries =
//     selectedBookId === ''
//       ? []
//       : entries.filter(e => e.bookName === selectedBookObj?.name);

//   return (
//     <div className="min-h-screen w-full bg-slate-50">
//       <Navbar />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-slate-700 mb-2">Select Book</label>
//           {/* <select
//             value={selectedBookId}
//             onChange={e => setSelectedBookId(e.target.value)}
//             >
//             <option value="">Select a book</option>
//             {books.map(book => (
//               <option key={book.id} value={book.id}>
//                 {book.name}
//               </option>
//             ))}
//           </select> */}
//           <select
//             value={selectedBookId}
//             onChange={e => {
//               const value = e.target.value;
//               setSelectedBookId(value === '' ? '' : Number(value)); // ✅ cast to number
//             }}
//             className="w-full max-w-md px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none"
//           >
//             <option value="">Select a book</option>
//             {books.map(book => (
//               <option key={book.id} value={book.id}>
//                 {book.name}
//               </option>
//             ))}
//           </select>

//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
//               <h2 className="text-lg font-semibold text-slate-800 mb-4">Add Page Range</h2>
//               {user && selectedBookObj ? (
//                 <PageRangeForm
//                   userId={user.id}
//                   bookId={selectedBookObj.id}
//                   bookName={selectedBookObj.name}
//                   onAdd={handleAddEntry}
//                 />
//               ) : (
//                 <p className="text-sm text-slate-500">Please select a book to add entries.</p>
//               )}
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
//               <h2 className="text-lg font-semibold text-slate-800 mb-4">My Entries</h2>
//               <EntryList entries={bookEntries} onDelete={handleDeleteEntry} />
//             </div>
//           </div>

//           <div className="space-y-6">
//             <GroupView group={studentGroup} currentUserTr={user?.trNumber} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import PageRangeForm from '../components/PageRangeForm';
import EntryList from '../components/EntryList';
import GroupView from '../components/GroupView';
import { useAuth } from '../context/AuthContext';
import { Entry, Group } from "../types/index";
import axios from 'axios';

export default function StudentDashboard() {
  const { user } = useAuth();

  const [books, setBooks] = useState<{ id: string; name: string }[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [studentGroup, setStudentGroup] = useState<Group | undefined>(undefined);

  useEffect(() => {
    axios.get('/api/books/').then(res => {
      setBooks(res.data);
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    axios.get(`/api/entries/?user=${user.id}`).then(res => {
      const mapped = res.data.map((e: any) => ({
        id: Number(e.id),
        studentTr: e.user.tr_number,
        studentName: e.user.name,
        bookName: e.book.name,
        fromPage: e.from_page,
        toPage: e.to_page
      }));
      setEntries(mapped);
    });

    axios.get('/api/group-list/').then(res => {
      const group = res.data.find((g: Group) =>
        g.members.some(m => m.trNumber === user.trNumber)
      );
      setStudentGroup(group);
    });
  }, [user]);

  const handleAddEntry = async (entry: {
    bookId: string;
    bookName: string;
    fromPage: number;
    toPage: number;
  }) => {
    if (!user) return;

    try {
      const res = await axios.post('/api/entries/', {
        user_id: user.id,
        book_id: entry.bookId,
        from_page: entry.fromPage,
        to_page: entry.toPage,
        revised: false
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Response from backend:", res.data); // ✅ Should include id, user, book

      const newEntry: Entry = {
        id: Number(res.data.id),
        studentTr: user.trNumber,
        studentName: user.name,
        bookName: entry.bookName,
        fromPage: entry.fromPage,
        toPage: entry.toPage
      };

      setEntries(prev => [...prev, newEntry]);
    } catch (err: any) {
      const message = err.response?.data?.error || err.message;
      alert(`Failed to add entry: ${message}`);
    }
  };

  const handleDeleteEntry = async (id: string | number) => {
    try {
      await axios.delete(`/api/entries/${id}/`);
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch (err: any) {
      const message = err.response?.data?.error || err.message;
      alert(`Failed to delete entry: ${message}`);
    }
  };

  const selectedBookObj = books.find(b => String(b.id) === String(selectedBookId));

  const bookEntries = useMemo(() => {
    if (!selectedBookObj) return [];
    return entries.filter(e => e.bookName === selectedBookObj.name);
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
            <option value="">Select a book</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>
                {book.name}
              </option>
            ))}
          </select>
        </div>

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
            <GroupView group={studentGroup} currentUserTr={user?.trNumber} />
          </div>
        </div>
      </div>
    </div>
  );
}
