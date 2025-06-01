'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LanguageContext';
import { LoginForm } from '@/components/Login/LoginForm';
import Link from 'next/link';
import { Spinner } from '@/components/Messages/Spinner';
import { useLoading } from '@/contexts/LoadingContext';

/**
 * Login page, if user is logged, moving to home page
 * @returns {React.ReactNode}
 */
export default function LoginPage() {
  const { JWT } = useAuth();
  const { language } = useLang();
  const { loading } = useLoading()

  if(!JWT && !loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {language.LoginToService}
          </h2>
          <LoginForm />

          <div className="flex items-center justify-between">
            <Link href="/register">
              <div className="text-blue-500 hover:text-blue-700">{language.register}</div>
            </Link>
          </div>
        </div>
      </div>
    );
  return <Spinner/>
}