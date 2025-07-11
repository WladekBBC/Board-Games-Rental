import { useLang } from "@/contexts/LanguageContext"
import { Language } from "@/lib/i18n/translations"
import React from "react";
import { useState } from "react";

export const LanguageDropdown = () =>{
    const { currentLang, setLanguage } = useLang();
    const [show, setShow] = useState(false)
    const [hiding, setHiding] = useState(false)

    const languages:Language[] = ['pl', 'ua', 'en', 'ja']
    const listRef = React.createRef<HTMLButtonElement>();
    
    const getLanguageLabel = (lang: string) => {
        switch(lang) {
            case 'pl': return 'PL';
            case 'ua': return 'UA';
            case 'en': return 'EN';
            case 'ja': return '日本語';
            default: return 'PL';
        }
    }

    return (
        <>
            <button className="relative inline-block text-center" onBlur={()=>setShow(false)}>
                <div onClick={()=>setShow(!show)} className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                    {getLanguageLabel(currentLang)}
                </div>

                <div
                    className={`z-20 select-none absolute pointer-events-none origin-top-right top-7 right-0 mt-4 w-max shadow-lg bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-md overflow-hidden transition-all duration-100 ease-in-out  ${show ? 'max-h-40' : 'max-h-0'}`}>
                        {languages.map((lang)=>(
                                <a key={lang} onClick={()=>{setLanguage(lang); setShow(false)}} className={`block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 pointer-events-auto`}>
                                    {getLanguageLabel(lang)}
                                </a>
                        ))}
                </div>
            </button>
        </>
    )
}