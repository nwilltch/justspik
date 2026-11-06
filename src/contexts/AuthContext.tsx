'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SafeUser } from '@/lib/userStore';

export type AuthModalView = 'login' | 'signup' | 'verify' | 'forgot' | 'reset';
export type AuthReason = 'normal' | 'limit_reached';

export const MAX_FREE_ATTEMPTS = 5;

interface AuthContextType {
  user: SafeUser | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalView: AuthModalView;
  authReason: AuthReason;
  pendingEmail: string;
  guestAttempts: number;
  isLimitReached: boolean;
  incrementGuestAttempt: () => number;
  openAuthModal: (view?: AuthModalView, email?: string, reason?: AuthReason) => void;
  closeAuthModal: () => void;
  setPendingEmail: (email: string) => void;
  setAuthModalView: (view: AuthModalView) => void;
  loginSuccess: (user: SafeUser) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<AuthModalView>('login');
  const [authReason, setAuthReason] = useState<AuthReason>('normal');
  const [pendingEmail, setPendingEmail] = useState('');
  const [guestAttempts, setGuestAttempts] = useState(0);

  // Charger les tentatives sauvegardées dans localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('justspik_guest_attempts');
      if (stored) {
        const val = parseInt(stored, 10);
        if (!isNaN(val)) setGuestAttempts(val);
      }
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const incrementGuestAttempt = useCallback((): number => {
    // Si l'utilisateur est connecté, pas de décompte invité
    if (user) return 0;

    const nextVal = guestAttempts + 1;
    setGuestAttempts(nextVal);
    if (typeof window !== 'undefined') {
      localStorage.setItem('justspik_guest_attempts', nextVal.toString());
    }
    return nextVal;
  }, [user, guestAttempts]);

  const openAuthModal = useCallback(
    (view: AuthModalView = 'login', email: string = '', reason: AuthReason = 'normal') => {
      setAuthModalView(view);
      setAuthReason(reason);
      if (email) setPendingEmail(email);
      setIsAuthModalOpen(true);
    },
    []
  );

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthReason('normal');
  }, []);

  const loginSuccess = useCallback((loggedInUser: SafeUser) => {
    setUser(loggedInUser);
    setIsAuthModalOpen(false);
    setAuthReason('normal');
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (err) {
      console.error('Erreur déconnexion:', err);
    }
  }, []);

  const isLimitReached = !user && guestAttempts >= MAX_FREE_ATTEMPTS;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        authModalView,
        authReason,
        pendingEmail,
        guestAttempts,
        isLimitReached,
        incrementGuestAttempt,
        openAuthModal,
        closeAuthModal,
        setPendingEmail,
        setAuthModalView,
        loginSuccess,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
