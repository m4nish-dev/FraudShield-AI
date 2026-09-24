import { useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Copy, Clock, MapPin, Smartphone,
  CreditCard, Activity, GitBranch, Waypoints,
  FileSearch2, CheckCircle2, AlertTriangle,
} from 'lucide-react'

import Card         from '../components/ui/Card'
import Button       from '../components/ui/Button'
import IconButton   from '../components/ui/IconButton'
import Badge        from '../components/ui/Badge'
import RiskBadge    from '../components/ui/RiskBadge'
import RiskBar      from '../components/ui/RiskBar'
import Divider      from '../components/ui/Divider'
import Tooltip      from '../components/ui/Tooltip'
import { ModelScoreGrid }        from '../components/fraud/ModelScoreGrid'
import { TransactionDetailPanel } from '../components/fraud/TransactionDetailPanel'

import transactions from '../mock/transactions.json'
import { getRiskColor, getRiskLevel, getRiskLabel } from '../lib/risk'
import { formatINR, formatDateTime, formatRelative, formatTime } from '../lib/format'
import { cn } from '../lib/cn'

// ─── Status config ─────────────────────────────────────────────────────
const STATUS_VARIANT = { blocked: 'danger', review: 'warning', cleared: 'success', pending: 'neutral' }
const STATUS_LABEL   = { blocked: 'Blocked', review: 'Under Review', cleared: 'Cleared', pending: 'Pending' }

// ─── Circular Gauge (larger, for full page) ────────────────────────────
function RiskGaugeLarge({ score }) {
  const size = 160
  const r    = size * 0.38
  const cx   = size / 2
  const cy   = size / 2
  const circumf = 2 * Math.PI * r
  const offset  = circumf - (Math.min(score, 100) / 100) * circumf
  const color   = getRiskColor(score)
  const trackW  = size * 0.065

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <defs>
          <filter id="gauge-glow-lg" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={cx} cy={cy} r={r} stroke="#17171A" strokeWidth={trackW} fill="none" />
        <circle
          cx={cx} cy={cy} r={r}
          stroke={color} strokeWidth={trackW} fill="none"
          strokeDasharray={circumf} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          filter="url(#gauge-glow-lg)"
          style={{ transition: 'strokeDashoffset 0.7s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display font-bold tabular leading-none metric-number text-5xl"
          style={{ color }}
          aria-label={`Risk score: ${score.toFixed(1)}`}
        >
          {score.toFixed(1)}
        </span>
        <span className="text-xs text-text-tertiary mt-1">/ 100</span>
      </div>
    </div>
  )
}

// ─── KV Pair ──────────────────────────────────────────────────────────
function KV({ label, children, mono = false }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs text-text-tertiary">{label}</dt>
      <dd className={cn(
        'text-sm text-text-primary leading-snug',
        mono && 'font-mono text-xs'
      )}>
        {children ?? '—'}
      </dd>
    </div>
  )
}

// ─── Signal severity colors ────────────────────────────────────────────
const SEV_COLOR = {
  critical: '#F43F5E', high: '#FB923C',
  medium:   '#FACC15', low: '#4ADE80', safe: '#22D3EE',
}

