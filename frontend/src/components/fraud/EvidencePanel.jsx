import Badge from '../ui/Badge'
import { getRiskColor, getRiskLevel } from '../../lib/risk'

const SEV_COLOR = {
  critical: '#F43F5E', high: '#FB923C',
  medium: '#FACC15', low: '#4ADE80', safe: '#22D3EE',
}

export function EvidencePanel({ evidence = [] }) {
  return (
    <div className="flex flex-col gap-3">
      {evidence.map((item, idx) => (
        <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-inset border border-border-default">
          <div className="flex items-center gap-2 shrink-0 pt-0.5">
            <span className="text-xs font-mono text-text-disabled w-4 text-right">
              {idx + 1}.
            </span>
            <span
              className="h-2 w-2 rounded-sm shrink-0"
              style={{ backgroundColor: SEV_COLOR[item.sev] || '#71717A' }}
              aria-hidden="true"
            />
          </div>
          <p className="flex-1 text-sm text-text-secondary leading-snug">
            {item.claim}
          </p>
          <Badge variant="neutral" className="shrink-0">{item.model}</Badge>
        </div>
      ))}
    </div>
  )
}
