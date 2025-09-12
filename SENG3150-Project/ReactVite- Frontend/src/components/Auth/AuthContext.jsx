import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const readStoredToken = () => localStorage.getItem('accessToken') || null;
const writeStoredToken = (t) => (t ? localStorage.setItem('accessToken', t) : localStorage.removeItem('accessToken'));

// (optional) quick JWT exp check to decide if we should refresh
const isExpired = (jwt) => {
  try {
    const [, payload] = jwt.split('.');
    const { exp } = JSON.parse(atob(payload));
    if (!exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return exp <= now;
  } catch {
    return true; // treat non-JWT as expired
  }
};

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => readStoredToken());
  const [loading, setLoading] = useState(true);

  // Persist whenever token changes
  useEffect(() => {
    writeStoredToken(accessToken);
  }, [accessToken]);

  // On first load: if no token or expired, try refresh using HttpOnly cookie
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!accessToken || isExpired(accessToken)) {
          const res = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include'
          });
          if (res.ok) {
            const data = await res.json();
            if (!cancelled && data?.accessToken) setAccessToken(data.accessToken);
          } else {
            if (!cancelled) setAccessToken(null);
          }
        }
      } catch {
        if (!cancelled) setAccessToken(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  const login = (token) => {
    setAccessToken(token);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {console.log('Logout failed');}
    setAccessToken(null);
  };

  // Optional: fetch helper that adds Authorization and retries once after 401 by refreshing
  const authFetch = useMemo(() => {
    return async (input, init = {}, retry = true) => {
      const headers = new Headers(init.headers || {});
      if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

      const resp = await fetch(input, { ...init, headers, credentials: 'include' });
      if (resp.status !== 401 || !retry) return resp;

      // try refresh once
      const r = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
      if (r.ok) {
        const data = await r.json();
        if (data?.accessToken) {
          setAccessToken(data.accessToken);
          const h2 = new Headers(init.headers || {});
          h2.set('Authorization', `Bearer ${data.accessToken}`);
          return fetch(input, { ...init, headers: h2, credentials: 'include' });
        }
      }
      // still unauthorized
      setAccessToken(null);
      return resp;
    };
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        accessToken,
        setAccessToken,
        login,
        logout,
        loading,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

