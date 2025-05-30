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
    const { addRental } = useRentals()
    const { games, changeQuantity } = useGames()
    const { language } = useLang()

    const [isProcessing, setIsProcessing] = useState(false)
    const [person, setPerson] = useState("")
    const [game, setGame] = useState<IGame | undefined>(games.find((g)=>(g.id === gameId)))

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

        addRental(data).then(()=>{
            handleSuccess(language.gameRented)
            changeQuantity(game.id, games.find((g)=>g.id == game.id)!.quantity - 1)
        }).catch((err: Error)=>{
            handleError(err.cause == 406 ? language.rentGameError : language.serverError)
        })
        
        setIsProcessing(false)
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{language.addRent}</h2>
            <form onSubmit={handleAddRental} className="space-y-4">
                <CustomFormInput name="personId" label={language.indexNumber} value={person} type="text" changeHandler={(e) => setPerson(e.target.value)} placeholder={language.indexNumber}/>

                <RentalAutocomplete games={games} label={language.gameId} value={game?.title} changeHandler={setGame}/>

                <button
                    type="submit"
                    disabled={isProcessing || !game || games.find((g)=>g.id == game.id)!.quantity < 1 || !person }
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isProcessing ? language.gameAdding : language.addRent}
                </button>
            </form>
        </div>
    );
}