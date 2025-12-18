"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  register: (email: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for existing session
    const storedUser = localStorage.getItem('remindme_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
        localStorage.removeItem('remindme_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    // Mock login - in real app would verify password
    // For MVP, we just simulate a user based on email
    const mockUser: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      preferences: { theme: 'dark' }
    };
    
    // Check if we have this user stored (simulating DB)
    // For this frontend-only version, we'll just create a session
    setUser(mockUser);
    localStorage.setItem('remindme_user', JSON.stringify(mockUser));
    router.push('/dashboard');
  };

  const register = async (email: string, name: string) => {
    const newUser: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      name,
      preferences: { theme: 'dark' }
    };
    setUser(newUser);
    localStorage.setItem('remindme_user', JSON.stringify(newUser));
    router.push('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('remindme_user');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
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
