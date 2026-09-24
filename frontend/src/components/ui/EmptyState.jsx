import { cn } from '../../lib/cn'
import Button from './Button'

/**
 * EmptyState — centered vertical stack for empty/no-data states.
 *
 * @prop {ReactNode} icon        — Lucide icon component (rendered at 24px)
 * @prop {string}    title
 * @prop {string}    [description]
 * @prop {string}    [action]     — CTA button label
 * @prop {Function}  [onAction]   — CTA click handler
 * @prop {string}    [actionVariant] — Button variant (default 'secondary')
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  onAction,
  actionVariant = 'secondary',
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 px-6 text-center',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {Icon && (
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-elevated border border-border-default">
          <Icon
            size={22}
            strokeWidth={1.5}
            className="text-text-tertiary"
            aria-hidden="true"
          />
        </div>
      )}

      {title && (
        <p className="text-sm font-medium text-text-primary">{title}</p>
      )}

      {description && (
        <p className="text-xs text-text-tertiary max-w-xs leading-relaxed">
          {description}
        </p>
      )}

      {action && onAction && (
        <Button
          variant={actionVariant}
          size="sm"
          onClick={onAction}
          className="mt-1"
        >
          {action}
        </Button>
      )}
    </div>
  )
}

EmptyState.displayName = 'EmptyState'
export default EmptyState
