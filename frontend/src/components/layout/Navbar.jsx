
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
      <header className="fixed top-0 left-60 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">

        {/* Dynamic Welcome Message */}
        <p className="text-gray-700 font-medium">
          Welcome back,{' '}
          <span className="text-emerald-600 font-semibold">
          {user?.name || 'User'}
        </span>
          {' '}👋
        </p>

        <div className="flex items-center gap-4">

          {/* Dynamic Email */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <User size={16} />
            <span>
            {user?.email || 'No email available'}
          </span>
          </div>

          {/* Logout */}
          <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut size={15} />
            Logout
          </button>

        </div>
      </header>
  );
}
