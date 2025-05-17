import { useLang } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext"
import { UserButton } from "./UserButton";
import { RouterLink } from "./RouterLink";



export const UiNavElements = ()=>{
    const { theme, toggleTheme } = useTheme()
    const { currentLang, setLanguage, language } = useLang()
    const { user, signOut } = useAuth()

    return (
        <>
            <div className="flex items-center space-x-0.3 min-[950px]:ml-0 px-1">
                <button
                  onClick={() => setLanguage(currentLang === 'pl' ? 'ua' : 'pl')}
                  className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {currentLang === 'pl' ? 'UA' : 'PL'}
                </button>
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