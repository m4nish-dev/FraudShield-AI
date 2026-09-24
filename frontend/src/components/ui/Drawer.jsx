import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

/**
 * Drawer — right-side slide-in panel.
 * Used for transaction / case detail overlays from a list.
 *
 * @prop {boolean}   open
 * @prop {Function}  onClose
 * @prop {string}    title
 * @prop {string}    [description]
 * @prop {ReactNode} children
 * @prop {ReactNode} [footer]
 * @prop {'md'|'lg'|'xl'} size  (default 'md' = 520px)
 */
export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}) {
  const drawerRef = useRef(null)

  const widthClass = {
    md: 'w-[520px]',
    lg: 'w-[680px]',
    xl: 'w-[840px]',
  }[size]

  // Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Focus on open
  useEffect(() => {
    if (open) setTimeout(() => drawerRef.current?.focus(), 50)
  }, [open])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-canvas/60 backdrop-blur-sm"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            key="drawer-panel"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            tabIndex={-1}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            className={cn(
              'fixed top-0 right-0 bottom-0 z-50',
              'flex flex-col',
              'bg-elevated border-l border-border-default shadow-elevated',
              widthClass,
              'max-w-full',
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-border-subtle shrink-0">
              <div className="min-w-0">
                {title && (
                  <h2
                    id="drawer-title"
                    className="text-base font-semibold text-text-primary truncate"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-0.5 text-xs text-text-tertiary truncate">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close drawer"
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
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border-subtle bg-inset/40 shrink-0">
                {footer}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

Drawer.displayName = 'Drawer'
export default Drawer
