import { cn } from '../../lib/cn'

/**
 * Kbd — keyboard shortcut key display.
 * Matches the design system aesthetic: inset bg, mono font, subtle border.
 *
 * @example <Kbd>⌘</Kbd> <Kbd>K</Kbd>
 */
export function Kbd({ children, className, ...props }) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center',
        'h-5 min-w-5 px-1.5 rounded',
        'bg-inset border border-border-default',
        'font-mono text-text-tertiary select-none',
        'leading-none',
        className
      )}
      style={{ fontSize: '10px' }}
      {...props}
    >
      {children}
    </kbd>
  )
}

Kbd.displayName = 'Kbd'
export default Kbd