// ─── Signal map (same as in TransactionDetailPanel) ───────────────────
const TAG_SIGNALS = {
  'velocity_anomaly':   { text: 'Velocity burst — 14 transfers in 18 minutes, 6.4× daily baseline', model: 'Temporal',    sev: 'high'     },
  'night_transaction':  { text: 'Initiated during high-risk night window (01:00–05:00 IST)', model: 'Temporal',            sev: 'medium'   },
  'new_device':         { text: 'First-ever transaction from this device fingerprint', model: 'Behaviour',                  sev: 'high'     },
  'geo_anomaly':        { text: 'Origin 1,840km from last confirmed session — impossible travel signal', model: 'Anomaly', sev: 'critical' },
  'device_clone':       { text: 'Device fingerprint active on 3 concurrent sessions — probable emulation', model: 'Behaviour', sev: 'critical' },
  'mule_network':       { text: 'Receiver linked to known mule account network via graph analysis', model: 'Graph',         sev: 'critical' },
  'campaign_match':     { text: 'TTP fingerprint matches active CMP-001 campaign (94% confidence)', model: 'Graph',         sev: 'critical' },
  'shell_company':      { text: 'Beneficiary flagged as potential shell company — GSTIN mismatch', model: 'Graph',          sev: 'critical' },
  'large_transfer':     { text: 'Amount exceeds 95th percentile for this account type and channel', model: 'Transaction',  sev: 'high'     },
  'bec':                { text: 'Beneficiary IFSC modified 14 min before transfer — BEC email hallmarks', model: 'Behaviour', sev: 'critical' },
  'synthetic_identity': { text: 'PAN/Aadhaar sub-patterns linked to synthetic identity document factory', model: 'Anomaly', sev: 'critical' },
  'after_hours':        { text: 'Corporate account at 00:12 IST — no prior after-hours activity', model: 'Temporal',       sev: 'high'     },
  'model_disagreement': { text: 'Transaction model (21.4%) vs Anomaly model (84.7%) diverge >60 points', model: 'Anomaly', sev: 'medium'  },
  'graph_cluster':      { text: 'Entity in flagged 9-node fraud cluster, 3-hop from known mule', model: 'Graph',           sev: 'critical' },
  'dormant_breach':     { text: 'Account dormant 14 months — withdrawal without preceding login', model: 'Temporal',       sev: 'high'     },
  'dormancy_breach':    { text: 'Account dormant 14 months — withdrawal without preceding login', model: 'Temporal',       sev: 'high'     },
  'p2p_layering':       { text: 'Funds trace through 5-hop P2P chain to terminal account', model: 'Graph',                sev: 'high'     },
  'card_testing':       { text: 'Micro-transaction (₹1) followed by escalating amounts — card probe', model: 'Transaction', sev: 'medium'  },
  'money_mule':         { text: 'Terminal mule account — receives and immediately forwards funds', model: 'Graph',          sev: 'critical' },
  'nach_abuse':         { text: 'NACH mandate activated without user-initiated consent', model: 'Transaction',             sev: 'high'     },
  'ato_burst':          { text: 'ATO burst — funds drained across 8 accounts in 26 minutes', model: 'Behaviour',          sev: 'critical' },
  'card_swarm':         { text: '14 cards from same BIN used across 6 merchant categories simultaneously', model: 'Transaction', sev: 'critical' },
  'cnp_fraud':          { text: 'Card-not-present fraud — fingerprint matches known CNP ring', model: 'Transaction',       sev: 'high'     },
  'wire_fraud':         { text: 'Outbound wire to unverified foreign beneficiary', model: 'Transaction',                   sev: 'critical' },
  'kyc_mismatch':       { text: 'Document patterns inconsistent with KYC in 3 dimensions', model: 'Anomaly',              sev: 'critical' },
  'document_recycling': { text: 'Same documents linked to 3 distinct account holders', model: 'Anomaly',                  sev: 'critical' },
}

function getSignals(tx) {
  const signals = []
  const seen = new Set()
  const MODEL_LABELS = { transaction: 'Transaction', behaviour: 'Behaviour', anomaly: 'Anomaly', temporal: 'Temporal', graph: 'Graph' }

  for (const tag of (tx.tags ?? [])) {
    const s = TAG_SIGNALS[tag]
    if (s && !seen.has(s.text) && signals.length < 4) { signals.push(s); seen.add(s.text) }
  }

  if (tx.modelScores && signals.length < 5) {
    for (const [key, score] of Object.entries(tx.modelScores).sort((a, b) => b[1] - a[1])) {
      if (signals.length >= 5) break
      const txt = `${MODEL_LABELS[key]} model scored ${score.toFixed(1)} — highest contributing factor in ensemble`
      if (!seen.has(txt)) {
        const lv = getRiskLevel(score)
        signals.push({ text: txt, model: MODEL_LABELS[key], sev: lv === 'critical' || lv === 'high' ? lv : 'medium' })
        seen.add(txt)
      }
    }
  }
  return signals.slice(0, 5)
}

function getVerdict(score) {
  if (score >= 90) return 'Multi-model consensus indicates confirmed high-risk fraud activity. Immediate intervention recommended.'
  if (score >= 75) return 'Significant risk indicators across multiple models — escalation and case creation recommended.'
  if (score >= 60) return 'Elevated risk signal detected — manual review and investigation warranted.'
  if (score >= 40) return 'Moderate anomaly detected — behaviour is inconsistent with account history.'
  if (score >= 20) return 'Low-level signal present — monitor for pattern development.'
  return 'No significant fraud indicators detected — transaction appears within normal parameters.'
}

