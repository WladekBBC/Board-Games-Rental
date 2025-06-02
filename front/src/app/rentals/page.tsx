'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRentals } from '@/contexts/RentalsContext'
import { useLang } from '@/contexts/LanguageContext'
import ErrorField from '@/components/Messages/ErrorField'
import SuccessField from '@/components/Messages/SuccessField'
import { Spinner } from '@/components/Messages/Spinner'
import { Perms } from '@/interfaces/perms'
import { SearchBar } from '@/components/SearchBar'
import { RentalForm } from '@/components/Rental/RentalForm'
import { RentalList } from '@/components/Rental/RentalList'
import { useLoading } from '@/contexts/LoadingContext'

/**
 * Rentals page, if user isn't logged, or doesn't have permissions, moves to home page
 * If games are still loading, returns Spinner
 * @returns {React.ReactNode}
 */
export default function RentalsPage() {
  const { permissions } = useAuth()
  const { searchQuery, searchType, filteredAndSortedRentals, setSearchQuery, setSearchType } = useRentals()
  const { loading } = useLoading()
  const [ error, setError ] = useState<string | null>('')
  const [ success, setSuccess ] = useState<string | null>(null)
  const { language } = useLang()
  
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

  if (!loading && [Perms.A, Perms.R].includes(permissions))
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{language.manageRent}</h1>

        {error && (<ErrorField error={`${error}`}/>)}

        {success && (<SuccessField success={`${success}`}/>)}


        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{language.addRent}</h2>
          <RentalForm handleError={handleError} handleSuccess={handleSuccess}/>
        </div>

        <SearchBar
              options={[
                { value: 'title', label: language.searchByTitle },
                { value: 'index', label: language.searchByIndex },
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
  return <Spinner/>
} 