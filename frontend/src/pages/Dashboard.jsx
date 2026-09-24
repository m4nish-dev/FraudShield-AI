import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts'
import {
  ArrowLeftRight, AlertTriangle, ShieldAlert, Radar,
  Download, Users, ArrowRight, Activity, TrendingUp,
  ChevronRight, Clock, Zap,
} from 'lucide-react'
import { motion } from 'framer-motion'

import PageHeader   from '../components/layout/PageHeader'
import Card         from '../components/ui/Card'
import Button       from '../components/ui/Button'
import Badge        from '../components/ui/Badge'
import RiskBadge    from '../components/ui/RiskBadge'
import RiskBar      from '../components/ui/RiskBar'
import Select       from '../components/ui/Select'
import Divider      from '../components/ui/Divider'
import StatCard     from '../components/shared/StatCard'
import AlertRow     from '../components/shared/AlertRow'

import transactions from '../mock/transactions.json'
import alerts       from '../mock/alerts.json'
import campaigns    from '../mock/campaigns.json'
import timeline     from '../mock/timeline.json'
import { cn }       from '../lib/cn'
import { formatINR, formatCompact, formatRelative } from '../lib/format'
import { getRiskLevel, getRiskColor }               from '../lib/risk'

// ─── Design tokens (inline where Tailwind can't reach dynamic values) ──
const COLORS = {
  accent:   '#38BDF8',
  critical: '#F43F5E',
  high:     '#FB923C',
  medium:   '#FACC15',
  low:      '#4ADE80',
  safe:     '#22D3EE',
  surface:  '#111113',
  elevated: '#17171A',
  subtle:   '#1F1F23',
  tertiary: '#71717A',
}

// ─── Derived stats ─────────────────────────────────────────────────────
function useStats() {
  return useMemo(() => {
    const totalScanned = 12482
    const suspicious   = transactions.filter(t => t.riskScore >= 60).length + 163
    const highRiskCases = 27
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length

    // Risk distribution
    const dist = { critical: 0, high: 0, medium: 0, low: 0, safe: 0 }
    transactions.forEach(t => {
      dist[getRiskLevel(t.riskScore)]++
    })
    const distTotal = Object.values(dist).reduce((a, b) => a + b, 0)

    // Model scores (mock live values)
    const modelPerf = [
      { name: 'Transaction',  confidence: 87.3, status: 'nominal', precision: 0.892, recall: 0.841 },
      { name: 'Behaviour',    confidence: 91.2, status: 'nominal', precision: 0.918, recall: 0.879 },
      { name: 'Anomaly',      confidence: 94.1, status: 'nominal', precision: 0.947, recall: 0.931 },
      { name: 'Temporal',     confidence: 82.8, status: 'degraded', precision: 0.841, recall: 0.793 },
      { name: 'Graph',        confidence: 88.7, status: 'nominal', precision: 0.901, recall: 0.862 },
    ]

    return { totalScanned, suspicious, highRiskCases, activeCampaigns, dist, distTotal, modelPerf }
  }, [])
}

// ─── Sparkline data ────────────────────────────────────────────────────
const scannedSpark = timeline.map((d, i) => ({ v: d.volume }))
const suspiciousSpark = timeline.map(d => ({ v: Math.round(d.riskScore * 2.1) }))
const riskSpark = timeline.map(d => ({ v: d.riskScore }))
const campaignSpark = [
  { v: 6 }, { v: 6 }, { v: 7 }, { v: 7 }, { v: 7 },
  { v: 8 }, { v: 8 }, { v: 8 }, { v: 8 }, { v: 8 },
]

// ─── Custom Chart Tooltip ──────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-elevated border border-border-default rounded-lg p-3 shadow-elevated min-w-[140px]">
      <p className="text-xs text-text-tertiary font-mono mb-2">{label}</p>
      {payload.map(({ name, value, color }) => (
        <div key={name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-text-secondary capitalize">{name}</span>
          </div>
          <span className="text-xs font-mono tabular text-text-primary font-medium">
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Chart Tab Switcher ────────────────────────────────────────────────
function ChartTabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1 text-xs font-medium rounded-md transition-all duration-150',
        active
          ? 'bg-elevated text-text-primary border border-border-default'
          : 'text-text-tertiary hover:text-text-secondary'
      )}
    >
      {children}
    </button>
  )
}

