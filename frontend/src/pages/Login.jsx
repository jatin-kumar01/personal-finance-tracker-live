
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await login(form);
      navigate('/dashboard');

    } catch (err) {
      console.error('Login Error:', err.response?.data || err);

      const message =
          err.response?.status === 401
              ? 'Invalid email or password. Please try again.'
              : err.response?.data?.message ||
              'Login failed. Please try again.';

      setError(message);
      setErrorKey((prev) => prev + 1);

    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">

        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <Wallet className="text-emerald-500" size={30} />

            <h1 className="text-2xl font-bold text-gray-800">
              FinanceTracker
            </h1>
          </div>

          {/* Heading */}
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            Welcome back
          </h2>

          <p className="text-sm text-gray-400 mb-6">
            Sign in to your account to continue
          </p>

          {/* Error Message */}
          {error && (
              <div
                  key={errorKey}
                  role="alert"
                  aria-live="polite"
                  className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg px-4 py-3 mb-4 animate-error-hide"
              >
                <AlertCircle
                    size={18}
                    className="shrink-0 mt-0.5"
                />

                <span>{error}</span>
              </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Email
              </label>

              <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Password
              </label>

              <input
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Don&apos;t have an account?{' '}

            <Link
                to="/register"
                className="text-emerald-500 font-medium hover:underline"
            >
              Register
            </Link>
          </p>

        </div>
      </div>
  );
}
