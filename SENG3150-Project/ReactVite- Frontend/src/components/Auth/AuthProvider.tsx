import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

let currentToken: string | null = null;
export const getAccessToken = () => currentToken;

// Allow non-React utilities to set the module token (e.g., after refresh in api helper)
export const setAccessTokenExternal = (token: string | null) => {
  currentToken = token;
  if (token) localStorage.setItem('accessToken', token); else localStorage.removeItem('accessToken');
  // Notify this tab so AuthProvider can sync React state immediately
  try { window.dispatchEvent(new CustomEvent('auth-token-updated', { detail: token })); } catch {}
};

function decodeJwt(token: string){
  try { return JSON.parse(atob(token.split('.')[1] || '')); } catch { return null; }
}
function isExpired(token: string | null){
  if(!token) return true;
  const decoded = decodeJwt(token);
  if(!decoded || typeof decoded.exp !== 'number') return true; // treat unknown as expired
  const nowSec = Date.now()/1000;
  return decoded.exp < nowSec; // exp is in seconds
}

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  login: (token: string) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
type AuthProviderProps = { children: React.ReactNode };

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    const stored = localStorage.getItem('accessToken');
    if(stored && !isExpired(stored)) return stored; // only restore if valid
    if(stored) localStorage.removeItem('accessToken');
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Sync module var + persistence
  useEffect(() => {
    currentToken = accessToken;
    if (accessToken) localStorage.setItem('accessToken', accessToken); else localStorage.removeItem('accessToken');
  }, [accessToken]);

  // Listen for external token updates (from api helper refresh) in this tab
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string | null>).detail;
      setAccessToken(detail ?? null);
    };
    window.addEventListener('auth-token-updated', handler as EventListener);
    return () => window.removeEventListener('auth-token-updated', handler as EventListener);
  }, []);

  // Attempt refresh once on mount (only if we don't already have a valid token)
  useEffect(() => {
    (async () => {
      if(accessToken && !isExpired(accessToken)) { setLoading(false); return; }
      try {
        const res = await fetch("/api/auth/refresh", { method: "POST", credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if(data.accessToken && !isExpired(data.accessToken)) {
            setAccessToken(data.accessToken);
          } else {
            setAccessToken(null);
          }
        } else {
          setAccessToken(null);
        }
      } catch {
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Expiry watcher: if token expires mid-session, logout
  useEffect(() => {
    if(!accessToken) return;
    const decoded = decodeJwt(accessToken);
    if(!decoded || !decoded.exp) return; // already guarded elsewhere
    const msUntilExpiry = decoded.exp * 1000 - Date.now();
    if(msUntilExpiry <= 0){
      logout();
      return;
    }
    const id = setTimeout(() => logout(), msUntilExpiry + 500); // small buffer
    return () => clearTimeout(id);
  }, [accessToken]);

  // Listen for cross-tab logout/login
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if(e.key === 'accessToken'){
        const val = e.newValue;
        if(!val || isExpired(val)) { setAccessToken(null); } else { setAccessToken(val); }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = (token: string) => { 
    if(isExpired(token)){ return; }
    currentToken = token; 
    setAccessToken(token); 
  };
  const logout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); } catch {}
    currentToken = null;
    setAccessToken(null);
  };

  const isAuthenticated = !!accessToken && !isExpired(accessToken);

  const value = useMemo<AuthContextType>(() => ({
    isAuthenticated,
    accessToken,
    setAccessToken,
    login,
    logout,
    loading,
  }), [isAuthenticated, accessToken, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};