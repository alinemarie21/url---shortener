import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../api/api.js';

const STORAGE_KEY = 'shortly:session';

const AuthContext = createContext(null);

// session = { token, user: { email, name? } } | null
// O token é tratado como opaco: o frontend só checa se ele existe. Quem valida
// (assinatura e expiração) é o backend, que responde 401 se estiver inválido.
function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const session = raw ? JSON.parse(raw) : null;
    return session?.token ? session : null;
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
  const [session, setSession] = useState(loadSession);

  const startSession = useCallback((next) => {
    saveSession(next);
    setSession(next);
  }, []);

  const logout = useCallback(() => startSession(null), [startSession]);

  const login = useCallback(
    async ({ email, password }) => {
      const { token } = await api.login({ email, password });
      startSession({ token, user: { email: email.trim().toLowerCase() } });
    },
    [startSession],
  );

  const register = useCallback(
    async ({ name, email, password }) => {
      const { token, user } = await api.register({ name, email, password });
      startSession({ token, user });
    },
    [startSession],
  );

  // A API lê o token da sessão salva e, ao receber 401 de uma rota autenticada,
  // encerra a sessão — o que faz o App voltar para o login.
  useEffect(() => {
    api.configureApi({
      getToken: () => loadSession()?.token ?? null,
      onUnauthorized: logout,
    });
  }, [logout]);

  const value = useMemo(
    () => ({ session, login, register, logout }),
    [session, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
