'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { redirect } from 'next/navigation'
import { useLang } from '@/lib/contexts/LanguageContext'
import ErrorField from '@/components/Messages/ErrorField'
import { Spinner } from '@/components/Messages/Spinner'
/**
 * LoginPage component that handles user authentication
 * @returns {JSX.Element} The login page with email/password and Google sign-in options
 */
export default function LoginPage() {
  const { user, loading: authLoading } = useAuth()
  const { language } = useLang()

  /**
   * Redirect to home page if user is logged
   */
  useEffect(() => {
    if (user)
      redirect('/')
  }, [user])

  if(!authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <div>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              {language.LoginToService}
            </h2>
          </div>
          <SignInForm/>

          {/* <div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  {language.or}
                </span>
              </div>
            </div>
            <SignInWithGoogle/>
          </div> */}

        </div>
      </div>
    )
  return (
    <Spinner/>
  )
} 

/**
 * Login form
 * @returns {JSX.Element} Login form
 */
function SignInForm(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, error, loading: authLoading } = useAuth()
  const { language } = useLang()

  /**
   * Handles the form submission for email/password login
   * @param {React.FormEvent} e - The form submission event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    signIn(email, password)
  }
  
  return(
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Email"
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

      <ErrorField error={error}/>

      <div className="space-y-4">
        <button
          type="submit"
          disabled={authLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:focus:ring-offset-gray-800"
        >
          {authLoading ? language.loginLoading : language.login}
        </button>
      </div>
    </form>
  )
}

/**
 * Button for signing with Google
 * @returns {JSX.Element} Google button
 */
function SignInWithGoogle(){

  const { signInWithGoogle, loading } = useAuth()
  const { language } = useLang()

  /**
   * Handles Google authentication
   * @returns {Promise<void>}
   */
  const handleGoogleSignIn = async () => {
    signInWithGoogle().then(()=>{
      redirect('/')
    })
  }

  return (
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:focus:ring-offset-gray-800"
      >
      <svg className="h-5 w-5 text-gray-700 dark:text-gray-300 mr-2" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
        />
      </svg>
      {language.loginWithGoogle}
    </button>
  )
}