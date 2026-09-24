import { cn } from '../../lib/cn'

const VARIANT_CLASSES = {
  default:
    'bg-elevated border border-border-default text-text-secondary',
  accent:
    'bg-accent/10 border border-accent/25 text-accent',
  success:
    'bg-risk-low-bg border border-risk-low-border text-risk-low',
  warning:
    'bg-risk-medium-bg border border-risk-medium-border text-risk-medium',
  danger:
    'bg-risk-critical-bg border border-risk-critical-border text-risk-critical',
  neutral:
    'bg-surface border border-border-default text-text-tertiary',
  high:
    'bg-risk-high-bg border border-risk-high-border text-risk-high',
}

const SIZE_CLASSES = {
  sm: 'text-xs px-1.5 py-0.5 gap-1',
  md: 'text-xs px-2 py-1 gap-1.5',
}

const DOT_COLORS = {
  default: 'bg-text-tertiary',
  accent:  'bg-accent',
  success: 'bg-risk-low',
  warning: 'bg-risk-medium',
  danger:  'bg-risk-critical',
  neutral: 'bg-text-disabled',
  high:    'bg-risk-high',
}

/**
 * Badge — pill-shaped status label.
 *
 * @prop {'default'|'accent'|'success'|'warning'|'danger'|'neutral'|'high'} variant
 * @prop {'sm'|'md'} size
 * @prop {boolean} dot   — show colored dot indicator
 */
export function Badge({
  variant = 'default',
  size = 'sm',
  dot = false,
  className,
  children,
  ...props
}) {
  return (
    <span
      className={cn(
        'badge-base inline-flex items-center font-medium rounded-md',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'inline-block rounded-full shrink-0',
            size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2',
            DOT_COLORS[variant]
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

Badge.displayName = 'Badge'
export default Badge
