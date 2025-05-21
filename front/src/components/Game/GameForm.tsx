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
    onClose?: () => void
}

const defaultGame = { 
        title: "",
        description: "",
        imageUrl: "",
        amount: 1,
        quantity: 1, 
        category: "",
};

export const GameForm = ({ game, onClose }: GameFormType) => {
    const { addGame, updateGame } = useGames() 
    const [isProcessing, setIsProcessing] = useState(false)
    const { language } = useLang()
    const [formData, setFormData] = useState<Omit<IGame, 'id' | 'isAvailable'>>(game || defaultGame)
    const [isImageValid, setIsImageValid] = useState(true)
    const [error, setError] = useState<string>()

    useEffect(() => {
        if (formData.imageUrl) {
            validatePhoto()
        } else {
            setIsImageValid(true); 
            setError(undefined);
        }
    }, [formData.imageUrl]) 

    const validatePhoto = () => {
        validateImageUrl(formData.imageUrl).then((res) => {
            setIsImageValid(res.isValid)
            setError(res.isValid ? undefined : language[res.error as keyof typeof language])
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsProcessing(true)
        setError(undefined); 

        if (game) {
            updateGame(game.id, formData).catch(()=>{setError(language.editGameError)});
        } else {
            formData.quantity = formData.amount
            addGame(formData).then(()=>setFormData(defaultGame)).catch((err)=>{
                if(err == 400)
                    setError(language.gameExistError)
                else
                    setError(language.addGameError)
            });
        }
        if (onClose) {
            onClose()
        }
        setIsProcessing(false)

    }

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newAmount = +e.target.value;
        setFormData(prev => {
            let newQuantity = prev.quantity;
            if (!game) { 
                newQuantity = newAmount;
            } else { 
                if (newAmount < prev.quantity) {
                    newQuantity = newAmount; 
                }
            }
            return {
                ...prev,
                amount: newAmount,
                quantity: newQuantity
            };
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            <GameInput name="title" label={language.gameTitle} type="text" value={formData.title} changeHandler={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} />
            <GameInput name="description" label={language.gameDesc} type="textarea" value={formData.description} changeHandler={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} />
            <GameInput name="imageUrl" label={language.gameImageUrl} type="url" value={formData.imageUrl} changeHandler={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))} />
            {formData.imageUrl && isImageValid && (
                <div className="mt-2 relative h-48 w-full">
                    <Image
                        loader={imageLoader}
                        src={formData.imageUrl}
                        alt="Podgląd obrazu"
                        width={800}
                        height={400}
                        className="object-cover w-full h-full rounded-md"
                        onError={() => { 
                            setIsImageValid(false);
                            setError(language.invalidImageUrl);
                        }}
                    />
                </div>
            )}
            {!isImageValid && formData.imageUrl && ( 
              <p className="mt-1 text-sm text-red-600">
                {language.invalidImageUrl} 
              </p>
            )}
            <GameInput name="category" label={language.gameCategory} type="text" value={formData.category} changeHandler={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} />
            
            <GameInput name="amount" label={language.gameNumber} type="number" min={1} value={formData.amount} changeHandler={handleAmountChange} />
            
            {game && (
                <GameInput name="quantity" label={language.gameAvailableNumber} type="number" min={0} max={formData.amount} value={formData.quantity} changeHandler={(e) => setFormData(prev => ({ ...prev, quantity: +e.target.value }))} />
            )}
            <button
                type="submit"
                disabled={
                    isProcessing ||
                    !isImageValid ||
                    !formData.title ||
                    !formData.category ||
                    !formData.imageUrl || 
                    !formData.description ||
                    formData.amount < 1 ||
                    (game && formData.quantity > formData.amount) || 
                    (game && formData.quantity < 0) 
                }
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                {game ? language.save : language.addGame}
            </button>
        </form>
    );
}