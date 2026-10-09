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
 * @param {function} rentalAction - Action on Rental, "add", "return" and "delete", with data, and success and error handlers
 * @param {function} queueAction - Action on Queue, "getQueueStatus", "joinQueue", "leaveQueue"
 * @param {function} onQueueJoined - Subscribe to queueJoined event for specific game
 * @param {function} onQueueUpdated - Subscribe to queueUpdated event for specific game
 * @param {function} onAutoRented - Subscribe to autoRented event for specific game
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
    rentalAction: (action: "add" | "return" | "delete", data: Partial<IRental>, handleSuccess: () => any, handleError: (val: Error) => any) => void
    queueAction: (action: "getQueueStatus" | "joinQueue" | "leaveQueue", data: { gameId: number }, handleSuccess: (res: any) => void, handleError?: (error: Error) => void) => void
    onQueueJoined: (gameId: number, handler: (data: { position: number }) => void) => () => void
    onQueueUpdated: (gameId: number, handler: (data: { position: number }) => void) => () => void
    onAutoRented: (gameId: number, handler: () => void) => () => void
    sortConfig: SortConfig
    setSortConfig: (config: SortConfig) => void
    searchQuery: string
    setSearchQuery: (query: string) => void
    searchType: SearchType
    setSearchType: (type: SearchType) => void
    filteredAndSortedRentals: IRental[]
}

export type Rent = Omit<IRental, 'id' | 'returnedAt'>