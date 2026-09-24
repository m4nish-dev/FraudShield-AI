import { cn } from '../../lib/cn'
import { getRiskLevel, getRiskColor, getRiskLabel } from '../../lib/risk'

const HEIGHT_CLASSES = {
  xs: 'h-0.5',
  sm: 'h-1',
  md: 'h-1.5',
}

// Risk level → gradient stop color (left=lower, right=higher risk)
const LEVEL_GRADIENT = {
  safe:     'from-risk-safe     to-risk-safe',
  low:      'from-risk-low      to-risk-low',
  medium:   'from-risk-medium   to-risk-medium',
  high:     'from-risk-high     to-risk-high',
  critical: 'from-risk-critical to-risk-critical',
}

/**
 * RiskBar — horizontal progress bar visualizing a risk score.
 *
 * @prop {number} score        0–100
 * @prop {'xs'|'sm'|'md'} height
 * @prop {boolean} showLabel   show label + score above bar
 * @prop {string} className
 */
export function RiskBar({ score = 0, height = 'sm', showLabel = false, className }) {
  const clamped = Math.max(0, Math.min(100, score))
  const level   = getRiskLevel(clamped)
  const label   = getRiskLabel(clamped)
  const color   = getRiskColor(clamped)

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-tertiary font-medium">{label}</span>
          <span
            className="tabular text-xs font-medium"
            style={{ color, fontFamily: '"JetBrains Mono", monospace' }}
          >
            {clamped.toFixed(1)}
          </span>
        </div>
      )}

      {/* Track */}
      <div
        className={cn(
          'relative w-full rounded-full overflow-hidden bg-inset',
          HEIGHT_CLASSES[height]
        )}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Risk score: ${clamped.toFixed(1)} — ${label}`}
      >
        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full risk-bar-fill"
          style={{
            width: `${clamped}%`,
            backgroundColor: color,
            boxShadow: clamped > 0 ? `0 0 6px ${color}55` : 'none',
          }}
        />
      </div>
    </div>
  )
}

RiskBar.displayName = 'RiskBar'
export default RiskBar
