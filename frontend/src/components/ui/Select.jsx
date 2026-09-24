import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

/**
 * Select — styled native select matching Input visual design.
 *
 * @prop {string}      label
 * @prop {string}      error
 * @prop {string}      helper
 * @prop {string}      placeholder
 * @prop {Array}       options      — [{ value, label, disabled? }]
 */
export const Select = forwardRef(function Select(
  {
    label,
    error,
    helper,
    id,
    placeholder,
    options = [],
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
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${id}-error` : helper ? `${id}-helper` : undefined
          }
          className={cn(
            'w-full h-9 appearance-none bg-inset rounded-md text-sm',
            'border transition-all duration-150 ease-out',
            'pr-8 pl-3',
            'focus:outline-none focus:ring-2',
            hasError
              ? 'border-risk-critical text-text-primary focus:border-risk-critical focus:ring-risk-critical/20'
              : 'border-border-default text-text-primary hover:border-border-strong focus:border-accent focus:ring-accent/20',
            disabled && 'opacity-40 cursor-not-allowed',
            // Style the option elements in dark mode
            '[&>option]:bg-elevated [&>option]:text-text-primary',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
            >
              {opt.label}
            </option>
          ))}
        </select>

        {/* Chevron icon overlay */}
        <ChevronDown
          size={14}
          strokeWidth={1.75}
          className={cn(
            'absolute right-2.5 pointer-events-none',
            hasError ? 'text-risk-critical' : 'text-text-tertiary'
          )}
          aria-hidden="true"
        />
      </div>

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

Select.displayName = 'Select'
export default Select
