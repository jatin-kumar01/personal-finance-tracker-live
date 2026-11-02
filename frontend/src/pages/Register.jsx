import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center gap-3 mb-8">
          <Wallet className="text-emerald-500" size={30} />
          <h1 className="text-2xl font-bold text-gray-800">FinanceTracker</h1>
        </div>
        <h2 className="text-lg font-semibold text-gray-700 mb-1">Create your account</h2>
        <p className="text-sm text-gray-400 mb-6">Start tracking your finances today</p>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
            <input name="name" required value={form.name} onChange={handleChange} placeholder="Alex Mercer"
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com"
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Password <span className="text-gray-400">(min. 6 chars)</span></label>
            <input name="password" type="password" required value={form.password} onChange={handleChange} placeholder="••••••••"
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm mt-2">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-500 font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
