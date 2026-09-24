import { useState } from 'react'
import { Calendar, Search, Activity, Flag, Clock } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts'
import PageHeader from '../components/layout/PageHeader'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import { formatTime } from '../lib/format'

const MOCK_DATA = [
  { time: '2026-09-24T00:00:00Z', score: 10 },
  { time: '2026-09-24T02:00:00Z', score: 12 },
  { time: '2026-09-24T04:00:00Z', score: 15 },
  { time: '2026-09-24T06:00:00Z', score: 18 },
  { time: '2026-09-24T08:00:00Z', score: 25 },
  { time: '2026-09-24T09:14:00Z', score: 42 },
  { time: '2026-09-24T10:18:00Z', score: 68 }, // Crossed 60
  { time: '2026-09-24T10:21:00Z', score: 85 }, // Crossed 80
  { time: '2026-09-24T12:00:00Z', score: 94 },
]

const ESCALATION_EVENTS = [
  { time: '10:18', label: 'Early Warning Threshold Crossed (68.0)', model: 'Temporal' },
  { time: '10:21', label: 'Fraud Confirmed Threshold Crossed (85.0)', model: 'Ensemble' },
  { time: '10:26', label: 'Analyst Case FS-10042 Auto-Generated', model: 'System' },
]

export default function RiskTimeline() {
  const [showWarning, setShowWarning] = useState(true)

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
    <div className="min-h-full flex flex-col">
      <PageHeader
        title="Risk Timeline"
        subtitle="Per-account risk trajectory and historical baseline deviations"
      />
      <div className="flex-1 p-6 flex flex-col gap-6">
        
        {/* Top Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Input 
              id="account-selector" 
              placeholder="Search account ID..." 
              leftIcon={<Search size={14} />} 
              defaultValue="ACC-89240-IN"
              wrapperClassName="w-64"
            />
            <Input 
              id="date-range" 
              placeholder="Select Date" 
              leftIcon={<Calendar size={14} />} 
              defaultValue="Sep 24, 2026"
              wrapperClassName="w-48"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showWarning} 
              onChange={e => setShowWarning(e.target.checked)} 
              className="accent-accent"
            />
            <span className="text-sm text-text-secondary">Show early warning threshold (60)</span>
          </label>
        </div>

        <div className="grid grid-cols-4 gap-6 items-start">
          {/* Main Chart Column */}
          <div className="col-span-3 flex flex-col gap-6">
            <Card>
              <Card.Header title="Risk Trajectory" />
              <Card.Body>
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_DATA} margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
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
                      
                      {showWarning && (
                        <ReferenceLine y={60} stroke="#FACC15" strokeDasharray="3 3" strokeOpacity={0.5} label={{ position: 'insideTopLeft', value: 'Early Warning (60)', fill: '#FACC15', fontSize: 10, fontFamily: 'monospace' }} />
                      )}
                      <ReferenceLine y={80} stroke="#F43F5E" strokeDasharray="3 3" strokeOpacity={0.5} label={{ position: 'insideTopLeft', value: 'Critical (80)', fill: '#F43F5E', fontSize: 10, fontFamily: 'monospace' }} />
                      
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#38BDF8"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorScore)"
                        activeDot={{ r: 5, fill: '#22D3EE', strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>

            {/* StatCards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-surface border border-border-default rounded-lg p-4 flex flex-col gap-1">
                <span className="text-xs text-text-tertiary uppercase tracking-wider flex items-center gap-1.5"><Activity size={12}/> Early Warning At</span>
                <span className="text-xl font-mono text-text-primary">10:18 IST</span>
              </div>
              <div className="bg-surface border border-border-default rounded-lg p-4 flex flex-col gap-1">
                <span className="text-xs text-text-tertiary uppercase tracking-wider flex items-center gap-1.5"><Flag size={12}/> Fraud Confirmed At</span>
                <span className="text-xl font-mono text-risk-critical">10:21 IST</span>
              </div>
              <div className="bg-surface border border-border-default rounded-lg p-4 flex flex-col gap-1">
                <span className="text-xs text-text-tertiary uppercase tracking-wider flex items-center gap-1.5"><Clock size={12}/> Lead Time</span>
                <span className="text-xl font-mono text-accent">3 mins</span>
              </div>
            </div>
          </div>

          {/* Right Rail */}
          <div className="col-span-1">
            <Card>
              <Card.Header title="Escalation Events" />
              <Card.Body className="p-0">
                <div className="flex flex-col relative p-4 gap-6">
                  <div className="absolute left-6 top-6 bottom-6 w-px bg-border-strong" />
                  {ESCALATION_EVENTS.map((ev, i) => (
                    <div key={i} className="flex gap-4 relative z-10">
                      <div className="w-4 h-4 rounded-full bg-surface border-2 border-accent mt-0.5" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-mono text-text-tertiary tabular">{ev.time}</span>
                        <span className="text-sm text-text-secondary leading-snug">{ev.label}</span>
                        <span className="text-[10px] uppercase font-bold text-text-disabled mt-1">{ev.model}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
