import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { DisclosurePanel } from "@headlessui/react";
import { MobileRouterLink } from "./MobileRouterLink";
import { Perms } from "@/interfaces/perms";
import { UiNavElements } from "./UiNavElements";

interface MobileNavProps {
  onLinkClick?: () => void;
}

export const MobileNav = ({ onLinkClick }: MobileNavProps) => {
    const { user, permissions } = useAuth()
    const { language } = useLang()
    
    return (
        <DisclosurePanel className="sm:hidden dark:bg-gray-800 light:bg-white">
            <div className="space-y-1 px-2 pt-2 pb-3">
                {user ? (
                    <>
                        <MobileRouterLink link='/' text={language.home} onClick={onLinkClick} />
                        {[Perms.R, Perms.A].includes(permissions) && (
                            <MobileRouterLink link='/rentals' text={language.rentals} onClick={onLinkClick}/>
                        )}
                        {permissions == Perms.A && (
                            <MobileRouterLink link='/games' text={language.games} onClick={onLinkClick} />
                        )}
                        {permissions == Perms.A && (
                            <MobileRouterLink link='/users' text={language.users} onClick={onLinkClick} />
                        )}
                        <div className="pt-4 pb-3 border-t border-gray-700">
                            <div className="flex items-center px-5">
                                <div className="flex-shrink-0">
                                    <UiNavElements />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <MobileRouterLink link='/login' text={language.login} onClick={onLinkClick}/>
                )}
            </div>
        </DisclosurePanel>
    );
}