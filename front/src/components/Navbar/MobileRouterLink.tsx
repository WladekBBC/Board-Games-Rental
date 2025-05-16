import Link from "next/link";
import { usePathname } from "next/navigation";

type RouterLinkProps = {
    link: string;
    text: string;
    onClick?: () => void;
};

export const MobileRouterLink = ({ link, text, onClick }: RouterLinkProps) => {
    const pathname = usePathname();

    /**
     * Checker for path
     * @param path - path to check
     * @returns if path is active or not
     */
    const isActive = (path: string) => pathname === path;

    return (
        <Link
            href={link}
            onClick={onClick}
            className={`block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200
                ${isActive(link)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-900 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}
            `}
        >
            {text}
        </Link>
    );
};