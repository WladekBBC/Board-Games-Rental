import { IRental } from "@/interfaces/rental"

export type SortConfig = {
  key: 'rentedAt' | 'title' | 'index';
  direction: 'asc' | 'desc';
}

export type SearchType = 'index' | 'title' | 'date';

/**
 * Rentals context type
 * @param {IRental[]} rentals - Rentals
 * @param {boolean} loading - Loading
 * @param {function} addRental - Add rental
 * @param {function} returnGame - Return game
 * @param {function} removeRental - Remove rental
 * @param {SortConfig} sortConfig - Sort config
 * @param {function} setSortConfig - Set sort config
 * @param {string} searchQuery - Search query
 * @param {function} setSearchQuery - Set search query
 * @param {SearchType} searchType - Search type
 * @param {function} setSearchType - Set search type
 * @param {IRental[]} filteredAndSortedRentals - Filtered and sorted rentals
 */
export type RentalsContextType = {
    rentals: IRental[]
    loading: boolean
    addRental: (rental: Rent) => Promise<any>
    returnGame: (id: number) => Promise<any>
    removeRental: (id: number) => Promise<any>
    sortConfig: SortConfig
    setSortConfig: (config: SortConfig) => void
    searchQuery: string
    setSearchQuery: (query: string) => void
    searchType: SearchType
    setSearchType: (type: SearchType) => void
    filteredAndSortedRentals: IRental[]
}

export type Rent = Omit<IRental, 'id' | 'returnedAt'>