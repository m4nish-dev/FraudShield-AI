import { ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import { getRiskLevel } from '../../lib/risk'
import { formatTime, formatRelative, truncateId } from '../../lib/format'
import RiskBadge from '../ui/RiskBadge'

const SEVERITY_DOT = {
  critical: 'bg-risk-critical',
  high:     'bg-risk-high',
  medium:   'bg-risk-medium',
  low:      'bg-risk-low',
  safe:     'bg-risk-safe',
}

/**
 * AlertRow — compact alert list item.
 *
 * @prop {object}   alert       — alert data object from alerts.json
 * @prop {Function} onClick     — row click handler
 * @prop {boolean}  active      — highlighted state (current selection)
 */
export function AlertRow({ alert, onClick, active = false, className }) {
  const severity  = alert.severity ?? getRiskLevel(alert.risk_score)
  const dotClass  = SEVERITY_DOT[severity] ?? 'bg-text-tertiary'

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(alert)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(alert)
        }
      }}
      aria-label={`Alert: ${alert.title}, severity ${severity}, ${formatRelative(alert.created_at)}`}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'flex items-center gap-3 px-4 py-3',
        'border-b border-border-subtle last:border-0',
        'transition-colors duration-100 cursor-pointer select-none',
        active
          ? 'bg-elevated'
          : 'hover:bg-elevated',
        className
      )}
    >
      {/* ── Severity dot ──────────────────────────────────────── */}
      <span
        className={cn(
          'flex-shrink-0 h-2 w-2 rounded-full',
          dotClass
        )}
        aria-hidden="true"
      />

      {/* ── Timestamp ─────────────────────────────────────────── */}
      <span
        className="flex-shrink-0 w-16 text-xs text-text-tertiary mono-tabular hidden sm:block"
        title={alert.created_at}
      >
        {formatTime(alert.created_at)}
      </span>

      {/* ── Title + ref ───────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className="text-sm font-medium text-text-primary truncate">
          {alert.title}
        </span>
        <div className="flex items-center gap-2">
          {alert.transaction_id && (
            <span className="text-xs text-text-tertiary mono-tabular">
              {truncateId(alert.transaction_id, 8, 4)}
            </span>
          )}
          {alert.case_id && (
            <span className="text-xs text-text-disabled">
              {alert.case_id}
            </span>
          )}
        </div>
      </div>

      {/* ── Risk badge ────────────────────────────────────────── */}
      <div className="flex-shrink-0">
        <RiskBadge score={alert.risk_score} />
      </div>

      {/* ── Chevron ───────────────────────────────────────────── */}
      <ChevronRight
        size={14}
        strokeWidth={1.75}
        className="flex-shrink-0 text-text-disabled"
        aria-hidden="true"
      />
    </div>
  )
}

AlertRow.displayName = 'AlertRow'
export default AlertRow
