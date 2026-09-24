import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

/**
 * Modal — centered overlay panel with Framer Motion fade + scale.
 *
 * @prop {boolean}   open
 * @prop {Function}  onClose
 * @prop {string}    title
 * @prop {string}    [description]
 * @prop {ReactNode} children        — modal body
 * @prop {ReactNode} [footer]        — action buttons
 * @prop {'sm'|'md'|'lg'|'xl'} size
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}) {
  const panelRef = useRef(null)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Trap focus (basic: focus modal on open)
  useEffect(() => {
    if (open) {
      setTimeout(() => panelRef.current?.focus(), 50)
    }
  }, [open])

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[size]

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-canvas/70 backdrop-blur-sm"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby={description ? 'modal-description' : undefined}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none',
            )}
          >
            <div
              className={cn(
                'pointer-events-auto w-full flex flex-col',
                'bg-elevated border border-border-default rounded-xl shadow-elevated',
                sizeClass,
                'max-h-[90vh]',
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-border-subtle shrink-0">
                <div>
                  {title && (
                    <h2
                      id="modal-title"
                      className="text-base font-semibold text-text-primary"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id="modal-description" className="mt-1 text-sm text-text-secondary">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className={cn(
                    'flex items-center justify-center h-8 w-8 rounded-md shrink-0',
                    'text-text-tertiary hover:text-text-primary hover:bg-surface',
                    'transition-all duration-150'
                  )}
                >
                  <X size={16} strokeWidth={1.75} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border-subtle bg-inset/40 shrink-0 rounded-b-xl">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

Modal.displayName = 'Modal'
export default Modal
