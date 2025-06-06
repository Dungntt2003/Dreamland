import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [id, setId] = useState(null);
  const login = (token) => {
    const sessionId = uuidv4();
    sessionStorage.setItem("sessionId", sessionId);
    sessionStorage.setItem(`token_${sessionId}`, token);
    setIsAuthenticated(true);
    const decodedToken = jwtDecode(token);
    setRole(decodedToken.role);
    setId(decodedToken.id);
  };

  const logout = () => {
    const sessionId = sessionStorage.getItem("sessionId");
    if (sessionId) {
      sessionStorage.removeItem(`token_${sessionId}`);
      sessionStorage.removeItem("sessionId");
    }
    setIsAuthenticated(false);
    setRole(null);
    setId(null);
  };

  useEffect(() => {
    const sessionId = sessionStorage.getItem("sessionId");
    const token = sessionStorage.getItem(`token_${sessionId}`);
    if (token) {
      setIsAuthenticated(true);
      setRole(jwtDecode(token).role);
      setId(jwtDecode(token).id);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout, id }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
