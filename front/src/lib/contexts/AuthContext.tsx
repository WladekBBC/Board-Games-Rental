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

export const transferToPerms = (perm: string): Perms =>{
  if(perm == Perms.A)
    return Perms.A
  else if(perm == Perms.R)
    return Perms.R
  else
    return Perms.U
}

export interface User {
  id: number,
  email: string
  password ?: string,
  permissions ?: Perms
}

export interface ApiData extends User{
  token: string,
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
    getLocalUser()
    setLoading(false);
  }, []);

  const getLocalUser = () =>{
    if(localStorage.getItem('user')){
      let jwt = localStorage.getItem('user')+''
      let user:User = {...JSON.parse(localStorage.getItem('user')+"")}
      let perms:Perms = transferToPerms(localStorage.getItem('user')+"");

      handleAuthSuccess({...user, token: jwt, permissions: perms})
    }
  }

  const saveLocalUser = (data: ApiData) =>{
    if(data){
      localStorage.setItem('user', JSON.stringify({id: data.id, email: data.email}))
      localStorage.setItem('JWT', data.token)
      localStorage.setItem('perms', data.permissions ? data.permissions : Perms.U)
    }
  }

  const clearLocalUser = () =>{
    localStorage.removeItem('user')
    localStorage.removeItem('JWT')
    localStorage.removeItem('perms')
  }

  const handleAuthSuccess = async (data: ApiData) => {
    setUser({id: data.id, email: data.email});
    setJWT(data.token);
    setPermissions(data.permissions ? data.permissions : Perms.U);
    saveLocalUser(data)
    await router.replace('/');
  };

  const handleAuthError = (err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    setError(errorMessage);
    throw err;
  };

  
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    let data = {email: email, password: password}

    fetch('http://localhost:3001/auth/login', {method: "POST", headers: {"Content-Type": "application/json"} , body: JSON.stringify(data), mode:'cors'}).then((res: Response)=>{
      if(res.ok)
        return res.json();
    }).then((data: ApiData)=>{
      handleAuthSuccess(data)
    }).catch((error)=>{
      handleAuthError(error)
    })
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    // TODO: Remove logging via google or move it into api
    // try {
    //   setLoading(true);
    //   setError(null);
      
    //   const result = await firebaseSignInWithGoogle();
      
    //   if (!result?.email) {
    //     throw new Error('Не вдалося отримати email від Google');
    //   }

    // } catch (err) {
    //   handleAuthError(err);
    // } finally {
    //   setLoading(false);
    // }
  };

  const signOut = async () => {
    clearLocalUser();
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
