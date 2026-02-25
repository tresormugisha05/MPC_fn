import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, name: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin123';

interface User {
  email: string;
  name: string;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Check localStorage on mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem('isAdmin');
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedAdmin === 'true') {
      setIsAdmin(true);
    }
    
    if (storedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Check for admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      return true;
    }
    
    // Check for regular user login from registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = registeredUsers.find((u: User & { password: string }) => u.email === email && u.password === password);
    
    if (user) {
      setIsLoggedIn(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    
    return false;
  };

  const register = (email: string, password: string, name: string): boolean => {
    // Check if user already exists
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = registeredUsers.find((u: User & { password: string }) => u.email === email);
    
    if (existingUser) {
      return false;
    }
    
    // Add new user
    const newUser = { email, password, name };
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    // Auto-login after registration
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return true;
  };

  const logout = () => {
    setIsAdmin(false);
    setIsLoggedIn(false);
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, isLoggedIn, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
