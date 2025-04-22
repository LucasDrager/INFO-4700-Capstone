import { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
const API_BASE = process.env.REACT_APP_API_BASE;

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authTokens, setAuthTokens] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================================
  // Initial Load – Rehydrate Tokens
  // ================================
  useEffect(() => {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');

    if (access && refresh) {
      try {
        const decoded = jwtDecode(access);
        setAuthTokens({ access, refresh });
        setCurrentUser(decoded.username || decoded.email || decoded.sub);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      } catch (err) {
        console.error("Token decoding failed:", err);
        logoutUser();
      }
    }

    setLoading(false);
  }, []);

  // ====================
  // Login Function
  // ====================
  const loginUser = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();

        const decoded = jwtDecode(data.access);
        const user = decoded.username || decoded.email || decoded.sub;

        setAuthTokens({ access: data.access, refresh: data.refresh });
        setCurrentUser(user);

        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;

        return { success: true };
      } else {
        return { success: false, message: "Invalid credentials." };
      }
    } catch (error) {
      return { success: false, message: "Network error." };
    }
  };

  // ====================
  // Logout Function
  // ====================
  const logoutUser = () => {
    setAuthTokens(null);
    setCurrentUser(null);
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  // ====================
  // Auto Refresh Token
  // ====================
  useEffect(() => {
    const interval = setInterval(async () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return;

      try {
        const res = await fetch(`${API_BASE}token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken })
        });

        if (res.ok) {
          const data = await res.json();
          const newAccess = data.access;

          localStorage.setItem('access_token', newAccess);
          setAuthTokens(prev => ({ ...prev, access: newAccess }));
          axios.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
        } else {
          logoutUser();
        }
      } catch (err) {
        console.error("Failed to refresh token:", err);
        logoutUser();
      }
    }, 10 * 60 * 1000); // Every 10 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{
      authTokens,
      setAuthTokens,
      currentUser,
      setCurrentUser,
      loginUser,
      logoutUser,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}
