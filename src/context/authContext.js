import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [id, setId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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

  const checkAuthStatus = () => {
    try {
      const sessionId = sessionStorage.getItem("sessionId");
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      const token = sessionStorage.getItem(`token_${sessionId}`);
      if (!token) {
        setIsLoading(false);
        return;
      }

      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        logout();
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(true);
      setRole(decodedToken.role);
      setId(decodedToken.id);
    } catch (error) {
      console.error("Error checking auth status:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, login, logout, id, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
