import { AlertTriangle, Info } from 'lucide-react'
import { cn } from '../../lib/cn'

export function ModelDisagreement({ agreementText, isDisagreement = false, note }) {
  return (
    <div className={cn(
      'flex flex-col gap-3 p-4 rounded-lg border',
      isDisagreement ? 'bg-risk-medium-bg border-risk-medium-border' : 'bg-inset border-border-default'
    )}>
      <div className="flex items-start gap-2">
        {isDisagreement ? (
          <AlertTriangle size={16} strokeWidth={2} className="text-risk-medium shrink-0 mt-0.5" />
        ) : (
          <Info size={16} strokeWidth={2} className="text-text-tertiary shrink-0 mt-0.5" />
        )}
        <div className="flex flex-col gap-1">
          <p className={cn(
            'text-sm font-medium leading-snug',
            isDisagreement ? 'text-risk-medium' : 'text-text-secondary'
          )}>
            {agreementText}
          </p>
          {note && (
            <p className="text-sm text-text-tertiary leading-relaxed">
              {note}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
