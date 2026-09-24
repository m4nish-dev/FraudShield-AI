import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip as RechartsTooltip,
} from 'recharts'
import { cn } from '../../lib/cn'

/**
 * StatCard — compact metric card for Dashboard KPI row.
 *
 * @prop {string}    label         — metric name (uppercase tracking)
 * @prop {string|number} value     — primary big number
 * @prop {string}    [prefix]      — e.g. "₹" rendered before value
 * @prop {number}    [delta]       — percentage change (positive or negative)
 * @prop {string}    [deltaLabel]  — e.g. "vs yesterday"
 * @prop {ReactNode} [icon]        — top-right icon (18px, text-tertiary)
 * @prop {Array}     [sparkline]   — [{ v: number }] for tiny chart
 * @prop {string}    [sparkColor]  — hex color for sparkline line
 * @prop {string}    [className]
 */
export function StatCard({
  label,
  value,
  prefix,
  delta,
  deltaLabel,
  icon: Icon,
  sparkline,
  sparkColor = '#38BDF8',
  className,
}) {
  const hasDelta = delta !== undefined && delta !== null
  const isPositive = hasDelta && delta > 0
  const isNegative = hasDelta && delta < 0
  const isFlat     = hasDelta && delta === 0

  return (
    <div
      className={cn(
        'bg-surface border border-border-default rounded-lg p-5',
        'flex flex-col gap-3 shadow-card',
        'transition-colors duration-150 hover:border-border-strong',
        className
      )}
    >
      {/* ── Top row: label + icon ─────────────────────────────── */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-text-tertiary select-none">
          {label}
        </span>
        {Icon && (
          <Icon
            size={18}
            strokeWidth={1.75}
            className="text-text-tertiary shrink-0"
            aria-hidden="true"
          />
        )}
      </div>

      {/* ── Main value + sparkline ────────────────────────────── */}
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          {/* Big number */}
          <div className="flex items-baseline gap-1">
            {prefix && (
              <span className="text-lg font-mono text-text-secondary">{prefix}</span>
            )}
            <span className="text-3xl font-display font-semibold tabular tracking-tight text-text-primary leading-none metric-number">
              {value}
            </span>
          </div>

          {/* Delta indicator */}
          {hasDelta && (
            <div className="flex items-center gap-1.5">
              {isPositive && (
                <TrendingUp
                  size={12}
                  strokeWidth={2}
                  className="text-risk-low shrink-0"
                  aria-hidden="true"
                />
              )}
              {isNegative && (
                <TrendingDown
                  size={12}
                  strokeWidth={2}
                  className="text-risk-critical shrink-0"
                  aria-hidden="true"
                />
              )}
              {isFlat && (
                <Minus
                  size={12}
                  strokeWidth={2}
                  className="text-text-tertiary shrink-0"
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  'text-xs font-medium tabular',
                  isPositive ? 'text-risk-low'
                    : isNegative ? 'text-risk-critical'
                    : 'text-text-tertiary'
                )}
              >
                {isPositive && '+'}
                {delta?.toFixed(1)}%
              </span>
              {deltaLabel && (
                <span className="text-xs text-text-disabled">{deltaLabel}</span>
              )}
            </div>
          )}
        </div>

        {/* Sparkline */}
        {sparkline && sparkline.length > 1 && (
          <div className="w-20 h-10 shrink-0" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkline}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={sparkColor}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
                <RechartsTooltip
                  content={() => null}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

StatCard.displayName = 'StatCard'
export default StatCard
