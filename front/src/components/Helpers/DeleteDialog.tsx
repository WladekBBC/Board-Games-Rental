import { Dialog } from '@headlessui/react'
import { useLang } from '@/contexts/LanguageContext'
import { AnimatePresence, motion } from 'framer-motion'

interface DeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  isProcessing?: boolean
}

export default function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  isProcessing = false
}: DeleteDialogProps) {
  const { language } = useLang()

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog 
          open={isOpen} 
          onClose={onClose} 
          className="fixed z-50 inset-0 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-screen px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 z-50 max-w-sm mx-auto"
            >
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {description}
              </Dialog.Description>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white disabled:opacity-50"
                >
                  {cancelText || language.cancel}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {isProcessing ? language.loading : (confirmText || language.delete)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  )
} 