import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile via Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);


  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Ошибка входа:', error);
      throw error;
    }
  };

  const register = async (email, password, name) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      setUser({ ...result.user });
      return result;
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      throw error;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const loginWithProvider = async (provider) => {
    try {
      // Google uses redirect, Facebook uses popup
      if (provider === googleProvider) {
        return await signInWithRedirect(auth, provider);
      } else {
        return await signInWithPopup(auth, provider);
      }
    } catch (error) {
      console.error('Ошибка входа через провайдера:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loginWithProvider,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}