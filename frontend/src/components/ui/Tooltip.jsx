import { useState, useRef, useEffect, cloneElement } from 'react'
import { cn } from '../../lib/cn'

/**
 * Tooltip — small informational popup.
 *
 * Usage: wrap any trigger element:
 *   <Tooltip content="Fusion score across all ML models">
 *     <InfoIcon />
 *   </Tooltip>
 *
 * @prop {ReactNode} content     — tooltip body text/node
 * @prop {'top'|'bottom'|'left'|'right'} placement
 * @prop {number}    delay       — ms before showing (default 300)
 */
export function Tooltip({
  content,
  placement = 'top',
  delay = 300,
  children,
  className,
}) {
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef(null)

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay)
  }
  const hide = () => {
    clearTimeout(timeoutRef.current)
    setVisible(false)
  }

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const placementStyles = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
    right:  'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrowStyles = {
    top:    'top-full left-1/2 -translate-x-1/2 border-t-elevated border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-elevated border-x-transparent border-t-transparent',
    left:   'left-full top-1/2 -translate-y-1/2 border-l-elevated border-y-transparent border-r-transparent',
    right:  'right-full top-1/2 -translate-y-1/2 border-r-elevated border-y-transparent border-l-transparent',
  }

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      {visible && content && (
        <span
          role="tooltip"
          className={cn(
            'absolute z-50 pointer-events-none',
            'px-2.5 py-1.5 rounded-md',
            'bg-elevated border border-border-default shadow-elevated',
            'text-xs text-text-primary whitespace-nowrap max-w-xs',
            'animate-fadeIn',
            placementStyles[placement],
            className
          )}
        >
          {content}
          {/* Arrow */}
          <span
            className={cn(
              'absolute w-0 h-0 border-4',
              arrowStyles[placement]
            )}
            aria-hidden="true"
          />
        </span>
      )}
    </span>
  )
}

Tooltip.displayName = 'Tooltip'
export default Tooltip
