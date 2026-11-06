'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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

  // Synchronisation ref pour éviter les fermetures obsolètes (stale closures)
  const userRef = useRef<SafeUser | null>(null);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

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
        if (data.user) {
          setUser(data.user);
          userRef.current = data.user;
          // Dès qu'on est connecté, on purge le quota invité
          setGuestAttempts(0);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('justspik_guest_attempts');
          }
        } else {
          setUser(null);
          userRef.current = null;
        }
      } else {
        setUser(null);
        userRef.current = null;
      }
    } catch {
      setUser(null);
      userRef.current = null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const incrementGuestAttempt = useCallback((): number => {
    // Si l'utilisateur est connecté, pas de décompte invité
    if (userRef.current) return 0;

    const nextVal = guestAttempts + 1;
    setGuestAttempts(nextVal);
    if (typeof window !== 'undefined') {
      localStorage.setItem('justspik_guest_attempts', nextVal.toString());
    }
    return nextVal;
  }, [guestAttempts]);

  const openAuthModal = useCallback(
    (view: AuthModalView = 'login', email: string = '', reason: AuthReason = 'normal') => {
      // Un utilisateur connecté ne doit JAMAIS voir la modale s'ouvrir pour cause de limite atteinte
      if (userRef.current && reason === 'limit_reached') {
        return;
      }
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
    userRef.current = loggedInUser;
    // Réinitialise et supprime immédiatement le quota invité
    setGuestAttempts(0);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('justspik_guest_attempts');
    }
    setIsAuthModalOpen(false);
    setAuthReason('normal');
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      userRef.current = null;
      setGuestAttempts(0);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('justspik_guest_attempts');
      }
    } catch (err) {
      console.error('Erreur déconnexion:', err);
    }
  }, []);

  // La limite n'est JAMAIS active pendant le chargement initial ou si l'utilisateur est connecté
  const isLimitReached = !isLoading && !user && guestAttempts >= MAX_FREE_ATTEMPTS;

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
