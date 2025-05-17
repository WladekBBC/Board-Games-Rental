import { useGames } from "@/contexts/GamesContext"
import { useLang } from "@/contexts/LanguageContext"
import { IGame } from "@/interfaces/game"
import { useState } from "react"

type GameFormType = {
    game?: IGame
}

export const GameForm = ({ game }:GameFormType) =>{

    const { addGame } = useGames()
    const [isProcessing, setIsProcessing] = useState(false)
    const { updateGame, changeQuantity } = useGames()
    const { language } = useLang()
    const [formData, setFormData] = useState({
        title: game ? game.title : "",
        description: game ? game.description : "",
        imageUrl: game ? game.imageUrl : "",
        quantity: game ? game.quantity : 1,
        amount: game ? game.amount : 1,
        category: game ? game.category : "",
    })
    const [error, setError] = useState<string | null>(null)
    const [isImageValid, setIsImageValid] = useState(true)
    const [isValidating, setIsValidating] = useState(false)

    const validate = () =>{
        setIsValidating(true)
        setError(null)

        if (!formData.title.trim()) {
          setError(language.enterTitle)
        }
    
        else if (!formData.description || !formData.description.trim()) {
          setError(language.enterDesc)
        }
    
        else if (!formData.imageUrl.trim()) {
          setError(language.enterImageUrl)
        }

        else if (formData.quantity < 0) {
          setError(language.invalidQuantity)
        }

        const validationResult = await validateImageUrl(formData.imageUrl)
        
        else if (!validationResult.isValid) {
          setError(language[validationResult.error as keyof typeof language])
          setIsImageValid(false)
        }
        
    }

    /**
     * Handles img URL change
     * @param {React.ChangeEvent<HTMLInputElement>} e - Event input
     */
    const handleImageUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value
        setFormData(prev => ({ ...prev, imageUrl: url }))
        if (url) {
        setIsValidating(true)
        const validationResult = await validateImageUrl(url)
        setIsValidating(false)
        setIsImageValid(validationResult.isValid)
        if (!validationResult.isValid) {
            setError(language[validationResult.error as keyof typeof language])
        }
        } else {
        setIsImageValid(true)
        setError(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
    
    
        try {
          await updateGame(game.id, {
            title: formData.title,
            description: formData.description,
            imageUrl: formData.imageUrl,
            category: formData.category,
            amount: formData.amount
          })
    
          await changeQuantity(game.id, formData.quantity)
          
          onClose()
        } catch (error) {
          setError(language.editGameError)
        }
      }
    

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language.gameTitle}
                </label>
                <input type="text" id="title" name="title" required value={formData.title}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language.gameDesc}
                </label>
                <textarea id="description" name="description" required rows={3} value={formData.description}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
            </div>
            <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language.gameImageUrl}
                </label>
                <input type="url" id="imageUrl" name="imageUrl" required value={formData.imageUrl}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {language.gameCategory}
                </label>
                <input type="text" id="category" name="category" required value={formData.category}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
            </div>
            <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {language.gameNumber}
                </label>
                <input type="number" id="quantity" name="quantity" min="0" required value={formData.quantity}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
            </div>
            {game && (
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-white-700">
                        Łączna liczba egzemplarzy
                    </label>
                    <input type="number" id="amount" min="0" value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            amount: parseInt(e.target.value) || 0
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                </div>
            )}
            <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                {isProcessing ? language.gameAdding : (game ? language.addGame : language.save)}
            </button>
        </form>
    );
}