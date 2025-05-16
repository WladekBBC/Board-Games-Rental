import { IRental } from "@/interfaces/rental"

export type SortConfig = {
  key: 'rentedAt' | 'title' | 'index';
  direction: 'asc' | 'desc';
}

export type SearchType = 'index' | 'title' | 'date';

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