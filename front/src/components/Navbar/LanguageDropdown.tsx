import { useLang } from "@/contexts/LanguageContext"
import { Language } from "@/lib/i18n/translations"
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react"
import { AnimatePresence } from "framer-motion"

export const LanguageDropdown = () =>{
    const { currentLang, setLanguage } = useLang()

    const languages:Language[] = ['pl', 'ua', 'en', 'ja']
    
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
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <MenuButton className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-hidden focus-visible:outline-none">
                    {getLanguageLabel(currentLang)}
                </MenuButton>
            </div>

            <MenuItems
                transition={true}
                className="absolute right-0 z-10 mt-2 w-max shadow bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 origin-top-right rounded-md focus:outline-hidden focus-visible:outline-none transition-all duration-100 ease-in-out">
                <div className="py-1">
                {languages.map((lang)=>(
                    <>
                        <MenuItem>
                            <a onClick={()=>setLanguage(lang)} className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                {getLanguageLabel(lang)}
                            </a>
                        </MenuItem>
                    </>
                ))}
                </div>
            </MenuItems>
        </Menu>
    )
}