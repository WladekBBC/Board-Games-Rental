'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LanguageContext';
import ErrorField from '@/components/Messages/ErrorField';
import { LoginForm } from '@/components/Login/LoginForm';

const RegisterPage = () => {
  const router = useRouter();
  const { register } = useAuth();
  const { language } = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    
    register({email: email, password: password}).catch((err: Error)=>{
      setError(language.userAlreadyExists)
    })


  }

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
};

export default RegisterPage;
