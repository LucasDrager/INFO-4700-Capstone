// ============================
// Auth Context and Provider
// ============================
import { createContext, useState, useContext, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        setAuthTokens(data);
        // Typically you'd decode the JWT to get user info; let's store just the username here.
        // In real usage, we'd decode 'data.access' with something like jwt-decode.
        setCurrentUser(username);
        localStorage.setItem('authTokens', JSON.stringify(data));
        return { success: true };
      } else {
        return { success: false, message: "Invalid credentials." };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Network error." };
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setCurrentUser(null);
    localStorage.removeItem('authTokens');
  };

  useEffect(() => {
    // On mount, try to restore tokens from localStorage
    const storedTokens = localStorage.getItem('authTokens');
    if (storedTokens) {
      const parsed = JSON.parse(storedTokens);
      setAuthTokens(parsed);
      // For simplicity, let's assume we also stored the username in localStorage.
      // Real usage: parse the token.
      // setCurrentUser(jwtDecode(parsed.access).username) or similar
      setCurrentUser("restored-user"); // placeholder
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser,
      setCurrentUser,
      authTokens,
      setAuthTokens,
      loginUser,
      logoutUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
