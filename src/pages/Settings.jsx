// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import MainLayout from '../components/layout/MainLayout';
// import { User, Mail, LogOut, Trash2 } from 'lucide-react';
//
// export default function Settings() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [confirmed, setConfirmed] = useState(false);
//
//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//   };
//
//   const handleClearBudgets = () => {
//     if (!confirmed) { setConfirmed(true); return; }
//     localStorage.removeItem('finance_budgets');
//     setConfirmed(false);
//     alert('Budget data cleared.');
//   };
//
//   return (
//     <MainLayout>
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
//         <p className="text-sm text-gray-400">Manage your account and preferences</p>
//       </div>
//
//       {/* Profile card */}
//       <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-5 max-w-lg">
//         <h3 className="text-sm font-semibold text-gray-700 mb-4">Profile Information</h3>
//         <div className="flex items-center gap-4 mb-4">
//           <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
//             <User size={24} className="text-emerald-600" />
//           </div>
//           <div>
//             <p className="font-semibold text-gray-800">{user?.name}</p>
//             <p className="text-sm text-gray-500 flex items-center gap-1"><Mail size={13} />{user?.email}</p>
//           </div>
//         </div>
//         <div className="bg-slate-50 rounded-xl p-3 text-xs text-gray-500">
//           <p><span className="font-medium">User ID:</span> {user?.userId}</p>
//           <p className="mt-1">Authentication: JWT Bearer Token (stateless)</p>
//         </div>
//       </div>
//
//       {/* Actions */}
//       <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-lg space-y-3">
//         <h3 className="text-sm font-semibold text-gray-700 mb-4">Account Actions</h3>
//         <button onClick={handleClearBudgets}
//           className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-colors ${confirmed ? 'bg-rose-500 text-white border-rose-500' : 'text-amber-600 border-amber-200 hover:bg-amber-50'}`}>
//           <Trash2 size={15} />
//           {confirmed ? 'Click again to confirm deletion' : 'Clear Local Budget Data'}
//         </button>
//         <button onClick={handleLogout}
//           className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 border border-rose-200 hover:bg-rose-50 transition-colors">
//           <LogOut size={15} /> Sign Out
//         </button>
//       </div>
//     </MainLayout>
//   );
// }


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

export default function Settings() {
  const navigate = useNavigate();

  // User state initialized from localStorage or defaults
  const [profile, setProfile] = useState({
    name: 'jatin',
    email: 'jatin@gmail.com',
    userId: '6ae714ebc293a54ec7c6bccc',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Attempt loading saved user details if stored locally
    const savedName = localStorage.getItem('username');
    const savedEmail = localStorage.getItem('userEmail');
    if (savedName || savedEmail) {
      setProfile((prev) => ({
        ...prev,
        name: savedName || prev.name,
        email: savedEmail || prev.email,
      }));
    }
  }, []);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem('username', profile.name);
    localStorage.setItem('userEmail', profile.email);
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match!' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    // Reset fields & show success feedback
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setMessage({ type: 'success', text: 'Password changed successfully!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleClearBudget = () => {
    if (window.confirm('Are you sure you want to clear all locally stored budget goals?')) {
      localStorage.removeItem('budgetGoals');
      localStorage.removeItem('budgets');
      setMessage({ type: 'success', text: 'Local budget data cleared successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
      <MainLayout>
        <div className="max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            <p className="text-sm text-gray-400">Manage your account details and preferences</p>
          </div>

          {/* Global Alert Notification */}
          {message.text && (
              <div
                  className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                      message.type === 'success'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
              >
                {message.text}
              </div>
          )}

          <div className="space-y-6">
            {/* Profile Details Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Profile Information</h2>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold uppercase">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg capitalize">{profile.name}</h3>
                  <p className="text-sm text-gray-400">{profile.email}</p>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Display Name
                  </label>
                  <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      required
                  />
                </div>

                <div className="md:col-span-2 flex justify-end mt-2">
                  <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
                  >
                    Save Profile
                  </button>
                </div>
              </form>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-1">
                <p><span className="font-semibold">User ID:</span> {profile.userId}</p>
                <p><span className="font-semibold">Authentication:</span> JWT Bearer Token (Stateless)</p>
              </div>
            </div>

            {/* Security & Password Update */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Security Settings</h2>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Current Password
                  </label>
                  <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="••••••••"
                      required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      New Password
                    </label>
                    <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        placeholder="••••••••"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Confirm New Password
                    </label>
                    <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        placeholder="••••••••"
                        required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                      type="submit"
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Account Actions</h2>

              <div className="space-y-3">
                <button
                    type="button"
                    onClick={handleClearBudget}
                    className="w-full flex items-center justify-center gap-2 p-3 border border-amber-300 bg-amber-50/50 hover:bg-amber-50 text-amber-700 font-medium rounded-xl text-sm transition-colors"
                >
                  🗑️ Clear Local Budget Data
                </button>

                <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 p-3 border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-600 font-medium rounded-xl text-sm transition-colors"
                >
                  🚪 Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
  );
}