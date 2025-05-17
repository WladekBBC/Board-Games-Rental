import { useAuth } from "@/contexts/AuthContext"
import { useLang } from "@/contexts/LanguageContext"

export const LogoutButton = () => {
    const { signOut } = useAuth()
    const { language } = useLang()

    return (
        <>
            <button
            onClick={signOut}
            className="flex text-sm text-red-600 hover:text-red-900 sm:items-stretch dark:text-red-400 dark:hover:text-red-300 space-x-4 sm:ml-2"
            >
            {language.logout}
            </button>
        </>
    );
}