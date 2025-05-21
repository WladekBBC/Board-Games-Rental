'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LanguageContext';
import { Spinner } from '@/components/Messages/Spinner';
import SignInForm from '@/components/Authorisation/SignForm'
/**
 * LoginPage component that handles user authentication
 */
export default function LoginPage() {
  const { user, loading } = useAuth();
  const { language } = useLang();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {language.LoginToService}
        </h2>
        <SignInForm />
        {/* Można odkomentować poniżej, jeśli chcesz logowanie przez Google */}
        {/* <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              {language.or}
            </span>
          </div>
        </div>
        <SignInWithGoogle /> */}
      </div>
    </div>
  );
}
