import { Link, useNavigate } from 'react-router-dom'
import { Copy, ExternalLink, GitBranch, Waypoints, FileSearch2, CheckCircle2 } from 'lucide-react'
import Button       from '../ui/Button'
import Badge        from '../ui/Badge'
import RiskBadge    from '../ui/RiskBadge'
import Divider      from '../ui/Divider'
import Tooltip      from '../ui/Tooltip'
import ModelScoreGrid from './ModelScoreGrid'
import { getRiskColor, getRiskLevel, getRiskLabel } from '../../lib/risk'
import { formatINR, formatDateTime, formatRelative } from '../../lib/format'
import { cn } from '../../lib/cn'

// ─── Risk Gauge ────────────────────────────────────────────────────────
function RiskGauge({ score, size = 120 }) {
  const r         = size * 0.38
  const cx        = size / 2
  const cy        = size / 2
  const circumf   = 2 * Math.PI * r
  const offset    = circumf - (Math.min(score, 100) / 100) * circumf
  const color     = getRiskColor(score)
  const trackW    = size * 0.07
  const scoreSize = size * 0.22

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {/* Glow filter */}
        <defs>
          <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={r}
          stroke="#17171A"
          strokeWidth={trackW}
          fill="none"
        />
        {/* Progress arc */}
        <circle
          cx={cx} cy={cy} r={r}
          stroke={color}
          strokeWidth={trackW}
          fill="none"
          strokeDasharray={circumf}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          filter="url(#gauge-glow)"
          style={{ transition: 'strokeDashoffset 0.6s ease' }}
        />
      </svg>
      {/* Score centered */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        aria-label={`Risk score: ${score.toFixed(1)}`}
      >
        <span
          className="font-display font-bold tabular leading-none metric-number"
          style={{ color, fontSize: scoreSize }}
        >
          {score.toFixed(1)}
        </span>
        <span className="text-xs text-text-tertiary mt-0.5">/ 100</span>
      </div>
    </div>
  )
}

// ─── KV Row ────────────────────────────────────────────────────────────
function KVRow({ label, value, mono = false, className }) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <dt className="text-xs text-text-tertiary">{label}</dt>
      <dd className={cn(
        'text-sm text-text-primary break-all',
        mono && 'font-mono text-xs'
      )}>
        {value ?? '—'}
      </dd>
    </div>
  )
}

// ─── Signal severity → color ───────────────────────────────────────────
const SEV_COLOR = {
  critical: '#F43F5E',
  high:     '#FB923C',
  medium:   '#FACC15',
  low:      '#4ADE80',
  safe:     '#22D3EE',
}

