import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

const VARIANT_CLASSES = {
  primary:
    'bg-accent text-canvas font-semibold hover:bg-accent-500 active:bg-accent-600 border border-transparent',
  secondary:
    'bg-surface text-text-primary border border-border-default hover:bg-elevated hover:border-border-strong active:bg-elevated',
  ghost:
    'bg-transparent text-text-secondary border border-transparent hover:bg-surface hover:text-text-primary active:bg-elevated',
  danger:
    'bg-risk-critical-bg text-risk-critical border border-risk-critical-border hover:bg-risk-critical/20 active:bg-risk-critical/25',
}

const SIZE_CLASSES = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-md',
  md: 'h-9 px-4 text-sm gap-2 rounded-md',
  lg: 'h-10 px-5 text-sm gap-2 rounded-md',
}

/**
 * Button — FraudShield AI primitive.
 *
 * @prop {'primary'|'secondary'|'ghost'|'danger'} variant
 * @prop {'sm'|'md'|'lg'} size
 * @prop {ReactNode} leftIcon
 * @prop {ReactNode} rightIcon
 * @prop {boolean} loading
 * @prop {boolean} disabled
 */
export const Button = forwardRef(function Button(
  {
    variant = 'secondary',
    size = 'md',
    leftIcon,
    rightIcon,
    loading = false,
    disabled = false,
    className,
    children,
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={cn(
        'btn-base inline-flex items-center justify-center font-medium select-none whitespace-nowrap',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        isDisabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2
          size={size === 'sm' ? 12 : 14}
          strokeWidth={2}
          className="animate-spin shrink-0"
          aria-hidden="true"
        />
      ) : (
        leftIcon && (
          <span className="shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )
      )}

      {children && <span>{children}</span>}

      {!loading && rightIcon && (
        <span className="shrink-0" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  )
})

Button.displayName = 'Button'
export default Button
