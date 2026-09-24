import { Shield, ArrowRight } from 'lucide-react'
import Button from '../ui/Button'
import { cn } from '../../lib/cn'

export function InterventionPanel({ recommendation, reasoning = [], alternatives = [] }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Recommended Action */}
      <div className="bg-elevated border-2 border-accent rounded-lg p-5 flex flex-col gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Shield size={64} />
        </div>
        
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-accent" />
          <span className="text-xs font-medium uppercase tracking-wider text-accent">
            Recommended Action
          </span>
        </div>
        
        <h3 className="text-2xl font-display font-semibold text-text-primary">
          {recommendation}
        </h3>
        
        <ul className="flex flex-col gap-1.5 mt-1 relative z-10">
          {reasoning.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="text-accent mt-0.5">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
        
        <Button variant="primary" className="mt-2 w-full justify-center">
          Execute Recommendation
        </Button>
      </div>

      {/* Alternatives */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider px-1">
          Alternative Actions
        </span>
        <div className="flex flex-col gap-2">
          {alternatives.map((alt) => (
            <button
              key={alt.action}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border text-sm text-left transition-colors",
                "bg-surface border-border-default hover:border-border-strong hover:bg-inset"
              )}
            >
              <div className="flex flex-col">
                <span className="font-medium text-text-primary">{alt.action}</span>
                <span className="text-xs text-text-tertiary">{alt.desc}</span>
              </div>
              <ArrowRight size={14} className="text-text-disabled" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
