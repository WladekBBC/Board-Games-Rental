"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithGoogle as firebaseSignInWithGoogle, logoutUser } from '@/lib/firebase/firebaseUtils'
import { jwtDecode } from "jwt-decode";

export enum Perms{
  A = "Admin",
  R = "RWSS", 
  U = "User"
}

export interface User {
  id: number,
  email: string
  password ?: string,
  permissions ?: Perms
}

interface AuthContextType {
  user: User | null;
  JWT: string | null;
  permissions: string | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [JWT, setJWT] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Perms | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  
  useEffect(() => {
    setLoading(false);
  }, []);

  const handleAuthSuccess = async (userData: User) => {
    setUser(userData);
    await router.replace('/');
  };

  const handleAuthError = (err: unknown) => {
    
    const errorMessage = err instanceof Error ? err.message : 'Помилка аутентифікації';
    setError(errorMessage);
    console.error('Помилка аутентифікації:', err);
    throw err;
  };

  
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    let data = {email: email, password: password}

    fetch('http://localhost:3001/auth/login', {method: "POST", headers: {"Content-Type": "application/json"} , body: JSON.stringify(data), mode:'cors'}).then((res: Response)=>{
      if(res.ok)
        return res.json();
    }).then((data)=>{
      setJWT(data.token);
      setPermissions(data.permissions);
      const logged:User = jwtDecode(data.token);
      setUser(logged)
    }).catch((error)=>{
      handleAuthError(error)
    })

    setLoading(false);

  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await firebaseSignInWithGoogle();
      
      if (!result?.email) {
        throw new Error('Не вдалося отримати email від Google');
      }

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
    JWT,
    permissions,
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

export function useAuth() :AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
