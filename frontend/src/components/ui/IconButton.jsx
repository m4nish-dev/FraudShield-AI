import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

const VARIANT_CLASSES = {
  primary:
    'bg-accent text-canvas hover:bg-accent-500 active:bg-accent-600 border border-transparent',
  secondary:
    'bg-surface text-text-secondary border border-border-default hover:bg-elevated hover:text-text-primary hover:border-border-strong',
  ghost:
    'bg-transparent text-text-tertiary border border-transparent hover:bg-surface hover:text-text-primary',
  danger:
    'bg-risk-critical-bg text-risk-critical border border-risk-critical-border hover:bg-risk-critical/20',
}

const SIZE_CLASSES = {
  sm: 'h-8 w-8 rounded-md',
  md: 'h-9 w-9 rounded-md',
}

/**
 * IconButton — square icon-only button.
 * aria-label is REQUIRED.
 *
 * @prop {'primary'|'secondary'|'ghost'|'danger'} variant
 * @prop {'sm'|'md'} size
 * @prop {string} aria-label  REQUIRED
 */
export const IconButton = forwardRef(function IconButton(
  {
    variant = 'ghost',
    size = 'md',
    disabled = false,
    className,
    children,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center shrink-0',
        'transition-all duration-150 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})

IconButton.displayName = 'IconButton'
export default IconButton
