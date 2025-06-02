'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useLang } from '@/contexts/LanguageContext';
import { LoginForm } from '@/components/Login/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/Messages/Spinner';
import { useLoading } from '@/contexts/LoadingContext';
import { useRouter } from 'next/navigation';

/**
 * Register page, if user is logged, moving to home page
 * @returns {React.ReactNode}
 */
export default function RegisterPage (){
  const { language } = useLang();
  const { JWT } = useAuth();
  const { loading } = useLoading()
  const router = useRouter();

  useEffect(()=>{
    if(JWT && !loading)
      router.push('/')
  }, [JWT, loading])
  
  if(!JWT && !loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {language.register}
          </h2>

          <LoginForm isRegister={true}/>

          <div className="flex items-center justify-between">
            <Link href="/login">
              <div className="text-blue-500 hover:text-blue-700">{language.login}</div>
            </Link>
          </div>
        </div>
      </div>
    );
  return <Spinner/>
}