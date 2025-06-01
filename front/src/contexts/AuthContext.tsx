"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from "jwt-decode";
import { IUserApi, Method, request } from '@/interfaces/api';
import { Perms, toPerms } from '@/interfaces/perms';
import { AuthContextType, LoggedUserType, LoginDataType } from '@/types/authContext';
import { chechCookie, deleteCookie, getCookie, setCookie } from '@/app/actions';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<LoggedUserType | null>(null);
  const [JWT, setJWT] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Perms>(Perms.U);

  const router = useRouter();

  useEffect(() => {
    setLoading(true)
    getLocalUser()    
    setLoading(false)
  }, []);

  const getLocalUser = async () =>{
    if(await chechCookie('Authorization')){
      await handleAuthSuccess(`${(await getCookie('Authorization'))?.value}`)
    }
  }

  const saveLocalUser = async (token: string, exp: number) =>{
    await setCookie('Authorization', token, exp)
  }

  const clearLocalUser = async () =>{
    await deleteCookie('Authorization')
  }

  const handleAuthSuccess = async (token: string) => {
    const loggedUser = jwtDecode<LoggedUserType>(token)
    const perms = toPerms(loggedUser.permissions);

    if(Date.now() > loggedUser.exp * 1000){
      signOut();
      return
    }

    if(!(await chechCookie('Authorization'))){
      await saveLocalUser(token, loggedUser.exp)
    }

    setUser(loggedUser);
    setJWT(token);
    setPermissions(perms);
  };

  const register = async (data: LoginDataType) => {
    setLoading(true)

    return request<IUserApi>('auth/register', Method.POST, JSON.stringify(data))
      .then(({token})=>{handleAuthSuccess(token)})
      .finally(()=>{setLoading(false)})
  };
  
  const signIn = async (data: LoginDataType) => {
    setLoading(true)

    return request<IUserApi>('auth/login', Method.POST, JSON.stringify(data))
      .then(({token})=>{handleAuthSuccess(token)})
      .finally(()=>{setLoading(false)})
  };

  const signOut = async () => {
    setLoading(true)
    await clearLocalUser();
    setUser(null);
    setJWT(null);
    setLoading(false)
    router.push('/')
  };

  const contextValue = {
    loading,
    user,
    JWT,
    permissions,
    register,
    signIn,
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
