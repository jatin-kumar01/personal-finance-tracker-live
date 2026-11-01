import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ArrowLeftRight, Target, BarChart2, Settings, Wallet
} from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/budget', label: 'Budget', icon: Target },
  { to: '/reports', label: 'Reports', icon: BarChart2 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-slate-900 flex flex-col z-20">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
        <Wallet className="text-emerald-400" size={26} />
        <span className="text-white font-bold text-lg tracking-tight">FinanceTracker</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-slate-700">
        <p className="text-xs text-slate-500">Personal Finance Tracker v1.0</p>
      </div>
    </aside>
  );
}
