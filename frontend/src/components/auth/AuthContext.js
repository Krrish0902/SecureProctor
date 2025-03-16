import React, { createContext, useState, useContext } from 'react';
import jwt_decode from 'jwt-decode'; // Changed import syntax

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      return token ? jwt_decode(token) : null;
    } catch (error) {
      localStorage.removeItem('token'); // Clear invalid token
      return null;
    }
  });

  const login = (token) => {
    try {
      if (!token) throw new Error('No token provided');
      
      // Create a proper JWT-like token
      const tokenData = {
        email: token.email,
        role: token.role,
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiration
        iat: Math.floor(Date.now() / 1000)
      };
      
      const jwtToken = btoa(JSON.stringify(tokenData));
      localStorage.setItem('token', jwtToken);
      setUser(tokenData);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid login credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);