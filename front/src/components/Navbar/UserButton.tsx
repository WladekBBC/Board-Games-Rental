import { useAuth } from "@/contexts/AuthContext"
import { LogoutButton } from "./LogoutButton"

export const UserButton = () => {
    const { user } = useAuth()

    return (
        <>
            <span className="flex text-sm text-gray-700 dark:text-gray-300 sm:items-stretch space-x-4 ">
                {user?.email}
                <LogoutButton/>
            </span>
            
        </>
    );
}