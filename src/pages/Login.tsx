// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// export default function Login() {
//   const [trNumber, setTrNumber] = useState('');
//   const {
//     login
//   } = useAuth();
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (trNumber.trim()) {
//       login(trNumber.trim());
//     }
//   };
//   return <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-semibold text-slate-800 mb-2">
//               Fawt Portal
//             </h1>
//             <p className="text-slate-500 text-sm">
//               Enter your TR number to continue
//             </p>
//           </div>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="trNumber" className="block text-sm font-medium text-slate-700 mb-2">
//                 TR Number
//               </label>
//               <input id="trNumber" type="text" value={trNumber} onChange={e => setTrNumber(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition" placeholder="Enter TR number" required />
//             </div>
//             <button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition">
//               Sign In
//             </button>
//           </form>
//           <div className="mt-6 pt-6 border-t border-slate-200">
//             <p className="text-xs text-slate-500 text-center">
//               Tip: Enter "admin" for admin access
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>;
// }
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [trNumber, setTrNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (trNumber.trim()) {
      setLoading(true);
      try {
        await login(trNumber.trim());
      } catch {
        setError('Invalid TR number. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-slate-800 mb-2">Fawt Portal</h1>
            <p className="text-slate-500 text-sm">Enter your TR number to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="trNumber" className="block text-sm font-medium text-slate-700 mb-2">
                TR Number
              </label>
              <input
                id="trNumber"
                type="text"
                value={trNumber}
                onChange={e => setTrNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition"
                placeholder="Enter TR number"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
