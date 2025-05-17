import { useGames } from "@/contexts/GamesContext"
import { useLang } from "@/contexts/LanguageContext"
import { IGame } from "@/interfaces/game"
import { validateImageUrl } from "@/lib/utils/imageUrlValidator"
import { useEffect, useState } from "react"
import { GameInput } from "./GameInput"
import { imageLoader } from "@/lib/utils/imageLoader"
import Image from 'next/image'

type GameFormType = {
    game?: IGame
    onClose?: ()=>void
}

const defaultGame: Omit<IGame, 'id' | 'isAvailable'> = {
    title: "",
    description: "",
    imageUrl: "",
    quantity: 1,
    amount: 1,
    category: "",
}

export const GameForm = ({ game, onClose }:GameFormType) =>{
    const { addGame } = useGames()
    const [isProcessing, setIsProcessing] = useState(false)
    const { updateGame, changeQuantity } = useGames()
    const { language } = useLang()
    const [formData, setFormData] = useState<Omit<IGame, 'id' | 'isAvailable'>>(game || defaultGame)
    const [isImageValid, setIsImageValid] = useState(true)
    const [error, setError] = useState<string>()

    useEffect(()=>{
        if(formData.imageUrl)
            validatePhoto()
    })

    const validatePhoto = () =>{
        validateImageUrl(formData.imageUrl).then((res)=>{
            setIsImageValid(res.isValid)
            setError(language[res.error as keyof typeof language])
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsProcessing(true)

        if(game){
            updateGame(game.id, formData).then(()=>{
                changeQuantity(game.id, formData.quantity)
            }).catch(()=>{
                setError(language.editGameError)
            })
        }else{
            addGame(formData).then(()=>{
                setFormData(defaultGame);
            }).catch(()=>{
                setError(language.editGameError)
            })
        }

        setIsProcessing(false) 
        if(onClose)
            onClose()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <GameInput name="title" label={language.gameTitle} type="text" value={formData.title} changeHandler={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}/>
            <GameInput name="description" label={language.gameDesc} type="textarea" value={formData.description} changeHandler={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}/>
            <GameInput name="imageUrl" label={language.gameImageUrl} type="url" value={formData.imageUrl} changeHandler={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}/>
            {formData.imageUrl && isImageValid && (
              <div className="mt-2 relative h-48 w-full">
                <Image
                  loader={imageLoader}
                  src={formData.imageUrl}
                  alt="Podgląd obrazu"
                  width={800}
                  height={400}
                  className="object-cover w-full h-full rounded-md"
                />
              </div>
            )}
            {!isImageValid && (
              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            )}
            <GameInput name="category" label={language.gameCategory} type="text" value={formData.category} changeHandler={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}/>
            <GameInput name="amount" label={language.gameNumber} type="number" min={1} value={formData.amount} changeHandler={(e) => setFormData(prev => ({ ...prev, amount: +e.target.value }))}/>
            {game && (
                <GameInput name="quantity" label={language.gameAvailableNumber} type="number" min={0} max={formData.amount} value={formData.quantity} changeHandler={(e) => setFormData(prev => ({ ...prev, quantity: +e.target.value }))}/>
            )}
            <button
                type="submit"
                disabled={isProcessing || !isImageValid || !formData.title || !formData.category || !formData.imageUrl || !formData.description || formData.amount < 1 || formData.quantity > formData.amount}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                {game ? language.save : language.addGame}
            </button>
        </form>
    );
}