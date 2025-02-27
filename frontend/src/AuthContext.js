// AuthContext.js
import { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(()=> {
    const tokens = localStorage.getItem('authTokens');
    return tokens ? JSON.parse(tokens) : null;
  });
  const [currentUser, setCurrentUser] = useState(()=> {
    return authTokens ? jwtDecode(authTokens.access) : null;
  });
  
  const loginUser = async (username, password) => {
    // (similar to handleLogin above)
    // on success: setAuthTokens and setCurrentUser
  };
  
  const logoutUser = () => {
    setAuthTokens(null);
    setCurrentUser(null);
    localStorage.removeItem('authTokens');
  };
  
  // Optionally, refresh token periodically or on mount if near expiry
  
  return (
    <AuthContext.Provider value={{ currentUser, authTokens, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