const TAG_SIGNALS = {
  'velocity_anomaly':    { text: 'Velocity burst — abnormal transaction rate, 6.4× daily baseline', model: 'Temporal',     sev: 'high' },
  'night_transaction':   { text: 'Initiated during high-risk night window (01:00–05:00 IST)', model: 'Temporal',            sev: 'medium' },
  'new_device':          { text: 'First-ever transaction from this device fingerprint', model: 'Behaviour',                 sev: 'high' },
  'geo_anomaly':         { text: 'Origin 1,840km from last confirmed session within 2h — impossible travel', model: 'Anomaly', sev: 'critical' },
  'device_clone':        { text: 'Device fingerprint active on 3 concurrent sessions — probable emulation', model: 'Behaviour', sev: 'critical' },
  'mule_network':        { text: 'Receiver linked to known mule account network via graph analysis', model: 'Graph',        sev: 'critical' },
  'campaign_match':      { text: 'TTP fingerprint matches active campaign CMP-001 signature (94% confidence)', model: 'Graph', sev: 'critical' },
  'shell_company':       { text: 'Beneficiary flagged as potential shell company — GSTIN mismatch', model: 'Graph',         sev: 'critical' },
  'large_transfer':      { text: 'Transfer exceeds 95th percentile for this account type and channel', model: 'Transaction', sev: 'high' },
  'large_amount':        { text: 'Transfer exceeds 95th percentile for this account type and channel', model: 'Transaction', sev: 'high' },
  'bec':                 { text: 'Beneficiary IFSC modified 14 min before transfer — BEC email hallmarks', model: 'Behaviour', sev: 'critical' },
  'synthetic_identity':  { text: 'PAN/Aadhaar sub-patterns linked to synthetic identity document factory', model: 'Anomaly', sev: 'critical' },
  'after_hours':         { text: 'Corporate account at 00:12 IST — no prior after-hours activity in 18 months', model: 'Temporal', sev: 'high' },
  'model_disagreement':  { text: 'Transaction model (21.4%) vs Anomaly model (84.7%) diverge >60 points', model: 'Anomaly', sev: 'medium' },
  'graph_cluster':       { text: 'Entity is in flagged 9-node fraud cluster, 3-hop from known mule', model: 'Graph',        sev: 'critical' },
  'dormant_breach':      { text: 'Account dormant 14 months — ₹1.2L withdrawal without preceding app login', model: 'Temporal', sev: 'high' },
  'dormancy_breach':     { text: 'Account dormant 14 months — ₹1.2L withdrawal without preceding app login', model: 'Temporal', sev: 'high' },
  'p2p_layering':        { text: 'Funds trace through 5-hop P2P chain before reaching terminal account', model: 'Graph',    sev: 'high' },
  'card_testing':        { text: 'Micro-transaction (₹1) followed by escalating amounts — card probe pattern', model: 'Transaction', sev: 'medium' },
  'money_mule':          { text: 'Terminal mule account — receives and immediately forwards to high-risk accounts', model: 'Graph', sev: 'critical' },
  'nach_abuse':          { text: 'NACH mandate activated on dormant account without user-initiated consent', model: 'Transaction', sev: 'high' },
  'ato_burst':           { text: 'Account takeover burst — funds drained across 8 accounts in 26 minutes', model: 'Behaviour', sev: 'critical' },
  'night_drain':         { text: 'Night drain pattern — coordinated ATO burst during low-surveillance window', model: 'Temporal', sev: 'critical' },
  'card_swarm':          { text: '14 cards from same BIN used simultaneously across 6 merchant categories', model: 'Transaction', sev: 'critical' },
  'cnp_fraud':           { text: 'Card-not-present fraud pattern — transaction fingerprint matches known ring', model: 'Transaction', sev: 'high' },
  'bin_cluster':         { text: 'BIN 524179 cluster — 28 declined attempts across 14 terminals in 23 min', model: 'Graph', sev: 'critical' },
  'wire_fraud':          { text: 'Outbound wire to unverified foreign beneficiary — possible wire fraud', model: 'Transaction', sev: 'critical' },
  'cross_border':        { text: 'Session origin in Seychelles via Mumbai CDN proxy — cross-border ATO signal', model: 'Anomaly', sev: 'high' },
  'vpn_detected':        { text: 'VPN/proxy detected — session masked through commercial exit node', model: 'Behaviour',     sev: 'medium' },
  'kyc_mismatch':        { text: 'Document sub-patterns inconsistent with KYC records in 3 dimensions', model: 'Anomaly',   sev: 'critical' },
  'document_recycling':  { text: 'Same document combination linked to 3 distinct account holders', model: 'Anomaly',        sev: 'critical' },
  'pan_mismatch':        { text: 'PAN associated with 3 distinct profiles — document recycling signal', model: 'Anomaly',   sev: 'critical' },
  'ghost_account':       { text: 'Account profile lacks transaction history consistent with stated age', model: 'Behaviour', sev: 'high' },
  'double_sign':         { text: 'Two distinct active sessions for same credentials simultaneously', model: 'Behaviour',     sev: 'critical' },
  'high_withdrawal':     { text: 'Single-day withdrawal at 94th percentile for account\'s lifetime history', model: 'Transaction', sev: 'high' },
  'reporting_threshold': { text: 'Round amount at STR threshold — structured to avoid reporting', model: 'Transaction',     sev: 'low' },
}

