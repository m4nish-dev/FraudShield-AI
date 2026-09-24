import { getRiskColor } from '../../lib/risk'

export function FraudDNAProfile({ profile = [] }) {
  if (!profile || profile.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {profile.map((item, idx) => {
        const color = getRiskColor(item.score)
        return (
          <div key={idx} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-secondary">{item.name}</span>
              <span className="text-xs font-mono tabular" style={{ color }}>{item.score}%</span>
            </div>
            <div className="h-1.5 w-full bg-inset rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${item.score}%`,
                  backgroundColor: color,
                  boxShadow: `0 0 6px ${color}33`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
