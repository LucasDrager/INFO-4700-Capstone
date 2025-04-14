// ============================
// Auth Context and Provider
// ============================
import { createContext, useState, useContext, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
const API_BASE = process.env.REACT_APP_API_BASE;

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authTokens, setAuthTokens] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const loginUser = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      if (res.ok) {
        const data = await res.json();
        setAuthTokens(data);
        setCurrentUser(data.username);
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

  const logoutUser = () => {
    setAuthTokens(null);
    setCurrentUser(null);
    delete axios.defaults.headers.common['Authorization'];
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{
      authTokens,
      setAuthTokens,
      currentUser,
      setCurrentUser,
      loginUser,
      logoutUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
