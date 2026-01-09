import { useGames } from "@/contexts/GamesContext"
import { useLang } from "@/contexts/LanguageContext"
import { useRentals } from "@/contexts/RentalsContext"
import { Rent } from "@/types/rentalContext"
import { useState } from "react"
import { CustomFormInput } from "../Helpers/FormInput"
import { RentalAutocomplete } from "./RentalAutocomplete"
import { IGame } from "@/interfaces/game"

type RentalFormType = {
    handleError: (message: string)=> any
    handleSuccess: (message: string)=> any
    gameId?: number
}

export const RentalForm = ({handleError, handleSuccess, gameId}: RentalFormType) => {
    const { rentalAction } = useRentals()
    const { games } = useGames()
    const { language } = useLang()

    const [isProcessing, setIsProcessing] = useState(false)
    const [person, setPerson] = useState("")
    const [game, setGame] = useState<IGame | undefined>(()=>{
        return games.find((g) => (g.id === gameId))
    })

    /**
     * Handle adding a new rental
     * @param {React.FormEvent<HTMLFormElement>} e - Form event
     */
    const handleAddRental = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsProcessing(true)

        const idPersonRegex = /^(?:\d{6}|SD\d{4}|\+?[0-9]{7,15})$/;
        if (!idPersonRegex.test(person)) {
            handleError(language.invalidAlbumNumberFormat);
            setIsProcessing(false);
            return;
        }

        if (!game){
            handleError(language.gameNotFound);
            setIsProcessing(false);
            return;
        }

        const data: Rent = {
            index: person,
            game: game,
            rentedAt: new Date(Date.now())
        }

        rentalAction(
            "add", 
            data, 
            () => handleSuccess(language.gameRented),
            (err: Error) => handleError(err.cause == 406 ? language.rentGameError : language.serverError)
        )
        
        setIsProcessing(false)
    }

    return (
        <form onSubmit={handleAddRental} className="space-y-4">
            <CustomFormInput name="personId" label={language.indexNumber} value={person} type="text" changeHandler={(e) => setPerson(e.target.value)} placeholder={language.indexNumber}/>

            <RentalAutocomplete games={games} label={language.gameTitle} value={game} changeHandler={setGame} placeholder={language.gameTitle}/>

            <button
                type="submit"
                disabled={isProcessing || !game || games.find((g)=>g.id == game.id)!.quantity < 1 || !person }
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
                {isProcessing ? language.gameAdding : language.addRent}
            </button>
        </form>
    );
}