import { useLang } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext"
import { UserButton } from "./UserButton";
import { RouterLink } from "./RouterLink";
import { MenuButton } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { LanguageDropdown } from "./LanguageDropdown";



export const UiNavElements = ()=>{
    const { theme, toggleTheme } = useTheme()
    const { currentLang, setLanguage, language } = useLang()
    const { user, signOut } = useAuth()

    const getNextLanguage = (current: string) => {
        switch(current) {
            case 'pl': return 'ua';
            case 'ua': return 'en';
            case 'en': return 'ja';
            case 'ja': return 'pl';
            default: return 'pl';
        }
    }

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
            <div className="flex items-center space-x-0.3 min-[950px]:ml-0 px-1">
                <LanguageDropdown/>

                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {theme === 'dark' ? '🌞' : '🌙'}
                </button>
                <div className="hidden min-[950px]:block">
                  {user ? <UserButton /> : <RouterLink link='/login' text={language.login}/>} 
                </div>
            </div>
        </>
    );
}