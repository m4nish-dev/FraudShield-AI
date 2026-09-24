import { ArrowRight } from 'lucide-react'
import { getRiskColor } from '../../lib/risk'

export function CounterfactualPanel({ currentScore, projectedScore, condition }) {
  const curColor = getRiskColor(currentScore)
  const projColor = getRiskColor(projectedScore)

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg bg-surface border border-border-default mt-6">
      <h4 className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
        Counterfactual Analysis
      </h4>
      <p className="text-sm text-text-secondary leading-snug">
        <span className="font-medium text-text-primary">If</span> {condition}
      </p>
      
      <div className="flex items-center gap-6 mt-2">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-text-tertiary">Current</span>
          <span className="text-2xl font-display tabular font-semibold" style={{ color: curColor }}>
            {currentScore.toFixed(1)}%
          </span>
        </div>
        
        <ArrowRight size={20} className="text-text-disabled" />
        
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-text-tertiary">Projected</span>
          <span className="text-2xl font-display tabular font-semibold" style={{ color: projColor }}>
            {projectedScore.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  )
}
