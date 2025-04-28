import { useAuth } from "@/lib/contexts/AuthContext"
import { useLang } from "@/lib/contexts/LanguageContext"

export const UserButton = () => {
    const { user, signOut } = useAuth()
    const { language } = useLang()
    
    /**
     * Handles user logout
     * @returns {Promise<void>}
     */
    const handleSignOut = async () => {
        try {
        await signOut()
        } catch (error) {
        console.error('Error signing out:', error)
        }
    }

    return (
        <>
            <span className="text-sm text-gray-700 dark:text-gray-300">
                {user?.email}
            </span>
            <button
                onClick={handleSignOut}
                className="text-sm text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
            >
            {language.logout}
            </button>
        </>
    );
}