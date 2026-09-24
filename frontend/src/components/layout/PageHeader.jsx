import { cn } from '../../lib/cn'

/**
 * PageHeader — Reusable page title + subtitle + actions slot.
 *
 * @param {string}       title     — Page title (display font, 2xl)
 * @param {string}       [subtitle]— Optional description line
 * @param {ReactNode}    [actions] — Right-side action buttons slot
 * @param {ReactNode}    [badge]   — Optional badge next to title
 * @param {string}       [className]
 */
export default function PageHeader({
  title,
  subtitle,
  actions,
  badge,
  className,
}) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4',
        'py-6 px-6 border-b border-border-subtle',
        className
      )}
    >
      {/* Title + subtitle */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-display font-semibold tracking-tight text-text-primary truncate">
            {title}
          </h1>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
        {subtitle && (
          <p className="text-sm text-text-secondary leading-snug">
            {subtitle}
          </p>
        )}
      </div>

      {/* Actions slot */}
      {actions && (
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          {actions}
        </div>
      )}
    </div>
  )
}
