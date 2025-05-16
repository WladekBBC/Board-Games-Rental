import { useLang } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export const UiNavElements = ()=>{
    const { theme, toggleTheme } = useTheme()
    const { currentLang, setLanguage } = useLang()

    return (
        <>
            <button
                onClick={() => setLanguage(currentLang === 'pl' ? 'ua' : 'pl')}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                {currentLang === 'pl' ? 'UA' : 'PL'}
            </button>
            <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                {theme === 'dark' ? '🌞' : '🌙'}
            </button>
        </>
    );
}