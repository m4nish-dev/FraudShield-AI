import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useUIStore } from '../../lib/store'
import { cn } from '../../lib/cn'

const TOAST_VARIANTS = {
  success: 'bg-risk-low',
  error: 'bg-risk-critical',
  info: 'bg-accent',
}

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore()

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function Toast({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, toast.duration || 3000)
    return () => clearTimeout(timer)
  }, [onClose, toast.duration])

  const colorClass = TOAST_VARIANTS[toast.type] || TOAST_VARIANTS.info

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-elevated border border-border-default shadow-elevated rounded-lg p-3 pr-8 relative pointer-events-auto min-w-[280px]"
    >
      <div className="flex items-start gap-3">
        <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", colorClass)} />
        <div className="flex flex-col">
          {toast.title && <span className="text-sm font-medium text-text-primary">{toast.title}</span>}
          {toast.description && <span className="text-xs text-text-secondary mt-0.5">{toast.description}</span>}
        </div>
      </div>
      <button 
        onClick={onClose}
        className="absolute top-3 right-3 text-text-tertiary hover:text-text-primary transition-colors"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}
