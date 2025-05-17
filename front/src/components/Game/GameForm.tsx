import { useGames } from "@/contexts/GamesContext"
import { useLang } from "@/contexts/LanguageContext"
import { useState } from "react"

export const GameForm = () =>{

    const { addGame } = useGames()
    const [isProcessing, setIsProcessing] = useState(false)
    const { language } = useLang()

    const handleAddGame = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsProcessing(true)

        const formData = new FormData(e.currentTarget)
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const imageUrl = formData.get('imageUrl') as string
        const category = formData.get('category') as string
        const quantity = parseInt(formData.get('quantity') as string) || 0

        addGame({
            title: title,
            description: description,
            imageUrl: imageUrl,
            category: category,
            amount: quantity,
            quantity: quantity
        })

        e.currentTarget.reset()
        setIsProcessing(false)
    
    }
    

    return (
        <form onSubmit={handleAddGame} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {language.gameTitle}
                </label>
                <input
                type="text"
                id="title"
                name="title"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {language.gameDesc}
                </label>
                <textarea
                id="description"
                name="description"
                required
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>
            <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {language.gameImageUrl}
                </label>
                <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {language.gameCategory}
                </label>
                <input
                type="text"
                id="category"
                name="category"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>
            <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {language.gameNumber}
                </label>
                <input
                type="number"
                id="quantity"
                name="quantity"
                min="0"
                required
                defaultValue="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>
            <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
                {isProcessing ? language.gameAdding : language.addGame}
            </button>
        </form>
    );
}