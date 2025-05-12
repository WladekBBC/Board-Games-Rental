import { useGames } from "@/contexts/GamesContext"
import { IGame } from "@/interfaces/game"
import Image from 'next/image'
import { imageLoader } from '@/lib/utils/imageLoader'
import { useLang } from "@/contexts/LanguageContext"
import { useState } from "react"
import { EditGameForm } from "./EditGameForm"
import { motion, AnimatePresence } from 'framer-motion'


type GameProp = {
    game: IGame
    actions?: boolean
}

export const SingleGame = ({game, actions}: GameProp) =>{
    const { language } = useLang()
    const { deleteGame } = useGames()
    
    const [editingGame, setEditingGame] = useState<IGame | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const handleDeleteGame = async (id: number) => {
        setIsProcessing(true)
        await deleteGame(id)
        setIsProcessing(false)
        setShowDeleteConfirm(false)
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
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{game.title}</h3>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{game.description}</div>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{game.category}</span>
                        <div className="flex flex-col items-end">
                            <span className={`text-sm ${game.quantity && game.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {game.quantity && game.quantity > 0 ? language.gameAvailable : language.gameUnavailable}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {language.available}: {game.quantity} / {game.amount}
                            </span>
                        </div>
                    </div>
                    {actions && (
                        <div className="mt-4 flex justify-end space-x-2">
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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full"
                        >
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{language.confirmDelete}?</h3>
                            <div className="text-gray-600 dark:text-gray-300 mb-6">
                                {language.confirmDelete} {game.title}?
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleDeleteGame(game.id)}
                                    disabled={isProcessing}
                                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {isProcessing ? language.loading : language.deleteGame}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={isProcessing}
                                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {language.cancel}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}