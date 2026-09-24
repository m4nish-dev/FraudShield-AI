import { cn } from '../../lib/cn'

/**
 * Divider — horizontal (default) or vertical separator.
 *
 * @prop {'horizontal'|'vertical'} orientation
 * @prop {string} [label]  — optional centered label text
 */
export function Divider({ orientation = 'horizontal', label, className, ...props }) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('self-stretch w-px bg-border-subtle shrink-0', className)}
        {...props}
      />
    )
  }

  if (label) {
    return (
      <div
        role="separator"
        className={cn('flex items-center gap-3', className)}
        {...props}
      >
        <div className="flex-1 h-px bg-border-subtle" />
        <span className="text-xs text-text-tertiary font-medium whitespace-nowrap select-none">
          {label}
        </span>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>
    )
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn('h-px w-full bg-border-subtle shrink-0', className)}
      {...props}
    />
  )
}

Divider.displayName = 'Divider'
export default Divider
