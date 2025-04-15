"use client";

import { createContext, useContext, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithGoogle as firebaseSignInWithGoogle, logoutUser } from '@/lib/firebase/firebaseUtils'

export interface User {
  email: string | null;
  isAdmin: boolean;
  uid?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Список email-адрес адміністраторів
const ADMIN_EMAILS = ['kurwbober@gmail.com', 'admin@example.com']

// Функції для роботи з localStorage
const saveUserToStorage = (user: User | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  } catch (error) {
    console.error('Помилка при збереженні користувача:', error);
  }
};

const getUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getUserFromStorage());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuthSuccess = async (userData: User) => {
    setUser(userData);
    saveUserToStorage(userData);
    await router.replace('/');
  };

  const handleAuthError = (err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : 'Помилка аутентифікації';
    setError(errorMessage);
    console.error('Помилка аутентифікації:', err);
    throw err;
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!email || !password) {
        throw new Error('Email та пароль обов\'язкові');
      }

      // Тестова логіка для демонстрації
      if (email === 'admin@example.com' && password === 'admin123') {
        await handleAuthSuccess({
          email,
          isAdmin: true,
          uid: 'admin-uid'
        });
      } else if (email === 'user@example.com' && password === 'user123') {
        await handleAuthSuccess({
          email,
          isAdmin: false,
          uid: 'user-uid'
        });
      } else {
        throw new Error('Невірний email або пароль');
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await firebaseSignInWithGoogle();
      
      if (!result?.email) {
        throw new Error('Не вдалося отримати email від Google');
      }

      await handleAuthSuccess({
        email: result.email,
        isAdmin: ADMIN_EMAILS.includes(result.email),
        uid: result.uid
      });
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await logoutUser();
      setUser(null);
      saveUserToStorage(null);
      await router.replace('/login');
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    user,
    loading,
    error,
    signIn,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
