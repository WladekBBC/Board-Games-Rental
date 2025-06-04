'use client'

import { useGames } from "@/contexts/GamesContext"
import { IGame } from "@/interfaces/game"
import Image from 'next/image'
import { imageLoader } from '@/lib/utils/imageLoader'
import { useLang } from "@/contexts/LanguageContext"
import { useState, useEffect } from "react"
import DeleteDialog from '@/components/DeleteDialog'
import { useAuth } from '@/contexts/AuthContext'
import { Perms } from '@/interfaces/perms'
import { RentalForm } from "../Rental/RentalForm"
import { DialogModal } from "../Helpers/DialogModal"
import ErrorField from "../Messages/ErrorField"
import { GameForm } from "./GameForm"

type GameProp = {
    game: IGame
    actions?: boolean
    displayFullDescription?: boolean
}

export const SingleGame = ({ game, actions, displayFullDescription}: GameProp) => {
    const { language } = useLang()
    const { deleteGame } = useGames()
    const { permissions } = useAuth()
    const [showRentalModal, setShowRentalModal] = useState(false)
    const [editingGame, setEditingGame] = useState<boolean>(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [showFullDescriptionModal, setShowFullDescriptionModal] = useState(false);
    const [isGamesPage, setIsGamesPage] = useState(false)
    const [ error, setError ] = useState<string>()
    const descriptionMaxLength = 255;

    useEffect(() => {
        setIsGamesPage(window.location.pathname === "/games");
    }, []);

    const handleDeleteGame = async (id: number) => {
        setIsProcessing(true)
        deleteGame(id)
        setIsProcessing(false)
        setShowDeleteConfirm(false)
    }

    /**
     * Handle error message
     * @param {string} errorMessage - Error message
     */
    const handleError = (errorMessage: string) =>{
        setError(errorMessage);
        setTimeout(() => setError(undefined), 5000);
    }

    /**
     * Handle success message
     * @param {string} successMessage - Success message
     */
    const handleSuccess = () =>{
        setShowRentalModal(false)
    }

    return (
        <>
            <div key={game.id} className={`bg-white dark:bg-gray-800 rounded-lg ${displayFullDescription ? '' : 'shadow-md'} overflow-hidden relative`}>
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
                        <div className="items-center ml-auto inline-flex">
                            <div className="flex flex-col items-end">
                                <span className={`text-sm ${game.quantity && game.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {game.quantity && game.quantity > 0 ? language.gameAvailable : language.gameUnavailable}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                    {language.available}: {game.quantity} / {game.amount}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 mb-2 text-sm text-gray-600 dark:text-gray-300 min-h-[3em]">
                        {displayFullDescription || game.description.length <= descriptionMaxLength
                            ? game.description
                            : `${game.description.slice(0, descriptionMaxLength)}...`}

                        {!displayFullDescription && !showFullDescriptionModal && (game.description.length > descriptionMaxLength && (
                            <button
                                onClick={() => setShowFullDescriptionModal(true)}
                                className="ml-2 text-blue-600 dark:text-blue-400 underline text-xs"
                            >
                                {language.showMore}
                            </button>
                        ))}
                    </div>
                    <div className="inline-flex flex-wrap w-full">
                        <span className="mt-4 p-1 ml-1 mr-1 text-sm border-2 rounded-md border-gray-500 text-gray-500 dark:text-gray-400 dark:border-gray-400">{game.category}</span>
                        {game.ages && <span className="ml-1 mr-1 mt-4 p-1 text-sm border-2 rounded-md border-gray-500 text-gray-500 dark:text-gray-400 dark:border-gray-400">{game.ages}</span>}
                        {game.players && <span className="ml-1 mr-1 mt-4 p-1 text-sm border-2 rounded-md border-gray-500 text-gray-500 dark:text-gray-400 dark:border-gray-400">{game.players}</span>}
                        {game.time && <span className="ml-1 mr-1 mt-4 p-1 text-sm border-2 rounded-md border-gray-500 text-gray-500 dark:text-gray-400 dark:border-gray-400">{game.time}</span>}
                    </div>

                    <div className="inline-flex w-full">
                        {!isGamesPage && (permissions === Perms.R || permissions === Perms.A) && (
                            <div className="mt-3 ml-auto space-x-2 inline-flex flex-wrap justify-end">
                                <button
                                    onClick={() => setShowRentalModal(true)}
                                    className="px-3 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                                >{language.rentMainPage}
                                </button>
                            </div>
                        )}

                        {actions && (
                            <div className="mt-3 ml-auto space-x-2 inline-flex flex-wrap justify-end">
                                <button
                                    onClick={() => setEditingGame(true)}
                                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 mb-2"
                                >{language.editGame}</button>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    disabled={isProcessing}
                                    className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 disabled:opacity-50 mb-2"
                                >{language.deleteGame}</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <DialogModal show={showFullDescriptionModal} title={game.title} onClose={() => setShowFullDescriptionModal(false)}>
                <div className="">
                    <SingleGame game={game} displayFullDescription={true} actions={false} /> 
                </div>
            </DialogModal>
            
            <DialogModal show={editingGame} title={language.editGame} onClose={() => setEditingGame(false)}>
                <GameForm game={game} onClose={() => setEditingGame(false)}/>
            </DialogModal>

            <DeleteDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={() => handleDeleteGame(game.id)}
                title={language.confirmDelete}
                description={`${language.confirmDelete} ${game.title}?`}
                confirmText={language.deleteGame}
                isProcessing={isProcessing}
            />

            <DialogModal show={showRentalModal} title={language.addRent} onClose={() => setShowRentalModal(false)}>
                <ErrorField error={error}/>
                <RentalForm
                    gameId={game.id}
                    handleError={handleError}
                    handleSuccess={handleSuccess}
                />
            </DialogModal>
        </>
    )
}