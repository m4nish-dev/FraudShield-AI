import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { Sparkles, CheckCircle2, AlertTriangle, Info } from 'lucide-react'

export function AIInvestigationReport({ report }) {
  if (!report) return null

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent" />
          <h3 className="text-lg font-medium text-text-primary">AI Investigation Summary</h3>
          <Badge variant="neutral" className="ml-2 font-mono text-[10px]">claude-sonnet-4.6</Badge>
        </div>
        <Button variant="ghost" size="sm" leftIcon={<Sparkles size={12} />}>
          Regenerate
        </Button>
      </div>

      <div className="text-sm text-text-secondary leading-relaxed space-y-4">
        <p>{report.summary}</p>
        
        {report.keyFindings && (
          <div className="space-y-2 mt-4">
            <h4 className="font-medium text-text-primary">Key Findings</h4>
            <ul className="space-y-2">
              {report.keyFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-risk-low mt-0.5 shrink-0" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {report.attackProgression && (
          <div className="space-y-2 mt-4">
            <h4 className="font-medium text-text-primary">Attack Progression</h4>
            <ol className="list-decimal pl-5 space-y-1">
              {report.attackProgression.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {report.recommendedAction && (
        <div className="bg-risk-high-bg border border-risk-high-border rounded-lg p-4 mt-2 flex items-start gap-3">
          <AlertTriangle size={18} className="text-risk-high shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-medium text-risk-high">Recommended Action: {report.recommendedAction.title}</span>
            <span className="text-sm text-text-secondary">{report.recommendedAction.reasoning}</span>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-border-subtle flex items-center gap-2 text-xs text-text-tertiary">
        <Info size={12} />
        <span>Grounded in 14 structured evidence items · No independent labeling</span>
      </div>
    </div>
  )
}
