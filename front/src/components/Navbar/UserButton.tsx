import { useAuth } from "@/contexts/AuthContext"
import { useLang } from "@/contexts/LanguageContext"

export const UserButton = () => {
    const { user, signOut } = useAuth()
    const { language } = useLang()

    return (
        <>
            <span className="flex text-sm text-gray-700 dark:text-gray-300 sm:items-stretch space-x-4 ">
                {user?.email}
                <button
                onClick={signOut}
                className="flex text-sm text-red-600 hover:text-red-900 sm:items-stretch dark:text-red-400 dark:hover:text-red-300 space-x-4 sm:ml-2"
                >
                {language.logout}
                </button>
            </span>
            
        </>
    );
}