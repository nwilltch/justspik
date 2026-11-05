'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  KeyRound,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth, AuthModalView } from '@/contexts/AuthContext';
import { trackBrieflishEvent } from '@/lib/brieflish';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalView,
    pendingEmail,
    closeAuthModal,
    setAuthModalView,
    setPendingEmail,
    loginSuccess,
  } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Synchronise pendingEmail
  useEffect(() => {
    if (pendingEmail) {
      setEmail(pendingEmail);
    }
  }, [pendingEmail]);

  // Reset errors when view changes
  useEffect(() => {
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [authModalView]);

  // Countdown timer pour le renvoi de code
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  if (!isAuthModalOpen) return null;

  // 1. Inscription
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l’inscription.');
      }

      setPendingEmail(email);
      setSuccessMsg(data.message || 'Code envoyé !');
      setResendCooldown(30);
      setAuthModalView('verify');
      trackBrieflishEvent('signup_code_sent', { email });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Connexion
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.needVerification) {
          setPendingEmail(email);
          setResendCooldown(30);
          setAuthModalView('verify');
          setErrorMsg(data.message);
          return;
        }
        throw new Error(data.error || 'Erreur de connexion.');
      }

      confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 } });
      trackBrieflishEvent('login_success', { email });
      loginSuccess(data.user);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Vérification Code OTP
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Code invalide.');
      }

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      trackBrieflishEvent('verify_account_success', { email });
      loginSuccess(data.user);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Mot de passe oublié
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur d’envoi.');
      }

      setPendingEmail(email);
      setSuccessMsg(data.message);
      setResendCooldown(30);
      setAuthModalView('reset');
      trackBrieflishEvent('forgot_password_requested', { email });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Réinitialisation Mot de passe
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Impossible de réinitialiser le mot de passe.');
      }

      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      trackBrieflishEvent('reset_password_success', { email });
      loginSuccess(data.user);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  // Renvoi de code
  const handleResendCode = async (type: 'signup' | 'reset-password') => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erreur lors du renvoi.');

      setSuccessMsg(data.message || 'Un nouveau code a été envoyé.');
      setResendCooldown(30);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-stone-200/90 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Bouton Fermer */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-teal-500 inline-block" />
            <span className="text-xl font-bold tracking-tight text-stone-900">
              just<span className="text-teal-600">spik</span>
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-stone-900">
            {authModalView === 'login' && 'Connexion'}
            {authModalView === 'signup' && 'Créer un compte'}
            {authModalView === 'verify' && 'Vérification de l’email'}
            {authModalView === 'forgot' && 'Mot de passe oublié'}
            {authModalView === 'reset' && 'Nouveau mot de passe'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {authModalView === 'login' && 'Retrouve tes réflexes et tes records vocaux'}
            {authModalView === 'signup' && 'Sauvegarde tes streaks et compare tes temps'}
            {authModalView === 'verify' && `Saisis le code à 6 chiffres envoyé à ${email}`}
            {authModalView === 'forgot' && 'Reçois un code par email pour réinitialiser ton accès'}
            {authModalView === 'reset' && 'Saisis le code reçu et ton nouveau mot de passe'}
          </p>
        </div>

        {/* Alertes d'erreur et de succès */}
        {errorMsg && (
          <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. VUE : CONNEXION */}
        {authModalView === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="toi@exemple.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-stone-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-stone-700">Mot de passe</label>
                <button
                  type="button"
                  onClick={() => setAuthModalView('forgot')}
                  className="text-xs text-teal-600 hover:text-teal-700 hover:underline cursor-pointer"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-stone-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Se connecter'}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-stone-500">Pas encore de compte ? </span>
              <button
                type="button"
                onClick={() => setAuthModalView('signup')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer"
              >
                Créer un compte
              </button>
            </div>
          </form>
        )}

        {/* 2. VUE : INSCRIPTION */}
        {authModalView === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Prénom ou Pseudo</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="toi@exemple.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-stone-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Créer mon compte'}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-stone-500">Déjà un compte ? </span>
              <button
                type="button"
                onClick={() => setAuthModalView('login')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer"
              >
                Se connecter
              </button>
            </div>
          </form>
        )}

        {/* 3. VUE : VÉRIFICATION CODE OTP */}
        {authModalView === 'verify' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1 text-center">
                Code de confirmation
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full text-center text-2xl tracking-[0.5em] py-3 rounded-xl border border-stone-200 bg-stone-50/50 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-stone-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Valider mon compte'}
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => setAuthModalView('signup')}
                className="text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Modifier l’email
              </button>
              <button
                type="button"
                disabled={resendCooldown > 0 || isLoading}
                onClick={() => handleResendCode('signup')}
                className="text-teal-600 hover:text-teal-700 disabled:text-stone-400 font-medium cursor-pointer"
              >
                {resendCooldown > 0 ? `Renvoyer (${resendCooldown}s)` : 'Renvoyer un code'}
              </button>
            </div>
          </form>
        )}

        {/* 4. VUE : MOT DE PASSE OUBLIÉ */}
        {authModalView === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Email associé</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="toi@exemple.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-stone-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Envoyer le code'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthModalView('login')}
                className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Retour à la connexion
              </button>
            </div>
          </form>
        )}

        {/* 5. VUE : RÉINITIALISATION DU MOT DE PASSE */}
        {authModalView === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1 text-center">
                Code à 6 chiffres
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="w-full text-center text-2xl tracking-[0.5em] py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-stone-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || code.length !== 6 || newPassword.length < 6}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Changer mon mot de passe'}
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => setAuthModalView('login')}
                className="text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Retour
              </button>
              <button
                type="button"
                disabled={resendCooldown > 0 || isLoading}
                onClick={() => handleResendCode('reset-password')}
                className="text-teal-600 hover:text-teal-700 disabled:text-stone-400 font-medium cursor-pointer"
              >
                {resendCooldown > 0 ? `Renvoyer (${resendCooldown}s)` : 'Renvoyer un code'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
