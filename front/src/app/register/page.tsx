'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useLang } from '@/lib/contexts/LanguageContext';

const RegisterPage = () => {
  const router = useRouter();
  const { language } = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError(language.invalidEmail);
        return;
      }

      if (password.length < 6) {
        setError(language.passwordTooShort);
        return;
      }

      // 🔹 Rejestracja użytkownika z domyślnym permission "U"
      const registerResponse = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, permissions: 'U' }),
      });

      if (!registerResponse.ok) {
        const data = await registerResponse.json();
        setError(data.message || language.registrationFailed);
        return;
      }

      const loginResponse = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        setError(language.loginFailed);
        return;
      }

      const loginData = await loginResponse.json();

      
      localStorage.setItem('token', loginData.token);

      router.push('/login'); 
    } catch (err) {
      console.error('Error:', err);
      setError(language.registrationFailed);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {language.register}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <div className="space-y-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            >
              {language.register}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <Link href="/login">
              <div className="text-blue-500 hover:text-blue-700">{language.login}</div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
