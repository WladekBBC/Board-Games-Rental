import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { Link } from "lucide-react";
import { useState, FormEvent } from "react";
import ErrorField from "../Messages/ErrorField";

export default function SignInForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn, error, loading } = useAuth();
    const { language } = useLang();
  
    const handleSignIn = (ev:FormEvent<HTMLFormElement>) =>{
      ev.preventDefault();
      signIn({email, password})
    }
  
    return (
      <form onSubmit={(e)=>handleSignIn(e)} className="mt-8 space-y-6">
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
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:focus:ring-offset-gray-800"
          >
            {loading ? language.loginLoading : language.login}
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
