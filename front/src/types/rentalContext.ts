import { IRental } from "@/interfaces/rental"

export type RentalsContextType = {
    rentals: IRental[]
    loading: boolean
    addRental: (rental: Rent) => Promise<any>
    returnGame: (id: number) => Promise<any>
}

export type Rent = Omit<IRental, 'id' | 'returnedAt'>