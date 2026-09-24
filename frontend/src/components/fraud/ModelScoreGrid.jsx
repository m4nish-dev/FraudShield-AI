import { cn } from '../../lib/cn'
import RiskBar from '../ui/RiskBar'
import Tooltip from '../ui/Tooltip'
import { getRiskColor, getRiskLevel, getRiskLabel } from '../../lib/risk'

const MODEL_META = [
  { key: 'transaction', display: 'Transaction', short: 'TXN' },
  { key: 'behaviour',   display: 'Behaviour',   short: 'BHV' },
  { key: 'anomaly',     display: 'Anomaly',      short: 'ANM' },
  { key: 'temporal',    display: 'Temporal',     short: 'TMP' },
  { key: 'graph',       display: 'Graph',        short: 'GRF' },
]

/**
 * ModelScoreGrid — 5-column grid of model score mini-cards.
 *
 * @prop {{ transaction, behaviour, anomaly, temporal, graph }} modelScores
 * @prop {number} [fusionScore]
 * @prop {'default'|'compact'} [variant]
 */
export function ModelScoreGrid({ modelScores = {}, fusionScore, variant = 'default', className }) {
  const isCompact = variant === 'compact'

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="grid grid-cols-5 gap-2">
        {MODEL_META.map(({ key, display, short }) => {
          const score  = modelScores[key] ?? 0
          const color  = getRiskColor(score)
          const level  = getRiskLevel(score)

          return (
            <Tooltip key={key} content={`${display} Model — ${getRiskLabel(score)} (${score.toFixed(1)})`} placement="top">
              <div
                className={cn(
                  'flex flex-col gap-2 bg-inset border border-border-default rounded-lg cursor-default',
                  'hover:border-border-strong transition-colors duration-150',
                  isCompact ? 'p-2.5' : 'p-3'
                )}
              >
                {/* Model label */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-tertiary uppercase tracking-wider font-medium">
                    {isCompact ? short : display}
                  </span>
                  {/* Confidence dot */}
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                    aria-label={`${display} model: ${level} risk`}
                  />
                </div>

                {/* Score */}
                <span
                  className={cn(
                    'font-display font-semibold tabular leading-none metric-number',
                    isCompact ? 'text-xl' : 'text-2xl'
                  )}
                  style={{ color }}
                >
                  {score.toFixed(1)}
                </span>

                {/* Mini bar */}
                <RiskBar score={score} height="xs" />

                {/* Level label */}
                {!isCompact && (
                  <span className="text-xs text-text-tertiary capitalize">{level}</span>
                )}
              </div>
            </Tooltip>
          )
        })}
      </div>

      {/* Fusion score row */}
      {fusionScore !== undefined && (
        <div className="flex items-center gap-3 px-1">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-text-tertiary">Fusion Score</span>
          </div>
          <div className="flex-1 h-1 bg-inset rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${fusionScore}%`,
                backgroundColor: getRiskColor(fusionScore),
                boxShadow: `0 0 6px ${getRiskColor(fusionScore)}44`,
              }}
            />
          </div>
          <span
            className="text-sm font-mono tabular font-semibold shrink-0"
            style={{ color: getRiskColor(fusionScore) }}
          >
            {fusionScore.toFixed(1)}
          </span>
        </div>
      )}
    </div>
  )
}

ModelScoreGrid.displayName = 'ModelScoreGrid'
export default ModelScoreGrid
