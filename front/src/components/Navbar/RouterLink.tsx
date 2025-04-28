import Link from "next/link";
import { usePathname } from "next/navigation";

type RouterLinkProps = {
    link: string,
    text: string
};

export const RouterLink = (children: RouterLinkProps)=>{

    const pathname = usePathname()

    /**
     * Checker for path
     * @param path - path to check
     * @returns if path is active or not
     */
    const isActive = (path: string) => pathname === path

    return (
        <>
            <Link
                  href={children.link}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive(children.link)
                      ? 'border-blue-500 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                {children.text}
            </Link>
        </>
    );
}