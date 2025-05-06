'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useLang } from '@/lib/contexts/LanguageContext';
import ErrorField from '@/components/Messages/ErrorField';
import { Spinner } from '@/components/Messages/Spinner';
import { hash } from 'bcrypt';
/**
 * LoginPage component that handles user authentication
 */
export default function LoginPage() {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLang();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  if (authLoading) return <Spinner />;

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

/**
 * Login form
 */
function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, error, loading: authLoading } = useAuth();
  const { language } = useLang();

  return (
    <form onSubmit={()=>signIn({email, password})} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {language.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder={language.email}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {language.password}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder={language.password}
          />
        </div>
      </div>

      <ErrorField error={error} />

      <div className="space-y-4">
        <button
          type="submit"
          disabled={authLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:focus:ring-offset-gray-800"
        >
          {authLoading ? language.loginLoading : language.login}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <Link href="/register" className="text-blue-500 hover:text-blue-700">
          {language.register}
        </Link>
      </div>
    </form>
  );
}