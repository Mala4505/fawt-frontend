// import { useAuth } from '../context/AuthContext';
// import { LogOut } from 'lucide-react';
// import { useLocation } from 'react-router-dom';

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const location = useLocation();

//   const navItemClass =
//     'text-sm text-slate-700 px-3 py-1.5 rounded transition font-medium';
//   const activeClass = 'text-slate-100 bg-slate-800 font-semibold';

//   return (
//     <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Left: Logo + Role */}
//           <div className="flex items-center space-x-3">
//             <h1 className="text-xl font-semibold text-slate-800">Fawt Portal</h1>
//             <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
//               {user?.role === 'admin' ? 'Admin' : 'Student'}
//             </span>
//           </div>

//           {/* Center: Nav Buttons */}
//           <div className="flex gap-2 items-center">
//             {user?.role === 'admin' && (
//               <>
//                 <a
//                   href="/admin"
//                   className={`${navItemClass} ${
//                     location.pathname === '/admin' ? activeClass : ''
//                   }`}
//                 >
//                   Admin Dashboard
//                 </a>
//                 <a
//                   href="/student"
//                   className={`${navItemClass} ${
//                     location.pathname === '/student' ? activeClass : ''
//                   }`}
//                 >
//                   Student Dashboard
//                 </a>
//                 <a
//                   href="/grouping"
//                   className={`${navItemClass} ${
//                     location.pathname === '/grouping' ? activeClass : ''
//                   }`}
//                 >
//                   Grouping
//                 </a>
//                 <a
//                   href="/container"
//                   className={`${navItemClass} ${
//                     location.pathname === '/container' ? activeClass : ''
//                   }`}
//                 >
//                   Container
//                 </a>
//               </>
//             )}
//             {user?.role === 'student' && (
//               <a
//                 href="/student"
//                 className={`${navItemClass} ${
//                   location.pathname === '/student' ? activeClass : ''
//                 }`}
//               >
//                 Dashboard
//               </a>
//             )}
//           </div>

//           {/* Right: User Info + Logout */}
//           <div className="flex items-center space-x-4">
//             <span className="text-sm text-slate-600">{user?.name}</span>
//             <button
//               onClick={logout}
//               className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
//             >
//               <LogOut className="w-4 h-4" />
//               <span>Logout</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItemClass =
    'text-sm text-slate-700 px-3 py-1.5 rounded transition font-medium';
  const activeClass = 'text-slate-100 bg-slate-800 font-semibold';

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo + Role */}
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold text-slate-800">Fawt Portal</h1>
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
              {user?.role === 'admin' ? 'Admin' : 'Student'}
            </span>
          </div>

          {/* Center: Nav Buttons */}
          <div className="flex gap-2 items-center">
            {user?.role === 'admin' && (
              <>
                <Link
                  to="/admin"
                  className={`${navItemClass} ${
                    location.pathname === '/admin' ? activeClass : ''
                  }`}
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/student"
                  className={`${navItemClass} ${
                    location.pathname === '/student' ? activeClass : ''
                  }`}
                >
                  Student Dashboard
                </Link>
                <Link
                  to="/grouping"
                  className={`${navItemClass} ${
                    location.pathname === '/grouping' ? activeClass : ''
                  }`}
                >
                  Grouping
                </Link>
              </>
            )}
            {user?.role === 'student' && (
              <Link
                to="/student"
                className={`${navItemClass} ${
                  location.pathname === '/student' ? activeClass : ''
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right: User Info + Logout */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">{user?.name}</span>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-200 hover:bg-slate-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
