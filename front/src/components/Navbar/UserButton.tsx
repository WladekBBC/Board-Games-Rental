import { useAuth } from "@/contexts/AuthContext"
import { useLang } from "@/contexts/LanguageContext"

export const UserButton = () => {
    const { user, signOut } = useAuth()
    const { language } = useLang()

    return (
        <>
            <span className="text-sm text-gray-700 dark:text-gray-300">
                {user?.email}
            </span>
            <button
                onClick={signOut}
                className="text-sm text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
            >
            {language.logout}
            </button>
        </>
    );
}