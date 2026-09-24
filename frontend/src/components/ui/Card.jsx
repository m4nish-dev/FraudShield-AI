import { cn } from '../../lib/cn'

/**
 * Card — composable surface container.
 *
 * Usage:
 *   <Card>
 *     <Card.Header title="Title" actions={<Button>...</Button>} />
 *     <Card.Body>content</Card.Body>
 *     <Card.Footer>footer</Card.Footer>
 *   </Card>
 */
export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-surface border border-border-default rounded-lg shadow-card',
        'flex flex-col overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Card.Header — title + optional subtitle + actions slot.
 *
 * @prop {string}    title
 * @prop {string}    [subtitle]
 * @prop {ReactNode} [actions]   — icon buttons or controls on the right
 * @prop {string}    [className]
 */
Card.Header = function CardHeader({ title, subtitle, actions, className, children, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3',
        'px-5 py-4 border-b border-border-subtle',
        'shrink-0',
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        {title && (
          <h3 className="text-sm font-semibold text-text-primary truncate">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-xs text-text-tertiary truncate">{subtitle}</p>
        )}
        {children}
      </div>
      {actions && (
        <div className="flex items-center gap-1.5 shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}

/**
 * Card.Body — main scrollable content area.
 */
Card.Body = function CardBody({ className, children, ...props }) {
  return (
    <div className={cn('flex-1 p-5', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * Card.Footer — bottom action strip.
 */
Card.Footer = function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'px-5 py-4 border-t border-border-subtle',
        'bg-inset/40 shrink-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

Card.displayName = 'Card'
Card.Header.displayName = 'Card.Header'
Card.Body.displayName = 'Card.Body'
Card.Footer.displayName = 'Card.Footer'

export default Card
