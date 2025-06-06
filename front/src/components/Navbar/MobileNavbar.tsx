import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { DisclosurePanel } from "@headlessui/react";
import { MobileRouterLink } from "./MobileRouterLink";
import { Perms } from "@/interfaces/perms";
import { UiNavElements } from "./UiNavElements";
import { LogoutButton } from "./LogoutButton";
import { AnimatePresence, motion } from "framer-motion";

interface MobileNavProps {
  onLinkClick?: () => void;
}

export const MobileNav = ({ onLinkClick }: MobileNavProps) => {
    const { user, permissions } = useAuth()
    const { language } = useLang()
    
    return (
        <AnimatePresence>
                         
                <DisclosurePanel className="min-[950px]:hidden dark:bg-gray-800 light:bg-white">
                    <div className="space-y-1 px-2 pt-2 pb-3">
                        <motion.div
                            initial={{ opacity: 0, scaleY: 0.8, height: 0 }}
                            animate={{ opacity: 1, scaleY: 1, height: 'auto' }}
                            exit={{ opacity: 0, scaleY: 0.8, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 z-10 mt-1 w-max min-w-full origin-top bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg overflow-hidden"
                            >  
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
                                        <div className="flex items-center px-3">
                                                <LogoutButton/>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <MobileRouterLink link='/login' text={language.login} onClick={onLinkClick}/>
                            )}
                        </motion.div>
                    </div>
                </DisclosurePanel>
           
        </AnimatePresence>
    );
}