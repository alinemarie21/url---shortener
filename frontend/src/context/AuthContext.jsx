import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as api from '../services/mockApi.js';

const STORAGE_KEY = 'shortly:session';

const AuthContext = createContext(null);

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(session) {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage indisponível (modo privado, etc.): segue só em memória.
  }
}

export function AuthProvider({ children }) {
  // session = { token, user: { name, email } } | null
  const [session, setSession] = useState(loadSession);

  const login = useCallback(async (credentials) => {
    const next = await api.login(credentials);
    saveSession(next);
    setSession(next);
  }, []);

  const logout = useCallback(() => {
    saveSession(null);
    setSession(null);
  }, []);

  const value = useMemo(() => ({ session, login, logout }), [session, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