function getSignals(tx) {
  const signals = []
  const seen = new Set()

  for (const tag of (tx.tags ?? [])) {
    const s = TAG_SIGNALS[tag]
    if (s && !seen.has(s.text) && signals.length < 4) {
      signals.push(s)
      seen.add(s.text)
    }
  }

  // Fill remaining with highest model score signals
  if (tx.modelScores && signals.length < 5) {
    const sorted = Object.entries(tx.modelScores)
      .sort((a, b) => b[1] - a[1])
    const MODEL_LABELS = {
      transaction: 'Transaction', behaviour: 'Behaviour',
      anomaly: 'Anomaly', temporal: 'Temporal', graph: 'Graph',
    }
    for (const [key, score] of sorted) {
      if (signals.length >= 5) break
      const txt = `${MODEL_LABELS[key]} model scored ${score.toFixed(1)} — highest contributing factor in ensemble`
      if (!seen.has(txt)) {
        const level = getRiskLevel(score)
        signals.push({ text: txt, model: MODEL_LABELS[key], sev: level === 'critical' || level === 'high' ? level : 'medium' })
        seen.add(txt)
      }
    }
  }

  return signals.slice(0, 5)
}

// ─── Status → Badge variant ────────────────────────────────────────────
const STATUS_VARIANT = { blocked: 'danger', review: 'warning', cleared: 'success', pending: 'neutral' }
const STATUS_LABEL   = { blocked: 'Blocked', review: 'Under Review', cleared: 'Cleared', pending: 'Pending' }

// ─── Verdict text ──────────────────────────────────────────────────────
function getVerdict(score) {
  if (score >= 90) return 'Multi-model consensus indicates confirmed high-risk fraud activity.'
  if (score >= 75) return 'Significant risk indicators across multiple models — escalation recommended.'
  if (score >= 60) return 'Elevated risk signal detected — manual review and investigation warranted.'
  if (score >= 40) return 'Moderate anomaly detected — behaviour inconsistent with account history.'
  if (score >= 20) return 'Low-level signal present — monitor for pattern development.'
  return 'No significant fraud indicators detected — transaction appears within normal parameters.'
}

// ─── Shared panel content ──────────────────────────────────────────────
/**
 * TransactionDetailPanel — shared content for both drawer and full page.
 *
 * @prop {object}   tx          — transaction object from mock
 * @prop {'drawer'|'page'} layout
 * @prop {Function} onClose     — used in page mode to navigate back
 */
