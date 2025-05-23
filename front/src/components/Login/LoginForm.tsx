import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { FormEvent, useEffect, useState } from "react";
import ErrorField from "../Messages/ErrorField";

type LoginFormType = {
  isRegister?: boolean
}

export const LoginForm = ({isRegister}: LoginFormType) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { signIn, register } = useAuth();
  const { language } = useLang();
  
  const validate = () =>{
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(language.invalidEmail);
      return false;
    }

    if (password.length < 6) {
      setError(language.passwordTooShort);
      return false;
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
    setLoading(true)

    if(!validate()){
      setLoading(false)
      return;
    }

    if(isRegister)
      register({email: email, password: password})
        .catch((err: Error)=>setError(err.cause == 400 ? language.userAlreadyExists : language.serverError))
    else
      signIn({email: email, password: password})
        .catch((err: Error)=>{
          setError(err.cause == 400 ? language.loginError : language.serverError)
        })

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {language.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            maxLength={255}
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
            maxLength={255}
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
          {loading ? language.loginLoading : (isRegister ? language.register : language.login)}
        </button>
      </div>
    </form>
  );
}