// ─── Risk Distribution Row ─────────────────────────────────────────────
function RiskDistRow({ level, count, total, color, label }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 w-20 shrink-0">
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-xs text-text-secondary">{label}</span>
      </div>
      <div className="flex-1 h-1.5 bg-inset rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="flex items-center gap-2 shrink-0 w-16 justify-end">
        <span className="text-xs font-mono tabular text-text-primary">{count}</span>
        <span className="text-xs text-text-disabled">
          {pct.toFixed(0)}%
        </span>
      </div>
    </div>
  )
}

// ─── Model Performance Row ─────────────────────────────────────────────
function ModelRow({ model }) {
  const isNominal = model.status === 'nominal'
  return (
    <div className="flex items-center gap-3">
      {/* Status dot */}
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full shrink-0',
          isNominal ? 'bg-risk-low' : 'bg-risk-medium'
        )}
      />
      {/* Name */}
      <span className="text-sm text-text-secondary w-24 shrink-0">{model.name}</span>
      {/* Bar */}
      <div className="flex-1 h-1 bg-inset rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${model.confidence}%`,
            backgroundColor: isNominal ? COLORS.accent : COLORS.medium,
            boxShadow: isNominal ? `0 0 4px ${COLORS.accent}44` : 'none',
          }}
        />
      </div>
      {/* Confidence */}
      <span
        className="text-xs font-mono tabular w-10 text-right shrink-0"
        style={{ color: isNominal ? COLORS.accent : COLORS.medium }}
      >
        {model.confidence.toFixed(1)}%
      </span>
    </div>
  )
}

