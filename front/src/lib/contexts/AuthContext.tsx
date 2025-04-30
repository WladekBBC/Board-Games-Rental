"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { redirect, useRouter } from 'next/navigation'
import { signInWithGoogle as firebaseSignInWithGoogle, logoutUser } from '@/lib/firebase/firebaseUtils'
import { jwtDecode } from "jwt-decode";
import { useLang } from './LanguageContext';

export enum Perms{
  A = "Admin",
  R = "RWSS", 
  U = "User"
}

export const toPerms = (perm: string): Perms =>{
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

export interface ApiData{
  token: string,
  permissions: string,
}

interface AuthContextType {
  user: User | null;
  JWT: string | null;
  permissions: Perms;
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
  const [permissions, setPermissions] = useState<Perms>(Perms.U);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { language } = useLang()

  useEffect(() => {
    getLocalUser()
    setLoading(false);
  }, []);

  const getLocalUser = () =>{
    if(localStorage.getItem('JWT')){
      let jwt = localStorage.getItem('JWT')+''
      let perms:Perms = toPerms(`${localStorage.getItem('perms')}`);
      handleAuthSuccess({token: jwt, permissions: perms})
    }
  }

  const saveLocalUser = (data: ApiData) =>{
    if(data){
      localStorage.setItem('JWT', data.token)
      localStorage.setItem('perms', data.permissions ? data.permissions : Perms.U)
    }
  }

  const clearLocalUser = () =>{
    localStorage.removeItem('JWT')
    localStorage.removeItem('perms')
  }

  const handleAuthSuccess = async (data: ApiData) => {
    if(data){
      const loggedUser = jwtDecode<User>(data.token)
      setUser(loggedUser);
      setJWT(data.token);
      setPermissions(toPerms(data.permissions));
      saveLocalUser(data)
      router.push('/')
    }
  };

  const handleAuthError = (err: Error|any) => {
    let errorMessage = 'Unknown error'
    if(err instanceof Error)
      switch(err.cause){
        case (400): 
          errorMessage = language.loginError
          break;
        case (500):
          errorMessage = language.serverError
      }
    setError(errorMessage);
    throw err;
  };

  
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    let data = {email: email, password: password}

    fetch('http://localhost:3001/auth/login', {method: "POST", headers: {"Content-Type": "application/json"} , body: JSON.stringify(data), mode:'cors'})
    .then((res: Response)=>{
      if(res.ok)
        return res.json();
      return Promise.reject(new Error(res.statusText, {cause: res.status}))
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
      router.push('/')
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
