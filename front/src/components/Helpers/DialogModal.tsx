import { AnimatePresence, motion } from "framer-motion"
import { ReactNode } from "react"

type DialogType = {
    children: ReactNode
    title?: string
    show: boolean
    onClose: ()=>any
}

export const DialogModal = ({children, title, show, onClose}: DialogType) =>{
    if(show)
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={onClose}>
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()} >
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">{title}</h2>
                                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                            </div>
                            {children}
                        </div>
                        
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        );
    return null
}