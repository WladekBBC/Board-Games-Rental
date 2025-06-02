'use client'

import { useGames } from "@/contexts/GamesContext"
import { IGame } from "@/interfaces/game"
import Image from 'next/image'
import { imageLoader } from '@/lib/utils/imageLoader'
import { useLang } from "@/contexts/LanguageContext"
import { useState, useEffect } from "react" // Added useEffect
import { EditGameForm } from "./EditGameForm"
import { motion, AnimatePresence } from 'framer-motion'
import DeleteDialog from '@/components/DeleteDialog'
import { useAuth } from '@/contexts/AuthContext'
import { Perms } from '@/interfaces/perms'
import { RentalForm } from "../Rental/RentalForm"
// Assuming you might use useRouter for location.pathname if 'location' global is problematic
// import { usePathname } from 'next/navigation';


type GameProp = {
    game: IGame
    actions?: boolean
}

export const SingleGame = ({ game, actions }: GameProp) => {
    const { language } = useLang()
    const { deleteGame } = useGames()
    const { permissions } = useAuth()
    const [showRentalModal, setShowRentalModal] = useState(false) 
    const [editingGame, setEditingGame] = useState<IGame | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [isGamesPage, setIsGamesPage] = useState(false);
    const [ error, setError ] = useState<string | null>('')
    const [ success, setSuccess ] = useState<string | null>(null)

    useEffect(() => {
        setIsGamesPage(window.location.pathname === "/games");
    }, []);
    
    const handleDeleteGame = async (id: number) => {
        setIsProcessing(true)
        setIsProcessing(false)
        setShowDeleteConfirm(false)
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
   * Handle success message
   * @param {string} successMessage - Success message
   */
  const handleSuccess = (successMessage: string) =>{
    setSuccess(successMessage);
    setTimeout(() => setSuccess(null), 5000);
  }

    return (
        <>
            <div key={game.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden relative">
                <div className="relative h-48 z-0">
                    <Image
                        loader={imageLoader}
                        src={game.imageUrl}
                        alt={game.title}
                        width={800}
                        height={400}
                        className="object-cover w-full h-full" />
                </div>
                <div className="p-4">
                    <div className="inline-flex w-full">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{game.title}</h3>
                        <div className="flex items-center justify-between ml-auto">
                            <div className="flex flex-col">
                                <span className={`text-sm ${game.quantity && game.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {game.quantity && game.quantity > 0 ? language.gameAvailable : language.gameUnavailable}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {language.available}: {game.quantity} / {game.amount}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 min-h-[3em]">{game.description}</div>
                    <span className="bottom-4 left-4 text-sm text-gray-500 dark:text-gray-400 flex-col items-end">{game.category}</span>

                    {!isGamesPage && (permissions === Perms.R || permissions === Perms.A) && (
                        <div className="absolute bottom-2 right-2 space-x-2">
                            <button
                                onClick={() => setShowRentalModal(true)} 
                                className="px-3 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                            >{language.rentMainPage}
                            </button>
                        </div>
                    )}
                    {actions && (
                        <div className=" bottom-4 right-4 mt-4 flex justify-end space-x-2">
                            <button
                                onClick={() => setEditingGame(game)}
                                className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                            >{language.editGame}</button>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={isProcessing}
                                className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 disabled:opacity-50"
                            >{language.deleteGame}</button>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {editingGame && (
                    <EditGameForm
                        game={editingGame}
                        onClose={() => setEditingGame(null)}
                    />
                )}

                {showDeleteConfirm && (
                    <DeleteDialog
                        isOpen={showDeleteConfirm}
                        onClose={() => setShowDeleteConfirm(false)}
                        onConfirm={() => handleDeleteGame(game.id)}
                        title={language.confirmDelete}
                        description={`${language.confirmDelete} ${game.title}?`}
                        confirmText={language.deleteGame}
                        isProcessing={isProcessing}
                    />
                )}

                {showRentalModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowRentalModal(false)} 
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()} 
                        >
                            <RentalForm
                                gameId={game.id}
                                handleError={handleError}
                                handleSuccess={handleSuccess}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

