import Link from "next/link";
import { usePathname } from "next/navigation";

type RouterLinkProps = {
    link: string,
    text: string
};

export const MobileRouterLink = (children: RouterLinkProps)=>{
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
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    isActive(children.link)
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                {children.text}
            </Link>
        </>
    );
}