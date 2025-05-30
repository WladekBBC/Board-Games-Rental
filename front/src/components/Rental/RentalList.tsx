import { useAuth } from "@/contexts/AuthContext"
import { useGames } from "@/contexts/GamesContext"
import { useLang } from "@/contexts/LanguageContext"
import { useRentals } from "@/contexts/RentalsContext"
import { Perms } from "@/interfaces/perms"
import { IRental } from "@/interfaces/rental"
import { useRouter } from "next/router"
import { useState } from "react"
import { SingleRental } from "./SingleRental"

type RentalListType = {
    rentals: IRental[]
    handleError: (message: string) => any
    handleSuccess: (message: string) => any
}

export const RentalList = ({handleError, handleSuccess, rentals}: RentalListType) =>{
    const { sortConfig, setSortConfig } = useRentals()
    const { language } = useLang()

    /**
     * Handle sort
     * @param {string} key - Key
     */
    const handleSort = (key: 'rentedAt' | 'title' | 'index') => {
        if (sortConfig.key === key) {
        setSortConfig({
            key,
            direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
        } else {
        setSortConfig({
            key,
            direction: 'asc'
        });
        }
    };

    return (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th 
              className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer whitespace-nowrap"
              onClick={() => handleSort('index')}
            >
              {language.indexNumber} {sortConfig.key === 'index' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer whitespace-nowrap"
              onClick={() => handleSort('title')}
            >
              {language.gameTitle} {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer whitespace-nowrap hidden sm:table-cell"
              onClick={() => handleSort('rentedAt')}
            >
              {language.rentDate} {sortConfig.key === 'rentedAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
              {language.returnDate}
            </th>
            <th className="px-2 sm:px-6 py-3 text-right font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
              {language.actions}
            </th>
          </tr>
        </thead>
        
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {rentals.map(rental => (
            <SingleRental rental={rental} handleError={handleError} handleSuccess={handleSuccess} key={rental.id}/>
          ))}
        </tbody>
      </table>
    )
}