import React, { createContext, useContext, useMemo, useState } from "react";

// Local-only auth stub (Supabase removed).
// Keeps the app compiling if some pages still import/use auth.

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user] = useState(null);

  const value = useMemo(
    () => ({
      user,
      loading: false,
      login: async () => ({ ok: false, error: "Auth disabled" }),
      register: async () => ({ ok: false, error: "Auth disabled" }),
      logout: async () => ({ ok: true }),
      loginWithProvider: async () => ({ ok: false, error: "Auth disabled" }),
      loginWithGoogle: async () => ({ ok: false, error: "Auth disabled" }),
      loginWithFacebook: async () => ({ ok: false, error: "Auth disabled" }),
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  return (
    ctx || {
      user: null,
      loading: false,
      login: async () => ({ ok: false, error: "Auth disabled" }),
      register: async () => ({ ok: false, error: "Auth disabled" }),
      logout: async () => ({ ok: true }),
      loginWithProvider: async () => ({ ok: false, error: "Auth disabled" }),
      loginWithGoogle: async () => ({ ok: false, error: "Auth disabled" }),
      loginWithFacebook: async () => ({ ok: false, error: "Auth disabled" }),
    }
  );
}