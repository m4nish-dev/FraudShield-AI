import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine, ReferenceArea, Tooltip, Dot } from 'recharts'
import { formatTime } from '../../lib/format'

export function RiskTrajectory({ data = [], threshold = 70, earlyWarningTime, confirmedTime }) {
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const { time, score } = payload[0].payload
    return (
      <div className="bg-elevated border border-border-default rounded-lg p-2 shadow-elevated">
        <p className="text-xs text-text-tertiary mb-1">{formatTime(time)}</p>
        <p className="text-sm font-mono text-text-primary">
          Score: <span className="text-accent">{score}%</span>
        </p>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
            <XAxis
              dataKey="time"
              tickFormatter={(t) => formatTime(t)}
              tick={{ fontSize: 11, fill: '#71717A', fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              minTickGap={30}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#71717A', fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Threshold band */}
            <ReferenceArea y1={threshold} y2={100} fill="#F43F5E" fillOpacity={0.05} />
            <ReferenceLine y={threshold} stroke="#F43F5E" strokeDasharray="3 3" strokeOpacity={0.5} />
            
            <Line
              type="monotone"
              dataKey="score"
              stroke="#38BDF8"
              strokeWidth={2}
              dot={{ r: 3, fill: '#38BDF8', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#22D3EE', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between items-center px-4 text-xs">
        {earlyWarningTime && (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-risk-high" />
            <span className="text-text-secondary">Early Warning · {formatTime(earlyWarningTime)}</span>
          </div>
        )}
        {confirmedTime && (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-risk-critical" />
            <span className="text-text-secondary">Confirmed · {formatTime(confirmedTime)}</span>
          </div>
        )}
      </div>
      <div className="px-4">
        <span className="text-xs font-mono text-text-tertiary">
          Lead time: {earlyWarningTime && confirmedTime ? Math.floor((new Date(confirmedTime).getTime() - new Date(earlyWarningTime).getTime()) / 60000) : '--'} minutes
        </span>
      </div>
    </div>
  )
}
