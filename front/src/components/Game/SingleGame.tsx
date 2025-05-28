import { useGames } from "@/contexts/GamesContext"
import { IGame } from "@/interfaces/game"
import Image from 'next/image'
import { imageLoader } from '@/lib/utils/imageLoader'
import { useLang } from "@/contexts/LanguageContext"
import { useState } from "react"
import { EditGameForm } from "./EditGameForm"
import { motion, AnimatePresence } from 'framer-motion'
import DeleteDialog from '@/components/DeleteDialog'


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

                <DeleteDialog
                    isOpen={showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(false)}
                    onConfirm={() => handleDeleteGame(game.id)}
                    title={language.confirmDelete}
                    description={`${language.confirmDelete} ${game.title}?`}
                    confirmText={language.deleteGame}
                    isProcessing={isProcessing}
                />
            </AnimatePresence>
        </>
    )
}