// ─── Transaction Detail Page ───────────────────────────────────────────
export default function TransactionDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()

  const tx = useMemo(
    () => transactions.find(t => t.id === id) ?? null,
    [id]
  )

  const fusion  = useMemo(
    () => tx ? Object.values(tx.modelScores).reduce((s, v) => s + v, 0) / 5 : 0,
    [tx]
  )
  const signals = useMemo(() => tx ? getSignals(tx) : [], [tx])
  const color   = tx ? getRiskColor(tx.riskScore) : '#71717A'

  if (!tx) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertTriangle size={32} strokeWidth={1.5} className="text-text-tertiary" />
          <p className="text-base font-medium text-text-primary">Transaction not found</p>
          <p className="text-sm text-text-tertiary">ID <span className="font-mono">{id}</span> doesn't match any records.</p>
          <Button variant="secondary" size="md" onClick={() => navigate('/transactions')}>
            Back to Transactions
          </Button>
        </div>
      </div>
    )
  }

  const handleCopyId = () => navigator.clipboard.writeText(tx.id).catch(() => {})

  return (
    <div className="min-h-full">
      {/* ── Breadcrumb Header ──────────────────────────────────────────── */}
      <div className="px-6 pt-5 pb-4 border-b border-border-subtle flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
            <Link
              to="/transactions"
              className="hover:text-text-primary transition-colors duration-100 flex items-center gap-1"
            >
              <ChevronLeft size={12} strokeWidth={2} />
              Transactions
            </Link>
            <span>›</span>
            <span className="font-mono text-text-secondary">{tx.id}</span>
          </div>

          {/* Title row */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-display font-semibold tracking-tight text-text-primary font-mono">
              {tx.id}
            </h1>
            <Tooltip content="Copy transaction ID">
              <IconButton variant="ghost" size="sm" aria-label="Copy ID" onClick={handleCopyId}>
                <Copy size={13} strokeWidth={1.75} />
              </IconButton>
            </Tooltip>
            <Badge variant={STATUS_VARIANT[tx.status] ?? 'neutral'} dot>
              {STATUS_LABEL[tx.status] ?? tx.status}
            </Badge>
            <RiskBadge score={tx.riskScore} size="md" />
          </div>

          {/* Subtitle */}
          <div className="flex items-center gap-3 text-xs text-text-tertiary">
            <div className="flex items-center gap-1">
              <Clock size={11} strokeWidth={1.75} />
              <span className="font-mono">{formatDateTime(tx.timestamp)}</span>
            </div>
            <span>·</span>
            <span>{tx.channel}</span>
            <span>·</span>
            <div className="flex items-center gap-1">
              <MapPin size={11} strokeWidth={1.75} />
              <span>{tx.location.city}, {tx.location.state}</span>
            </div>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="md"
            leftIcon={<FileSearch2 size={14} strokeWidth={1.75} />}
            onClick={() => navigate('/investigations')}
          >
            Open Investigation
          </Button>
          <Button
            variant="danger"
            size="md"
            leftIcon={<AlertTriangle size={14} strokeWidth={1.75} />}
          >
            Escalate
          </Button>
        </div>
      </div>

      {/* ── 2-Column Layout ────────────────────────────────────────────── */}
      <div className="p-6 grid grid-cols-5 gap-6 items-start">

        {/* ════════════════ LEFT COLUMN (3/5) ════════════════════════════ */}
        <div className="col-span-3 flex flex-col gap-6">

          {/* Risk Overview Card */}
          <Card>
            <Card.Header title="Risk Assessment" subtitle="Ensemble model evaluation" />
            <Card.Body>
              <div className="flex items-center gap-8">
                <RiskGaugeLarge score={tx.riskScore} />
                <div className="flex flex-col gap-4 flex-1 min-w-0">
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {getVerdict(tx.riskScore)}
                  </p>
                  {/* Fusion score */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-tertiary">Ensemble Fusion Score</span>
                      <span className="text-sm font-mono tabular font-semibold" style={{ color }}>
                        {fusion.toFixed(1)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-inset rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${fusion}%`,
                          backgroundColor: color,
                          boxShadow: `0 0 8px ${color}44`,
                        }}
                      />
                    </div>
                  </div>
                  {/* Tags */}
                  {tx.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
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
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Transaction Facts */}
          <Card>
            <Card.Header title="Transaction Details" />
            <Card.Body>
              <dl className="grid grid-cols-3 gap-x-6 gap-y-4">
                <KV label="Amount">
                  <span className="font-mono text-base font-semibold text-text-primary">
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </span>
                </KV>
                <KV label="Channel">{tx.channel}</KV>
                <KV label="Timestamp">
                  <span className="font-mono text-xs">{formatDateTime(tx.timestamp)}</span>
                </KV>
                <KV label="Sender Bank">{tx.sender.bank}</KV>
                <KV label="Receiver Bank">{tx.receiver.bank}</KV>
                <KV label="IP Address">
                  <span className="font-mono text-xs">{tx.location.ip}</span>
                </KV>
              </dl>

              <Divider className="my-4" />

              {/* Transfer flow */}
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-inset rounded-lg p-3 border border-border-default">
                  <p className="text-xs text-text-tertiary mb-1">Sender</p>
                  <p className="text-sm font-medium text-text-primary">{tx.sender.name}</p>
                  <p className="font-mono text-xs text-text-tertiary mt-0.5">{tx.sender.id}</p>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="h-px w-12 bg-border-strong" />
                  <div
                    className="text-xs font-mono font-medium"
                    style={{ color }}
                  >
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </div>
                  <div className="h-px w-12 bg-border-strong" />
                </div>
                <div className="flex-1 bg-inset rounded-lg p-3 border border-border-default">
                  <p className="text-xs text-text-tertiary mb-1">Receiver</p>
                  <p className="text-sm font-medium text-text-primary">{tx.receiver.name}</p>
                  <p className="font-mono text-xs text-text-tertiary mt-0.5">{tx.receiver.id}</p>
                </div>
              </div>

              <Divider className="my-4" />

              {/* Device + Location */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 bg-inset rounded-lg p-3 border border-border-default">
                  <Smartphone size={16} strokeWidth={1.5} className="text-text-tertiary shrink-0" />
                  <div>
                    <p className="text-xs text-text-tertiary">Device</p>
                    <p className="font-mono text-xs text-text-primary mt-0.5">{tx.device}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-inset rounded-lg p-3 border border-border-default">
                  <MapPin size={16} strokeWidth={1.5} className="text-text-tertiary shrink-0" />
                  <div>
                    <p className="text-xs text-text-tertiary">Location</p>
                    <p className="text-xs text-text-primary mt-0.5">{tx.location.city}, {tx.location.state} · <span className="font-mono">{tx.location.ip}</span></p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Contributing Signals */}
          <Card>
            <Card.Header
              title="Top Contributing Signals"
              subtitle="Ranked by impact on fusion score"
            />
            <Card.Body>
              <div className="flex flex-col gap-2.5">
                {signals.map((sig, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-inset border border-border-subtle"
                  >
                    <div className="flex items-center gap-2 shrink-0 pt-0.5">
                      <span
                        className="text-xs font-mono text-text-disabled w-4 text-right"
                      >
                        {i + 1}.
                      </span>
                      <span
                        className="h-2 w-2 rounded-sm shrink-0"
                        style={{ backgroundColor: SEV_COLOR[sig.sev] ?? '#71717A' }}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="flex-1 text-sm text-text-secondary leading-snug">{sig.text}</p>
                    <Badge variant="neutral" className="shrink-0">{sig.model}</Badge>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* ════════════════ RIGHT COLUMN (2/5) ════════════════════════════ */}
        <div className="col-span-2 flex flex-col gap-6">

          {/* Model Score Grid */}
          <Card>
            <Card.Header
              title="Multi-Model Analysis"
              subtitle="Individual model confidence scores"
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
            <Card.Body>
              <ModelScoreGrid
                modelScores={tx.modelScores}
                fusionScore={fusion}
              />
            </Card.Body>
          </Card>

          {/* Actions */}
          <Card>
            <Card.Header title="Analyst Actions" />
            <Card.Body className="flex flex-col gap-2">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-start"
                leftIcon={<FileSearch2 size={14} strokeWidth={1.75} />}
                onClick={() => navigate('/investigations')}
              >
                Open Investigation
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="w-full justify-start"
                leftIcon={<GitBranch size={14} strokeWidth={1.75} />}
                onClick={() => navigate('/attack-chains')}
              >
                View Attack Chain
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="w-full justify-start"
                leftIcon={<Waypoints size={14} strokeWidth={1.75} />}
                onClick={() => navigate('/fraud-network')}
              >
                Network Position
              </Button>
              <Divider />
              <Button
                variant="ghost"
                size="md"
                className="w-full justify-start"
                leftIcon={<CheckCircle2 size={14} strokeWidth={1.75} />}
              >
                Mark as Reviewed
              </Button>
            </Card.Body>
          </Card>

          {/* Metadata */}
          <Card>
            <Card.Header title="Metadata" />
            <Card.Body>
              <dl className="flex flex-col gap-3">
                <KV label="Transaction ID">
                  <span className="font-mono text-xs">{tx.id}</span>
                </KV>
                <KV label="Timestamp">
                  <span className="font-mono text-xs">{formatDateTime(tx.timestamp)}</span>
                </KV>
                <KV label="Risk Level">
                  <RiskBadge score={tx.riskScore} />
                </KV>
                <KV label="Channel">{tx.channel}</KV>
                <KV label="Sender Bank">{tx.sender.bank}</KV>
                <KV label="Receiver Bank">{tx.receiver.bank}</KV>
              </dl>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
}
