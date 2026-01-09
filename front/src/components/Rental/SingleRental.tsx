import { useAuth } from "@/contexts/AuthContext"
import { useGames } from "@/contexts/GamesContext"
import { useLang } from "@/contexts/LanguageContext"
import { useRentals } from "@/contexts/RentalsContext"
import { Perms } from "@/interfaces/perms"
import { IRental } from "@/interfaces/rental"

type SingleRentalType = {
    rental: IRental
    handleError: (message: string) => any
    handleSuccess: (message: string) => any
}

export const SingleRental = ({handleSuccess, handleError, rental}: SingleRentalType) =>{
    const { rentalAction } = useRentals()
    const { games, changeQuantity } = useGames()
    const { language } = useLang()
    const { permissions } = useAuth()

    /**
     * Handle returning a game
     * @param {IRental} rental - Rental
     */
    const handleReturnGame = async (rental: IRental) => {
        rentalAction(
            "return", 
            {id: rental.id}, 
            () => handleSuccess(language.gameReturned), 
            (err: Error) => handleError(err.cause == 406 ? language.returnGameError : language.fetchError)
        )
    }

    /**
     * Handle deleting a rental
     * @param {IRental} rental - Rental
     */
    const handleDeleteRental = async (rental: IRental) => {
        rentalAction(
            "delete", 
            {id: rental.id}, 
            () => handleSuccess(language.deletedGame), 
            (err: Error) => handleError(err.cause == 406 ? language.deleteGameError : language.serverError)
        )
    }

    return (
        <tr key={rental.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-2 sm:px-6 py-4 align-top max-w-[120px] truncate">{rental.index}</td>
            <td className="px-2 sm:px-6 py-4 align-top max-w-[180px] truncate">{games.find(g => g.id === rental.game.id)?.title || language.unknownGame}</td>
            <td className="px-2 sm:px-6 py-4 align-top hidden md:table-cell">{new Date(rental.rentedAt).toLocaleDateString()}</td>
            <td className="px-2 sm:px-6 py-4 align-top hidden lg:table-cell">{rental.returnedAt ? new Date(rental.returnedAt).toLocaleDateString() : '-'}</td>
            <td className="px-2 sm:px-6 py-4 align-top text-right space-x-2">
                {!rental.returnedAt && (
                    <button
                    onClick={() => handleReturnGame(rental)}
                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-2 disabled:opacity-50 text-xs sm:text-sm"
                    >
                    {language.return}
                    </button>
                )}
                {permissions.includes(Perms.A) && (
                    <button
                    onClick={() => handleDeleteRental(rental)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 text-xs sm:text-sm"
                    >
                    {language.deleteGame}
                    </button>
                )}
            </td>
        </tr>
    );
}