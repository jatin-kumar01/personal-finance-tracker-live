
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
} from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated user after page refresh
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error restoring user session:', error);

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = async (credentials) => {
    const { data } = await apiLogin(credentials);

    const loggedInUser = {
      userId: data.userId,
      email: data.email,
      name: data.name,
    };

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(loggedInUser));

    setToken(data.token);
    setUser(loggedInUser);

    return data;
  };

  // Register
  const register = async (payload) => {
    const { data } = await apiRegister(payload);

    const registeredUser = {
      userId: data.userId,
      email: data.email,
      name: data.name,
    };

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(registeredUser));

    setToken(data.token);
    setUser(registeredUser);

    return data;
  };

  // Update user profile in React state and localStorage
  const updateUser = (updatedData) => {
    if (!user) {
      throw new Error('No authenticated user found.');
    }

    const updatedUser = {
      ...user,
      ...updatedData,
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));

    setUser(updatedUser);

    return updatedUser;
  };

  // Logout
  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      setToken(null);
      setUser(null);
    }
  };

  return (
      <AuthContext.Provider
          value={{
            user,
            token,
            isAuthenticated: !!token,
            login,
            register,
            logout,
            updateUser,
            loading,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}






//
// import { createContext, useContext, useState, useEffect } from 'react';
// import {
//   login as apiLogin,
//   logout as apiLogout,
//   register as apiRegister
// } from '../api/authApi';
//
// const AuthContext = createContext(null);
//
// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     try {
//       const storedToken = localStorage.getItem('token');
//       const storedUser = localStorage.getItem('user');
//
//       if (storedToken && storedUser) {
//         setToken(storedToken);
//         setUser(JSON.parse(storedUser));
//       }
//     } catch (error) {
//       console.error('Failed to restore authentication:', error);
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//     } finally {
//       setLoading(false);
//     }
//   }, []);
//
//   const saveAuthData = (data) => {
//     const userData = {
//       userId: data.userId,
//       name: data.name,
//       email: data.email
//     };
//
//     localStorage.setItem('token', data.token);
//     localStorage.setItem('user', JSON.stringify(userData));
//
//     setToken(data.token);
//     setUser(userData);
//   };
//
//   const login = async (credentials) => {
//     const { data } = await apiLogin(credentials);
//     saveAuthData(data);
//     return data;
//   };
//
//   const register = async (payload) => {
//     const { data } = await apiRegister(payload);
//     saveAuthData(data);
//     return data;
//   };
//
//   const logout = async () => {
//     try {
//       await apiLogout();
//     } catch (error) {
//       console.error('Logout API error:', error);
//     }
//
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//
//     setToken(null);
//     setUser(null);
//   };
//
//   const updateUser = (updatedUser) => {
//     const newUser = { ...user, ...updatedUser };
//
//     localStorage.setItem('user', JSON.stringify(newUser));
//     setUser(newUser);
//   };
//
//   return (
//       <AuthContext.Provider
//           value={{
//             user,
//             token,
//             isAuthenticated: !!token,
//             login,
//             register,
//             logout,
//             updateUser,
//             loading
//           }}
//       >
//         {children}
//       </AuthContext.Provider>
//   );
// }
//
// export function useAuth() {
//   return useContext(AuthContext);
// }
//
//
//
//
//
//
// // import { createContext, useContext, useState, useEffect } from 'react';
// // import { login as apiLogin, logout as apiLogout, register as apiRegister } from '../api/authApi';
// //
// // const AuthContext = createContext(null);
// //
// // export function AuthProvider({ children }) {
// //   const [user, setUser] = useState(null);
// //   const [token, setToken] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //
// //
// //   useEffect(() => {
// //     const storedToken = localStorage.getItem('token');
// //     const storedUser = localStorage.getItem('user');
// //     if (storedToken && storedUser) {
// //       setToken(storedToken);
// //       setUser(JSON.parse(storedUser));
// //     }
// //     setLoading(false);
// //   }, []);
// //
// //   const login = async (credentials) => {
// //     const { data } = await apiLogin(credentials);
// //     localStorage.setItem('token', data.token);
// //     localStorage.setItem('user', JSON.stringify({ userId: data.userId, email: data.email, name: data.name }));
// //     setToken(data.token);
// //     setUser({ userId: data.userId, email: data.email, name: data.name });
// //     return data;
// //   };
// //
// //   const register = async (payload) => {
// //     const { data } = await apiRegister(payload);
// //     localStorage.setItem('token', data.token);
// //     localStorage.setItem('user', JSON.stringify({ userId: data.userId, email: data.email, name: data.name }));
// //     setToken(data.token);
// //     setUser({ userId: data.userId, email: data.email, name: data.name });
// //     return data;
// //   };
// //
// //   const logout = async () => {
// //     try { await apiLogout(); } catch (_) { /* ignore */ }
// //     localStorage.removeItem('token');
// //     localStorage.removeItem('user');
// //     setToken(null);
// //     setUser(null);
// //   };
// //
// //   return (
// //     <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout, loading }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // }
// //
// // export function useAuth() {
// //   return useContext(AuthContext);
// // }
