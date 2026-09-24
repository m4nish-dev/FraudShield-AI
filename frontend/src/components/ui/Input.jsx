import { forwardRef } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '../../lib/cn'

/**
 * Input — text input with icon slots, error + helper text support.
 *
 * @prop {ReactNode} leftIcon
 * @prop {ReactNode} rightIcon
 * @prop {string}    error        — error message (triggers error visual)
 * @prop {string}    helper       — helper text below input
 * @prop {string}    label        — label above input
 */
export const Input = forwardRef(function Input(
  {
    leftIcon,
    rightIcon,
    error,
    helper,
    label,
    id,
    className,
    wrapperClassName,
    disabled = false,
    ...props
  },
  ref
) {
  const hasError = Boolean(error)

  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium text-text-secondary select-none"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {/* Left icon */}
        {leftIcon && (
          <span
            className="absolute left-3 flex items-center text-text-tertiary pointer-events-none"
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${id}-error` : helper ? `${id}-helper` : undefined
          }
          className={cn(
            'w-full h-9 bg-inset rounded-md text-sm text-text-primary',
            'border transition-all duration-150 ease-out',
            'placeholder:text-text-tertiary',
            'focus:outline-none focus:ring-2',
            hasError
              ? 'border-risk-critical focus:border-risk-critical focus:ring-risk-critical/20'
              : 'border-border-default hover:border-border-strong focus:border-accent focus:ring-accent/20',
            leftIcon  ? 'pl-9'  : 'pl-3',
            rightIcon ? 'pr-9'  : 'pr-3',
            disabled && 'opacity-40 cursor-not-allowed',
            className
          )}
          {...props}
        />

        {/* Right icon or error icon */}
        {(rightIcon || hasError) && (
          <span
            className={cn(
              'absolute right-3 flex items-center pointer-events-none',
              hasError ? 'text-risk-critical' : 'text-text-tertiary'
            )}
            aria-hidden="true"
          >
            {hasError ? <AlertCircle size={14} strokeWidth={1.75} /> : rightIcon}
          </span>
        )}
      </div>

      {/* Helper / Error text */}
      {(error || helper) && (
        <p
          id={error ? `${id}-error` : `${id}-helper`}
          className={cn(
            'text-xs',
            error ? 'text-risk-critical' : 'text-text-tertiary'
          )}
          role={error ? 'alert' : undefined}
        >
          {error || helper}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
