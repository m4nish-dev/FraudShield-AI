import { cn } from '../../lib/cn'
import { getRiskLevel, getRiskLabel, getRiskColor } from '../../lib/risk'

const LEVEL_CLASSES = {
  safe: {
    wrapper: 'bg-risk-safe-bg border-risk-safe-border text-risk-safe',
    dot:     'bg-risk-safe',
  },
  low: {
    wrapper: 'bg-risk-low-bg border-risk-low-border text-risk-low',
    dot:     'bg-risk-low',
  },
  medium: {
    wrapper: 'bg-risk-medium-bg border-risk-medium-border text-risk-medium',
    dot:     'bg-risk-medium',
  },
  high: {
    wrapper: 'bg-risk-high-bg border-risk-high-border text-risk-high',
    dot:     'bg-risk-high',
  },
  critical: {
    wrapper: 'bg-risk-critical-bg border-risk-critical-border text-risk-critical',
    dot:     'bg-risk-critical',
  },
}

/**
 * RiskBadge — displays risk score as colored badge.
 * Format: ● LEVEL · 87.2
 *
 * @prop {number} score  0–100
 * @prop {boolean} showScore  show numeric score (default true)
 * @prop {'sm'|'md'} size
 */
export function RiskBadge({ score, showScore = true, size = 'sm', className }) {
  const level  = getRiskLevel(score)
  const label  = getRiskLabel(score)
  const styles = LEVEL_CLASSES[level]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border font-medium',
        size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs',
        styles.wrapper,
        className
      )}
      aria-label={`Risk level: ${label}, score ${score?.toFixed(1)}`}
    >
      {/* Colored dot */}
      <span
        className={cn('inline-block rounded-full shrink-0 h-1.5 w-1.5', styles.dot)}
        aria-hidden="true"
      />

      {/* Level label */}
      <span className="uppercase tracking-wider" style={{ fontSize: '10px', letterSpacing: '0.06em' }}>
        {label}
      </span>

      {/* Score value */}
      {showScore && score !== null && score !== undefined && (
        <>
          <span className="text-current opacity-40 select-none">·</span>
          <span className="tabular mono-tabular" style={{ fontSize: '11px' }}>
            {score.toFixed(1)}
          </span>
        </>
      )}
    </span>
  )
}

RiskBadge.displayName = 'RiskBadge'
export default RiskBadge