// ─── Campaign Mini Card ────────────────────────────────────────────────
function CampaignCard({ campaign }) {
  const riskColor = getRiskColor(campaign.riskScore)
  const isActive  = campaign.status === 'active'

  return (
    <Link to={`/campaigns/${campaign.id}`} className="block">
      <motion.div
        whileHover={{ y: -1, borderColor: '#3A3A42' }}
        transition={{ duration: 0.15 }}
        className="flex-shrink-0 w-[260px] bg-elevated border border-border-default rounded-xl p-4 flex flex-col gap-3 cursor-pointer"
        style={{
          borderTopColor: isActive ? `${riskColor}44` : undefined,
          borderTopWidth: isActive ? '1px' : undefined,
        }}
      >
        {/* Top: name + status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-sm font-semibold text-text-primary truncate">
              {campaign.name}
            </span>
            <span className="text-xs text-text-tertiary truncate">{campaign.type}</span>
          </div>
          <Badge
            variant={isActive ? 'danger' : 'neutral'}
            dot={isActive}
            className="shrink-0"
          >
            {isActive ? 'Active' : 'Contained'}
          </Badge>
        </div>

        {/* Risk bar */}
        <RiskBar score={campaign.riskScore} height="xs" />

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-text-tertiary">
          <div className="flex items-center gap-1">
            <Users size={11} strokeWidth={1.75} />
            <span className="font-mono tabular text-text-secondary">
              {campaign.accountsInvolved.toLocaleString('en-IN')}
            </span>
          </div>
          <Divider orientation="vertical" className="h-3" />
          <span className="font-mono tabular text-text-secondary">
            {formatCompact(campaign.estimatedLoss)}
          </span>
          <Divider orientation="vertical" className="h-3" />
          <span>{formatRelative(campaign.discoveredAt)}</span>
        </div>

        {/* Footer: investigate */}
        <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
          <span className="text-xs text-text-disabled font-mono">{campaign.id}</span>
          <div className="flex items-center gap-1 text-accent text-xs font-medium">
            <span>Investigate</span>
            <ArrowRight size={11} strokeWidth={2} />
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

// ─── Dashboard Page ────────────────────────────────────────────────────
export default function Dashboard() {
  const [dateRange, setDateRange] = useState('24h')
  const [chartTab, setChartTab]   = useState('volume')
  const stats = useStats()

  // Chart data key based on tab
  const chartDataKey = chartTab === 'volume'
    ? 'volume'
    : chartTab === 'risk'
    ? 'riskScore'
    : 'alerts'

  // Top 8 high-severity alerts
  const recentAlerts = useMemo(() =>
    [...alerts]
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 8),
    []
  )

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.04 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  }

  return (
    <div className="min-h-full">
      {/* ── Page Header ───────────────────────────────────────────── */}
      <PageHeader
        title="Fraud Intelligence Overview"
        subtitle="Real-time monitoring across all detection layers"
        actions={
          <div className="flex items-center gap-2">
            <Select
              id="dashboard-daterange"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              options={[
                { value: '1h',    label: 'Last 1 hour' },
                { value: '24h',   label: 'Last 24 hours' },
                { value: '7d',    label: 'Last 7 days' },
                { value: '30d',   label: 'Last 30 days' },
              ]}
              wrapperClassName="w-40"
            />
            <Button
              variant="secondary"
              size="md"
              leftIcon={<Download size={14} strokeWidth={1.75} />}
            >
              Export
            </Button>
          </div>
        }
      />

      {/* ── Content ───────────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-6 flex flex-col gap-6"
      >
        {/* ══ ROW 1 — Stat Cards ══════════════════════════════════════ */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-4 gap-4"
        >
          <StatCard
            label="Transactions Scanned"
            value={formatCompact(stats.totalScanned)}
            delta={8.2}
            deltaLabel="vs yesterday"
            icon={ArrowLeftRight}
            sparkline={scannedSpark}
            sparkColor={COLORS.accent}
          />
          <StatCard
            label="Suspicious Activity"
            value={stats.suspicious.toLocaleString('en-IN')}
            delta={12.4}
            deltaLabel="vs yesterday"
            icon={AlertTriangle}
            sparkline={suspiciousSpark}
            sparkColor={COLORS.medium}
          />
          <StatCard
            label="High Risk Cases"
            value={stats.highRiskCases}
            delta={-3.1}
            deltaLabel="vs yesterday"
            icon={ShieldAlert}
            sparkline={riskSpark}
            sparkColor={COLORS.critical}
          />
          <StatCard
            label="Active Campaigns"
            value={stats.activeCampaigns}
            delta={0}
            deltaLabel="no change"
            icon={Radar}
            sparkline={campaignSpark}
            sparkColor={COLORS.high}
          />
        </motion.div>

        {/* ══ ROW 2 — Risk Trend + Distribution ═══════════════════════ */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">

          {/* Left: Risk Trend Chart (col-span-2) */}
          <Card className="col-span-2">
            <Card.Header
              title="Risk Trend — Last 24 Hours"
              subtitle="Transaction volume and risk-weighted signal over time"
              actions={
                <div className="flex items-center gap-1 p-0.5 bg-inset rounded-md border border-border-subtle">
                  <ChartTabBtn active={chartTab === 'volume'} onClick={() => setChartTab('volume')}>Volume</ChartTabBtn>
                  <ChartTabBtn active={chartTab === 'risk'}   onClick={() => setChartTab('risk')}>Risk Score</ChartTabBtn>
                  <ChartTabBtn active={chartTab === 'alerts'} onClick={() => setChartTab('alerts')}>Alerts</ChartTabBtn>
                </div>
              }
            />
            <Card.Body className="p-0 pt-2 pb-4 px-2">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart
                  data={timeline}
                  margin={{ top: 10, right: 16, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="riskAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={COLORS.accent} stopOpacity={0.15} />
                      <stop offset="100%" stopColor={COLORS.accent} stopOpacity={0}    />
                    </linearGradient>
                    <linearGradient id="volumeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={COLORS.tertiary} stopOpacity={0.18} />
                      <stop offset="100%" stopColor={COLORS.tertiary} stopOpacity={0}    />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    horizontal={true}
                    vertical={false}
                    stroke={COLORS.subtle}
                    strokeDasharray="3 3"
                    strokeOpacity={0.6}
                  />
                  <XAxis
                    dataKey="hour"
                    tick={{
                      fontSize: 11,
                      fontFamily: '"JetBrains Mono", monospace',
                      fill: COLORS.tertiary,
                    }}
                    axisLine={false}
                    tickLine={false}
                    interval={3}
                  />
                  <YAxis
                    hide={true}
                    domain={['auto', 'auto']}
                  />
                  <RechartsTooltip
                    content={<ChartTooltip />}
                    cursor={{ stroke: '#3A3A42', strokeWidth: 1, strokeDasharray: '4 2' }}
                  />

                  {/* Volume line (subtle) — only shown when on volume tab */}
                  {chartTab === 'volume' && (
                    <Area
                      type="monotone"
                      dataKey="volume"
                      name="Volume"
                      stroke={COLORS.tertiary}
                      strokeWidth={1.5}
                      fill="url(#volumeAreaGrad)"
                      dot={false}
                      activeDot={{ r: 4, fill: COLORS.tertiary, strokeWidth: 0 }}
                    />
                  )}

                  {/* Risk-weighted line (accent) */}
                  {(chartTab === 'volume' || chartTab === 'risk') && (
                    <Area
                      type="monotone"
                      dataKey={chartTab === 'risk' ? 'riskScore' : 'riskWeighted'}
                      name={chartTab === 'risk' ? 'Risk Score' : 'Risk-Weighted'}
                      stroke={COLORS.accent}
                      strokeWidth={2}
                      fill="url(#riskAreaGrad)"
                      dot={false}
                      activeDot={{ r: 4, fill: COLORS.accent, strokeWidth: 0 }}
                    />
                  )}

                  {/* Alerts line */}
                  {chartTab === 'alerts' && (
                    <Area
                      type="monotone"
                      dataKey="alerts"
                      name="Alerts"
                      stroke={COLORS.critical}
                      strokeWidth={2}
                      fill="url(#riskAreaGrad)"
                      dot={false}
                      activeDot={{ r: 4, fill: COLORS.critical, strokeWidth: 0 }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="flex items-center gap-4 px-4 pt-1">
                {chartTab === 'volume' && (
                  <>
                    <div className="flex items-center gap-1.5">
                      <div className="h-px w-4" style={{ backgroundColor: COLORS.tertiary }} />
                      <span className="text-xs text-text-tertiary">Total Volume</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-0.5 w-4 rounded-full" style={{ backgroundColor: COLORS.accent }} />
                      <span className="text-xs text-text-tertiary">Risk-Weighted</span>
                    </div>
                  </>
                )}
                {chartTab === 'risk' && (
                  <div className="flex items-center gap-1.5">
                    <div className="h-0.5 w-4 rounded-full" style={{ backgroundColor: COLORS.accent }} />
                    <span className="text-xs text-text-tertiary">Avg Risk Score per Hour</span>
                  </div>
                )}
                {chartTab === 'alerts' && (
                  <div className="flex items-center gap-1.5">
                    <div className="h-0.5 w-4 rounded-full" style={{ backgroundColor: COLORS.critical }} />
                    <span className="text-xs text-text-tertiary">Alerts Triggered per Hour</span>
                  </div>
                )}
                <div className="ml-auto flex items-center gap-1 text-xs text-text-disabled">
                  <Clock size={11} strokeWidth={1.75} />
                  <span>Updated just now</span>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Right: Risk Distribution */}
          <Card>
            <Card.Header
              title="Risk Distribution"
              subtitle="Current scan window"
            />
            <Card.Body className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                {[
                  { level: 'critical', label: 'Critical',  color: COLORS.critical },
                  { level: 'high',     label: 'High',      color: COLORS.high     },
                  { level: 'medium',   label: 'Medium',    color: COLORS.medium   },
                  { level: 'low',      label: 'Low',       color: COLORS.low      },
                  { level: 'safe',     label: 'Safe',      color: COLORS.safe     },
                ].map(({ level, label, color }) => (
                  <RiskDistRow
                    key={level}
                    level={level}
                    label={label}
                    color={color}
                    count={stats.dist[level]}
                    total={stats.distTotal}
                  />
                ))}
              </div>

              <Divider />

              {/* Summary totals */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-text-tertiary">Total Analyzed</span>
                  <span className="text-xl font-display font-semibold tabular text-text-primary metric-number">
                    {stats.distTotal}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-text-tertiary">Flagged</span>
                  <span className="text-xl font-display font-semibold tabular text-risk-critical metric-number">
                    {stats.dist.critical + stats.dist.high}
                  </span>
                </div>
              </div>

              {/* Stacked mini bar */}
              <div className="h-2 w-full rounded-full overflow-hidden flex">
                {[
                  { level: 'critical', color: COLORS.critical },
                  { level: 'high',     color: COLORS.high     },
                  { level: 'medium',   color: COLORS.medium   },
                  { level: 'low',      color: COLORS.low      },
                  { level: 'safe',     color: COLORS.safe     },
                ].map(({ level, color }) => {
                  const pct = stats.distTotal > 0
                    ? (stats.dist[level] / stats.distTotal) * 100
                    : 0
                  return (
                    <div
                      key={level}
                      title={`${level}: ${pct.toFixed(1)}%`}
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  )
                })}
              </div>
            </Card.Body>
          </Card>
        </motion.div>

        {/* ══ ROW 3 — Recent Alerts + Model Performance ════════════════ */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">

          {/* Left: Recent Alerts (col-span-2) */}
          <Card className="col-span-2 flex flex-col">
            <Card.Header
              title="Recent High-Priority Alerts"
              subtitle="Sorted by risk score — last 24 hours"
              actions={
                <Badge variant="danger" dot>
                  {alerts.filter(a => !a.acknowledged).length} unread
                </Badge>
              }
            />
            <div className="flex-1">
              {recentAlerts.map((alert) => (
                <AlertRow
                  key={alert.id}
                  alert={alert}
                  onClick={(a) => {}}
                />
              ))}
            </div>
            <Card.Footer>
              <Link
                to="/alerts"
                className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-300 transition-colors duration-150 font-medium"
              >
                View all {alerts.length} alerts
                <ArrowRight size={14} strokeWidth={1.75} />
              </Link>
            </Card.Footer>
          </Card>

          {/* Right: Model Performance */}
          <Card>
            <Card.Header
              title="Model Performance"
              subtitle="Live confidence scores"
              actions={
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-risk-low" />
                  </span>
                  <span className="text-xs text-text-tertiary">Live</span>
                </div>
              }
            />
            <Card.Body className="flex flex-col gap-5">
              {/* 5 model rows */}
              {stats.modelPerf.map((model) => (
                <ModelRow key={model.name} model={model} />
              ))}

              <Divider />

              {/* Fusion score */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary font-medium">Fusion Score (Weighted)</span>
                  <span
                    className="text-xs font-mono tabular font-semibold"
                    style={{ color: COLORS.accent }}
                  >
                    88.8%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-inset rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: '88.8%',
                      background: `linear-gradient(90deg, ${COLORS.accent}99, ${COLORS.accent})`,
                      boxShadow: `0 0 6px ${COLORS.accent}44`,
                    }}
                  />
                </div>
              </div>

              {/* Degraded model note */}
              <div className="flex items-start gap-2 p-2.5 rounded-md bg-risk-medium-bg border border-risk-medium-border">
                <AlertTriangle
                  size={13}
                  strokeWidth={1.75}
                  className="text-risk-medium shrink-0 mt-0.5"
                />
                <p className="text-xs text-risk-medium leading-relaxed">
                  Temporal model degraded — training data refresh scheduled in 4h.
                </p>
              </div>

              <Divider />

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3 text-center">
                {[
                  { label: 'Precision', value: '91.4%' },
                  { label: 'Recall',    value: '86.1%' },
                  { label: 'F1 Score',  value: '88.7%' },
                  { label: 'Latency',   value: '12ms' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5 bg-inset rounded-md p-2">
                    <span className="text-lg font-display font-semibold tabular text-text-primary metric-number">
                      {value}
                    </span>
                    <span className="text-xs text-text-tertiary">{label}</span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </motion.div>

        {/* ══ ROW 4 — Active Campaigns (full width) ════════════════════ */}
        <motion.div variants={itemVariants}>
          <Card>
            <Card.Header
              title="Active Fraud Campaigns"
              subtitle={`${campaigns.filter(c => c.status === 'active').length} active · ${campaigns.filter(c => c.status === 'contained').length} contained · ${campaigns.filter(c => c.status === 'monitoring').length} monitoring`}
              actions={
                <Link to="/campaigns">
                  <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={13} strokeWidth={1.75} />}>
                    All Campaigns
                  </Button>
                </Link>
              }
            />
            <Card.Body className="px-4 pb-5">
              {/* Horizontal scrollable campaign cards */}
              <div className="flex gap-4 overflow-x-auto pb-1 -mx-1 px-1">
                {campaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            </Card.Body>
          </Card>
        </motion.div>

        {/* ══ Bottom spacer ═════════════════════════════════════════════ */}
        <div className="h-4" />
      </motion.div>
    </div>
  )
}