export function TransactionDetailPanel({ tx, layout = 'drawer', onClose }) {
  const navigate = useNavigate()
  const signals  = getSignals(tx)
  const color    = getRiskColor(tx.riskScore)
  const fusion   = Object.values(tx.modelScores).reduce((s, v) => s + v, 0) / 5

  const handleCopyId = () => {
    navigator.clipboard.writeText(tx.id).catch(() => {})
  }

  // Section wrapper (tighter in drawer, more padding in page)
  const S = ({ title, children }) => (
    <div className="flex flex-col gap-3">
      {title && (
        <h3 className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
          {title}
        </h3>
      )}
      {children}
    </div>
  )

  return (
    <div className={cn('flex flex-col', layout === 'drawer' ? 'gap-6 p-6' : 'gap-8')}>

      {/* ── Risk Overview ─────────────────────────────────────────────── */}
      <S>
        <div className="flex items-center gap-5">
          {/* Circular gauge */}
          <RiskGauge score={tx.riskScore} size={layout === 'page' ? 140 : 120} />

          <div className="flex flex-col gap-2.5 min-w-0">
            <RiskBadge score={tx.riskScore} size="md" />

            <p className="text-sm text-text-secondary leading-relaxed">
              {getVerdict(tx.riskScore)}
            </p>

            {/* Fusion score pill */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-tertiary">Ensemble score:</span>
              <span
                className="text-sm font-mono tabular font-semibold"
                style={{ color }}
              >
                {fusion.toFixed(1)}
              </span>
            </div>

            <Badge
              variant={STATUS_VARIANT[tx.status] ?? 'neutral'}
              dot
            >
              {STATUS_LABEL[tx.status] ?? tx.status}
            </Badge>
          </div>
        </div>
      </S>

      <Divider />

      {/* ── Transaction Facts ─────────────────────────────────────────── */}
      <S title="Transaction Details">
        <dl
          className={cn(
            'grid gap-x-4 gap-y-3',
            layout === 'page' ? 'grid-cols-3' : 'grid-cols-2'
          )}
        >
          <KVRow label="Amount" value={
            <span className="font-mono text-sm text-text-primary">
              ₹{tx.amount.toLocaleString('en-IN')}
            </span>
          } />
          <KVRow label="Channel"  value={tx.channel} />
          <KVRow label="Timestamp" value={
            <span className="font-mono text-xs text-text-primary">
              {formatDateTime(tx.timestamp)}
            </span>
          } />
          <KVRow label="Sender"   value={
            <div>
              <div className="text-sm text-text-primary">{tx.sender.name}</div>
              <div className="font-mono text-xs text-text-tertiary mt-0.5">{tx.sender.id} · {tx.sender.bank}</div>
            </div>
          } />
          <KVRow label="Receiver" value={
            <div>
              <div className="text-sm text-text-primary">{tx.receiver.name}</div>
              <div className="font-mono text-xs text-text-tertiary mt-0.5">{tx.receiver.id} · {tx.receiver.bank}</div>
            </div>
          } />
          <KVRow label="Device" value={
            <span className="font-mono text-xs text-text-primary">{tx.device}</span>
          } />
          <KVRow label="Location" value={
            <span className="text-sm text-text-primary">
              {tx.location.city}, {tx.location.state}
            </span>
          } />
          <KVRow label="IP Address" value={
            <span className="font-mono text-xs text-text-primary">{tx.location.ip}</span>
          } />
        </dl>

        {/* Tags */}
        {tx.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tx.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-xs font-mono text-text-tertiary bg-inset border border-border-default"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </S>

      <Divider />

      {/* ── Model Score Grid ──────────────────────────────────────────── */}
      <S title="Multi-Model Analysis">
        <ModelScoreGrid
          modelScores={tx.modelScores}
          fusionScore={fusion}
        />
      </S>

      <Divider />

      {/* ── Contributing Signals ─────────────────────────────────────── */}
      <S title="Top Contributing Signals">
        <div className="flex flex-col gap-2">
          {signals.map((sig, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 p-2.5 rounded-md bg-inset border border-border-subtle"
            >
              {/* Severity dot */}
              <span
                className="h-2 w-2 rounded-sm shrink-0 mt-1"
                style={{ backgroundColor: SEV_COLOR[sig.sev] ?? '#71717A' }}
                aria-hidden="true"
              />
              {/* Text */}
              <p className="flex-1 text-sm text-text-secondary leading-snug min-w-0">
                {sig.text}
              </p>
              {/* Model badge */}
              <Badge variant="neutral" className="shrink-0">
                {sig.model}
              </Badge>
            </div>
          ))}
        </div>
      </S>

      <Divider />

      {/* ── Quick Actions ─────────────────────────────────────────────── */}
      <S title="Actions">
        <div className={cn(
          'flex gap-2',
          layout === 'page' ? 'flex-row flex-wrap' : 'flex-col'
        )}>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<FileSearch2 size={13} strokeWidth={1.75} />}
            onClick={() => navigate('/investigations')}
          >
            Open Investigation
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<GitBranch size={13} strokeWidth={1.75} />}
            onClick={() => navigate('/attack-chains')}
          >
            View Attack Chain
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Waypoints size={13} strokeWidth={1.75} />}
            onClick={() => navigate('/fraud-network')}
          >
            Network Position
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<CheckCircle2 size={13} strokeWidth={1.75} />}
          >
            Mark Reviewed
          </Button>
          {layout === 'drawer' && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ExternalLink size={13} strokeWidth={1.75} />}
              onClick={() => navigate(`/transactions/${tx.id}`)}
            >
              Full Detail Page
            </Button>
          )}
        </div>
      </S>
    </div>
  )
}

TransactionDetailPanel.displayName = 'TransactionDetailPanel'
export default TransactionDetailPanel
