import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import link from "next/link";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileRouterLink } from "./MobileRouterLink";
import { Perms } from "@/interfaces/perms";
import { DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { UserButton } from "./UserButton";
import { RouterLink } from "./RouterLink";
import { UiNavElements } from "./UiNavElements";

export const MobileNav = ()=>{
    const { user, permissions } = useAuth()
    const { language } = useLang()
    
    return (
        <>
            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {user ? 
                        <>
                        <MobileRouterLink link='/' text={language.home} />
                        {[Perms.R, Perms.A].includes(permissions) && <MobileRouterLink link='/rentals' text={language.rentals}/>}
                        {permissions == Perms.A && <MobileRouterLink link='/games' text={language.games} />}
                        {permissions == Perms.A && <MobileRouterLink link='/users' text={language.users} />}
                        {<DisclosureButton
                            className={'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 block rounded-md px-3 py-2 text-base font-medium'}
                            >
                            {language.logout}
                        </DisclosureButton>}
                        </>
                    :
                        <MobileRouterLink link='/login' text={language.login}/>
                    }
                    <UiNavElements/>
                </div>
            </DisclosurePanel>
        </>
    );
}