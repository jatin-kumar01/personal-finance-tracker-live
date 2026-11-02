import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, register as apiRegister } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const { data } = await apiLogin(credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ userId: data.userId, email: data.email, name: data.name }));
    setToken(data.token);
    setUser({ userId: data.userId, email: data.email, name: data.name });
    return data;
  };

  const register = async (payload) => {
    const { data } = await apiRegister(payload);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ userId: data.userId, email: data.email, name: data.name }));
    setToken(data.token);
    setUser({ userId: data.userId, email: data.email, name: data.name });
    return data;
  };

  const logout = async () => {
    try { await apiLogout(); } catch (_) { /* ignore */ }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
