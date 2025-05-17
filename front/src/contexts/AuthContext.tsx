"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from "jwt-decode";
import { useLang } from './LanguageContext';
import { IUserApi, Method, request } from '@/interfaces/api';
import { Perms, toPerms } from '@/interfaces/perms';
import { AuthContextType, LoggedUserType, LoginDataType } from '@/types/authContext';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoggedUserType | null>(null);
  const [JWT, setJWT] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Perms>(Perms.U);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { language } = useLang()

  useEffect(() => {
    getLocalUser()
  
    if(user?.exp && Date.now() > user.exp * 1000)
      signOut();
    
    setLoading(false);
  }, []);

  const getLocalUser = () =>{
    if(localStorage.getItem('JWT') && localStorage.getItem('perms') ){
      handleAuthSuccess({token: `${localStorage.getItem('JWT')}`, permissions: `${localStorage.getItem('perms')}`})
    }
  }

  const saveLocalUser = (data: IUserApi) =>{
    localStorage.setItem('JWT', data.token)
    localStorage.setItem('perms', data.permissions)
  }

  const clearLocalUser = () =>{
    localStorage.removeItem('JWT')
    localStorage.removeItem('perms')
  }

  const handleAuthSuccess = async (data: IUserApi) => {
    const loggedUser = jwtDecode<LoggedUserType>(data.token)
    const perms = toPerms(data.permissions);

    setUser(loggedUser);
    setJWT(data.token);
    setPermissions(perms);
    saveLocalUser(data)
    router.push('/')
  };

  const handleAuthError = (err: Error) => {
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

  const register = async (data: LoginDataType) => {
    return request<IUserApi>('http://localhost:3001/auth/register', Method.POST, {}, JSON.stringify(data))
      .then((data: IUserApi)=>{
        handleAuthSuccess(data)
      }).catch((error: Error)=>{
        throw error
      })
  };
  
  const signIn = async (data: LoginDataType) => {
    setLoading(true);
    setError(null);

    request<IUserApi>('http://localhost:3001/auth/login', Method.POST, {}, JSON.stringify(data))
      .then((data: IUserApi)=>{
        handleAuthSuccess(data)
      }).catch((error: Error)=>{
        handleAuthError(error)
      })

    setLoading(false);
  };

  const signOut = async () => {
    clearLocalUser();
    setError(null);
    setUser(null);
    router.push('/')
  };

  const contextValue = {
    user,
    loading,
    error,
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
