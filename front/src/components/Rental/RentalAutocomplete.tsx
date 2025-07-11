import { createRef, useState } from "react";
import { IGame } from "@/interfaces/game";
import { CustomFormInput } from "../Helpers/FormInput";
import { useLang } from "@/contexts/LanguageContext";

type RentalAutocompleteType = {
    games: IGame[],
    label: string,
    placeholder?: string
    value?: IGame
    changeHandler: (e: any) => void
}

export const RentalAutocomplete = ({games, label, placeholder, value, changeHandler}: RentalAutocompleteType) => {
    const [results, setResults] = useState<IGame[]>([]);
    const [gameInfo, setGameInfo] = useState<number | undefined>()
    const [show, setShow] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState(()=>{
        if(value){
            setGameInfo(value.quantity)
            changeHandler(value)
        }
        return value?.title || ""
    })

    const listRef = createRef<HTMLUListElement>()
    const {language} = useLang()
    
    const handleInputChange = (event: any) => {
        const { value } = event.target;
        setInputValue(value);
        search(value);
    };

    const handleSelect = (result: IGame) =>{
        setInputValue(result.title)
        setGameInfo(result.quantity)
        changeHandler(result)
        setShow(false)
    }

    const search = (term: string) => {
        setShow(true)

        const filteredResults = games.filter((game) =>
          game.title.toLowerCase().includes(term.toLowerCase())
        );

        setResults(filteredResults);
        changeHandler(undefined)
        setGameInfo(undefined)
    };

    return (
        <div className="relative">
            <CustomFormInput type="text" placeholder={placeholder} name="gameId" value={inputValue} label={label} changeHandler={handleInputChange} focusHandler={handleInputChange} blurHandler={() => setTimeout(()=>{setShow(false)}, 150)} />
            <ul ref={listRef} className={`absolute transition-all duration-100 ease-in-out ${show ? 'max-h-52' : 'max-h-0 invisible'} h-auto z-10 mt-2 w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white overflow-hidden overflow-y-auto`}>
                {results.map((result) => (
                    <li className={result.quantity > 0 ? "hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 cursor-pointer" : "text-gray-400 hover:bg-gray-500 cursor-not-allowed"} onClick={()=>{if(result.quantity > 0) handleSelect(result)}} key={result.id}>
                        <div className="p-3">
                            {result.title} {result.quantity <= 0 ? language.gameUnavailable : `(${language.gameAvailable}: ${result.quantity} ${language.piece}.)`}
                        </div>
                    </li>
                ))}
            </ul>
            {gameInfo && <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">{games.find((g)=>(g.title === inputValue))?.quantity == 0 ? language.gameUnavailable : `(${language.gameAvailable}: ${gameInfo} ${language.piece}.)`}</p>}
        </div>
      );
}