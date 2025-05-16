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
        {/* Mobile menu - show user, lang, theme, etc. */}
        
            <button
                onClick={signOut}
                className="text-sm text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                {language.logout}
            </button>
        </>
    );
}