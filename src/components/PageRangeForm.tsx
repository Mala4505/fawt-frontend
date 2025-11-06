// import React, { useState } from 'react';
// import { Plus } from 'lucide-react';
// import axios from 'axios';
// import { Entry } from "../types/index";
// import LoadingSpinner from "../components/LoadingSpinner";


// interface PageRangeFormProps {
//   userId: string;
//   bookId: string;
//   bookName: string;
//   entries: Entry[];
//   onAdd: (entry: {
//     bookId: string;
//     bookName: string;
//     fromPage: number;
//     toPage: number;
//   }) => void;
// }

// export default function PageRangeForm({ userId, bookId, bookName, entries, onAdd }: PageRangeFormProps) {
//   const [fromPage, setFromPage] = useState('');
//   const [toPage, setToPage] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (loading) return;

//     const from = parseInt(fromPage);
//     const to = parseInt(toPage);

//     if (from > 0 && to > 0 && from <= to && userId && bookId) {
//       setLoading(true);
//       const alreadyExists = entries.some(
//         e => e.bookName === bookName && e.fromPage === from && e.toPage === to
//       );

//       if (alreadyExists) {
//         alert('This page range already exists.');
//         return;
        
//       }
//       try {
//         const res = await axios.post('/api/entries/', {
//           user_id: userId,
//           book_id: bookId,
//           from_page: from,
//           to_page: to,
//           revised: false
//         });
//         onAdd({
//           bookId,
//           bookName,
//           fromPage: from,
//           toPage: to
//         });
//         setFromPage('');
//         setToPage('');
//       } catch (err: any) {
//         const message = err.response?.data?.error || err.message;
//         console.error('Failed to add entry:', message);
//         alert(`Failed to add entry: ${message}`);
//       } finally {
//         setLoading(false);
//       }
//       setLoading(false);
//     }
//   };


//   return (
// <div>
//       {loading && (
//         <div className="flex justify-center py-4">
//           <LoadingSpinner />
//         </div>
//       )}
//     <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
//       <div className="flex-1">
//         <input
//           type="number"
//           value={fromPage}
//           onChange={e => setFromPage(e.target.value)}
//           placeholder="From page"
//           className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none"
//           required
//           min="1"
//         />
//       </div>
//       <div className="flex-1">
//         <input
//           type="number"
//           value={toPage}
//           onChange={e => setToPage(e.target.value)}
//           placeholder="To page"
//           className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none"
//           required
//           min="1"
//         />
//       </div>
//       <button
//         type="submit"
//         className="flex items-center justify-center space-x-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
//       >
//         <Plus className="w-4 h-4" />
//         <span>Add</span>
//       </button>
//     </form>
// </div>
//   );
// }

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { Entry } from "../types/index";
import LoadingSpinner from "../components/LoadingSpinner";

interface PageRangeFormProps {
  userId: string;
  bookId: string;
  bookName: string;
  entries: Entry[];
  onAdd: (entry: {
    bookId: string;
    bookName: string;
    fromPage: number;
    toPage: number;
  }) => void;
}

export default function PageRangeForm({ userId, bookId, bookName, entries, onAdd }: PageRangeFormProps) {
  const [fromPage, setFromPage] = useState('');
  const [toPage, setToPage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const from = parseInt(fromPage);
    const to = parseInt(toPage);

    if (from > 0 && to > 0 && from <= to && userId && bookId) {
      setLoading(true);

      const alreadyExists = entries.some(
        e => e.bookName === bookName && e.fromPage === from && e.toPage === to
      );

      if (alreadyExists) {
        alert('This page range already exists.');
        setLoading(false); // ✅ reset loading even after alert
        return;
      }

      try {
        await axios.post('/api/entries/', {
          user_id: userId,
          book_id: bookId,
          from_page: from,
          to_page: to,
          revised: false
        });

        onAdd({ bookId, bookName, fromPage: from, toPage: to });
        setFromPage('');
        setToPage('');
      } catch (err: any) {
        const message = err.response?.data?.error || err.message;
        console.error('Failed to add entry:', message);
        alert(`Failed to add entry: ${message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      {loading && (
        <div className="flex justify-center py-4">
          <LoadingSpinner />
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="number"
            value={fromPage}
            onChange={e => setFromPage(e.target.value)}
            placeholder="From page"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none"
            required
            min="1"
            disabled={loading}
          />
        </div>
        <div className="flex-1">
          <input
            type="number"
            value={toPage}
            onChange={e => setToPage(e.target.value)}
            placeholder="To page"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none"
            required
            min="1"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center space-x-2 px-6 py-2 rounded-lg transition ${
            loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700 text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
}
