import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from current session and subscribe to changes
  useEffect(() => {
    let isMounted = true;

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (isMounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const register = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  /**
   * OAuth via provider name: 'google' | 'facebook' | 'github' | ...
   */
  const loginWithProvider = async (provider) => {
    // Always send users back to the current site after OAuth completes
    const redirectTo = window.location.origin;

    // Some providers (e.g., Facebook) may require explicit scopes
    const options = { redirectTo };
    if (provider === 'facebook') {
      options.scopes = 'email';
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options,
    });
    if (error) throw error;
    return data;
  };

  const loginWithGoogle = () => loginWithProvider('google');
  const loginWithFacebook = () => loginWithProvider('facebook');

  const value = { user, loading, login, register, logout, loginWithProvider, loginWithGoogle, loginWithFacebook };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}