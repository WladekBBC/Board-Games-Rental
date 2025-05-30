'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useRentals } from '@/contexts/RentalsContext'
import { useGames } from '@/contexts/GamesContext'
import { useLang } from '@/contexts/LanguageContext'
import ErrorField from '@/components/Messages/ErrorField'
import SuccessField from '@/components/Messages/SuccessField'
import { Spinner } from '@/components/Messages/Spinner'
import { Perms } from '@/interfaces/perms'
import { SearchBar } from '@/components/SearchBar'
import { chechCookie } from '../actions' 
import { RentalForm } from '@/components/Rental/RentalForm'
import { RentalList } from '@/components/Rental/RentalList'

/**
 * Rentals page
 * @returns {React.ReactNode}
 */
export default function RentalsPage() {
  const router = useRouter()
  const { permissions, user, loading: authLoading } = useAuth()
  const { 
    loading: rentalsLoading,
    searchQuery,
    setSearchQuery,
    searchType,
    setSearchType,
    filteredAndSortedRentals
  } = useRentals()
  const { loading: gamesLoading } = useGames()
  const [error, setError] = useState<string | null>('')
  const [success, setSuccess] = useState<string | null>(null)
  const { language } = useLang()

  useEffect(() => {
    chechCookie('Authorization').then((res) => {if (!res) router.push("/")})
  }, [user])
  
  /**
   * Handle success message
   * @param {string} successMessage - Success message
   */
  const handleSuccess = (successMessage: string) =>{
    setSuccess(successMessage);
    setTimeout(() => setSuccess(null), 5000);
  }

  /**
   * Handle error message
   * @param {string} errorMessage - Error message 
   */
  const handleError = (errorMessage: string) =>{
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  }

  /**
   * Render loading state if data is still loading
   * @returns {React.ReactNode}
   */
  if (authLoading || rentalsLoading || gamesLoading) {
    return (
      <Spinner/>
    )
  }

  /**
   * If user isnt logged, and doesn't have permissions, 
   */
  if (!user || ![Perms.A, Perms.R].includes(permissions)) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{language.manageRent}</h1>

      {error && (<ErrorField error={`${error}`}/>)}

      {success && (<SuccessField success={`${success}`}/>)}

      <RentalForm handleError={handleError} handleSuccess={handleSuccess}/>

      <SearchBar
            options={[
              { value: 'index', label: language.searchByIndex },
              { value: 'title', label: language.searchByTitle },
              { value: 'date', label: language.searchByDate }
            ]}
            value={searchQuery}
            onValueChange={setSearchQuery}
            selected={searchType}
            onSelectChange={val => setSearchType(val as typeof searchType)}
            placeholder={
              searchType === 'index' ? language.searchByIndex :
              searchType === 'title' ? language.searchByTitle :
              language.searchByDate
            }
            className="mb-4"
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
          <RentalList rentals={filteredAndSortedRentals} handleError={handleError} handleSuccess={handleSuccess}/>
      </div>
    </div>
  )
} 