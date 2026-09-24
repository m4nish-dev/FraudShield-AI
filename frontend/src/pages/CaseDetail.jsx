import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Sparkles, User, Tag, Clock, Shield, Flag, ChevronDown, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import Button from '../components/ui/Button'
import IconButton from '../components/ui/IconButton'
import Badge from '../components/ui/Badge'
import RiskBadge from '../components/ui/RiskBadge'
import Card from '../components/ui/Card'
import { getRiskColor, getRiskLevel } from '../lib/risk'
import { formatRelative, formatTime } from '../lib/format'
import casesData from '../mock/cases.json'

// specialized components
import { FraudDNAProfile } from '../components/fraud/FraudDNAProfile'
import { ModelScoreGrid } from '../components/fraud/ModelScoreGrid'
import { ModelDisagreement } from '../components/fraud/ModelDisagreement'
import { AttackChainFlow } from '../components/fraud/AttackChainFlow'
import { FraudNetworkGraph } from '../components/fraud/FraudNetworkGraph'
import { EvidencePanel } from '../components/fraud/EvidencePanel'
import { CounterfactualPanel } from '../components/fraud/CounterfactualPanel'
import { RiskTrajectory } from '../components/fraud/RiskTrajectory'
import { AIInvestigationReport } from '../components/fraud/AIInvestigationReport'
import { InterventionPanel } from '../components/fraud/InterventionPanel'

// --- Mock Data Generators for the tabs ---
const generateFraudDNA = (score) => [
  { name: 'Account Takeover', score: Math.min(100, score + 12) },
  { name: 'Velocity Fraud', score: Math.min(100, score + 21) },
  { name: 'Device Risk', score: Math.min(100, score + 8) },
  { name: 'Location Risk', score: Math.max(10, score - 35) },
  { name: 'Mule Network', score: Math.max(20, score - 15) },
  { name: 'Behaviour Anomaly', score: Math.min(100, score + 5) },
].sort((a, b) => b.score - a.score)

const MOCK_ATTACK_STEPS = [
  { icon: 'login', title: 'Suspicious Login (New Device)', timestamp: '10:14:22', riskScore: 42 },
  { icon: 'device', title: 'Device Emulation Detected', timestamp: '10:15:01', riskScore: 78 },
  { icon: 'beneficiary', title: 'New Beneficiary Added', timestamp: '10:18:44', riskScore: 86 },
  { icon: 'burst', title: 'Transaction Burst Started', timestamp: '10:21:05', riskScore: 94 },
  { icon: 'transfer', title: 'Transfer to Mule Network', timestamp: '10:26:12', riskScore: 98 },
]

const MOCK_GRAPH_NODES = [
  { id: 'n1', type: 'user', label: 'Compromised User', riskScore: 85, position: { x: 250, y: 50 } },
  { id: 'n2', type: 'device', label: 'DEV-Clone', riskScore: 95, position: { x: 100, y: 150 } },
  { id: 'n3', type: 'account', label: 'Primary Acc', riskScore: 70, position: { x: 250, y: 150 } },
  { id: 'n4', type: 'mule', label: 'Terminal Mule', riskScore: 98, position: { x: 400, y: 250 } },
  { id: 'n5', type: 'ip', label: 'VPN Node', riskScore: 60, position: { x: 100, y: 50 } },
]
const MOCK_GRAPH_EDGES = [
  { source: 'n5', target: 'n2' },
  { source: 'n2', target: 'n3', animated: true },
  { source: 'n1', target: 'n3' },
  { source: 'n3', target: 'n4', animated: true },
]

const MOCK_EVIDENCE = [
  { claim: "Transaction velocity is 4.2× the user's 90-day rolling mean", model: "Temporal", sev: "high" },
  { claim: "Device fingerprint matches 4 previously flagged ATO accounts", model: "Graph", sev: "critical" },
  { claim: "Simultaneous sessions detected across two distinct IP ASNs", model: "Behaviour", sev: "critical" },
  { claim: "Beneficiary account is 3 hops from a confirmed illicit network", model: "Graph", sev: "high" },
  { claim: "Transaction amounts avoid standard AML reporting thresholds", model: "Transaction", sev: "medium" },
]

const MOCK_TIMELINE_DATA = [
  { time: '2026-09-24T09:00:00Z', score: 12 },
  { time: '2026-09-24T09:30:00Z', score: 15 },
  { time: '2026-09-24T10:00:00Z', score: 18 },
  { time: '2026-09-24T10:14:00Z', score: 42 },
  { time: '2026-09-24T10:18:00Z', score: 86 },
  { time: '2026-09-24T10:21:00Z', score: 94 },
  { time: '2026-09-24T10:30:00Z', score: 96 },
]

const MOCK_REPORT = {
  summary: "This case represents a highly coordinated Account Takeover (ATO) followed by an immediate drain to a known mule network. The attack bypassed static rules but was caught by the ensemble anomaly detection.",
  keyFindings: [
    "Compromised credentials used via emulated Android environment.",
    "Bypassed OTP by exploiting a known telecom SS7 vulnerability.",
    "Funds instantly routed to a 4-hop mule ring."
  ],
  attackProgression: [
    "Initial login from VPN IP (10:14).",
    "Addition of 3 new payees in rapid succession (10:18).",
    "Burst transfers totaling ₹6.4L (10:21)."
  ],
  recommendedAction: {
    title: "Freeze Account & Revert TXNs",
    reasoning: "High confidence of unauthorized access. Immediate freeze prevents further loss."
  }
}

// ─── Main Component ──────────────────────────────────────────────────
export default function CaseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Overview')

  const c = useMemo(() => casesData.find(c => c.id === id) || casesData[0], [id])
  const color = getRiskColor(c.riskScore)
  const riskLabel = getRiskLevel(c.riskScore)
  
  const fraudDna = useMemo(() => generateFraudDNA(c.riskScore), [c.riskScore])

  // Mock model scores based on risk score
  const mockModelScores = {
    transaction: Math.min(100, c.riskScore + (Math.random()*10 - 5)),
    behaviour: Math.min(100, c.riskScore + (Math.random()*15)),
    anomaly: Math.min(100, c.riskScore + (Math.random()*5)),
    temporal: Math.min(100, c.riskScore - (Math.random()*20)),
    graph: Math.min(100, c.riskScore + (Math.random()*10)),
  }

  const TABS = ['Overview', 'Attack Chain', 'Network', 'Evidence', 'Timeline', 'AI Report']

  return (
    <div className="min-h-full">
      {/* ── Sticky Sub-header ───────────────────────────────────────── */}
      <div className="sticky top-[57px] z-30 bg-surface/90 backdrop-blur-md border-b border-border-subtle px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
            <Link to="/cases" className="hover:text-text-primary transition-colors flex items-center gap-1">
              <ChevronLeft size={12} strokeWidth={2} /> Cases
            </Link>
            <span>›</span>
            <span className="font-mono text-text-secondary">{c.id}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-xl font-display font-semibold tracking-tight text-text-primary font-mono">
              {c.id}
            </h1>
            <Badge variant="neutral">{c.category}</Badge>
            <RiskBadge score={c.riskScore} size="md" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="danger" size="md" leftIcon={<Flag size={14} />}>Escalate</Button>
          <Button variant="secondary" size="md" leftIcon={<User size={14} />}>Assign</Button>
          <div className="flex items-center">
            <Button variant="secondary" size="md" leftIcon={<CheckCircle2 size={14} />} className="rounded-r-none border-r-0">
              Mark Reviewed
            </Button>
            <Button variant="secondary" size="md" className="rounded-l-none px-2 border-l border-border-strong">
              <ChevronDown size={14} />
            </Button>
          </div>
          <div className="w-px h-6 bg-border-strong mx-1" />
          <Button variant="primary" size="md" leftIcon={<Sparkles size={14} />}>
            Generate Report
          </Button>
        </div>
      </div>

      {/* ── 2-Column Layout ─────────────────────────────────────────── */}
      <div className="p-6 grid grid-cols-3 gap-6 items-start">
        
        {/* ══ LEFT COLUMN (2/3) ══ */}
        <div className="col-span-2 flex flex-col gap-6">
          
          {/* Risk Summary Card */}
          <Card>
            <Card.Body className="p-6">
              <div className="grid grid-cols-2 gap-8 items-center">
                <div className="flex flex-col gap-2 justify-center border-r border-border-default pr-8">
                  <div className="flex flex-col">
                    <span className="text-sm text-text-tertiary uppercase tracking-wider font-medium mb-1">
                      Ensemble Risk Score
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-display font-semibold tabular leading-none" style={{ color }}>
                        {c.riskScore.toFixed(1)}
                      </span>
                      <span className="text-lg text-text-tertiary">/ 100</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs uppercase tracking-wider font-bold" style={{ backgroundColor: `${color}22`, color }}>
                      {riskLabel}
                    </span>
                    <span className="text-xs text-text-tertiary">Based on consensus of 5 models</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <span className="text-xs text-text-tertiary uppercase tracking-wider font-medium">
                    Fraud DNA Profile
                  </span>
                  <FraudDNAProfile profile={fraudDna} />
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Main Investigation Tabs Card */}
          <Card className="min-h-[600px] flex flex-col">
            <div className="border-b border-border-default px-2 flex overflow-x-auto">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-150 ${
                    activeTab === tab
                      ? 'border-accent text-accent'
                      : 'border-transparent text-text-tertiary hover:text-text-secondary hover:border-border-strong'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col"
                >
                  
                  {activeTab === 'Overview' && (
                    <div className="flex flex-col gap-6">
                      <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
                        {c.description} This cluster of activity deviates significantly from the established baseline, triggering multi-model alerts across temporal and behavioural dimensions.
                      </p>
                      <div>
                        <h4 className="text-xs font-medium uppercase tracking-wider text-text-tertiary mb-3">Model Analysis</h4>
                        <ModelScoreGrid modelScores={mockModelScores} />
                      </div>
                      <ModelDisagreement 
                        isDisagreement={false} 
                        agreementText="4/5 models indicate highly elevated risk."
                        note="Temporal model shows lower confidence due to recent legitimate travel, but ensemble consensus strongly points to Account Takeover."
                      />
                    </div>
                  )}

                  {activeTab === 'Attack Chain' && (
                    <div className="flex flex-col h-full flex-1 gap-2">
                      <h4 className="text-xs font-medium uppercase tracking-wider text-text-tertiary">Progression Flow</h4>
                      <AttackChainFlow steps={MOCK_ATTACK_STEPS} />
                    </div>
                  )}

                  {activeTab === 'Network' && (
                    <div className="flex flex-col h-full flex-1 gap-2">
                      <h4 className="text-xs font-medium uppercase tracking-wider text-text-tertiary">Entity Relationships</h4>
                      <FraudNetworkGraph nodesData={MOCK_GRAPH_NODES} edgesData={MOCK_GRAPH_EDGES} />
                    </div>
                  )}

                  {activeTab === 'Evidence' && (
                    <div className="flex flex-col gap-6">
                      <div>
                        <h4 className="text-xs font-medium uppercase tracking-wider text-text-tertiary mb-3">Supporting Evidence</h4>
                        <EvidencePanel evidence={MOCK_EVIDENCE} />
                      </div>
                      <CounterfactualPanel 
                        currentScore={c.riskScore} 
                        projectedScore={47.2} 
                        condition="the device fingerprint was matched to a known trusted device for this user."
                      />
                    </div>
                  )}

                  {activeTab === 'Timeline' && (
                    <div className="flex flex-col gap-4">
                      <h4 className="text-xs font-medium uppercase tracking-wider text-text-tertiary">Risk Trajectory</h4>
                      <RiskTrajectory 
                        data={MOCK_TIMELINE_DATA} 
                        threshold={70} 
                        earlyWarningTime="2026-09-24T10:18:00Z" 
                        confirmedTime="2026-09-24T10:21:00Z"
                      />
                    </div>
                  )}

                  {activeTab === 'AI Report' && (
                    <div className="flex flex-col h-full overflow-auto">
                      <AIInvestigationReport report={MOCK_REPORT} />
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>
          </Card>
        </div>

        {/* ══ RIGHT COLUMN (1/3) ══ */}
        <div className="col-span-1 flex flex-col gap-6 sticky top-[137px]">
          
          <InterventionPanel 
            recommendation="MANUAL REVIEW" 
            reasoning={[
              "High risk score (94.2) requires analyst sign-off.",
              "Funds have not yet exited the institution.",
              "Potential synthetic identity match."
            ]}
            alternatives={[
              { action: "Block & Escalate", desc: "Freeze immediately, escalate to AML." },
              { action: "Challenge (OTP)", desc: "Step-up authentication required." },
              { action: "Allow", desc: "Mark as false positive." }
            ]}
          />

          <Card>
            <Card.Header title="Case Facts" />
            <Card.Body>
              <dl className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <dt className="text-xs text-text-tertiary">Opened</dt>
                  <dd className="text-sm font-mono">{formatTime(c.openedAt)} · {formatRelative(c.openedAt)}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-xs text-text-tertiary">Assigned To</dt>
                  <dd className="text-sm flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-accent text-background flex items-center justify-center text-[10px] font-bold uppercase">
                      {c.assignee.substring(8, 10)}
                    </div>
                    {c.assignee}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-xs text-text-tertiary">Priority</dt>
                  <dd><Badge variant={c.priority === 'critical' ? 'danger' : 'warning'}>{c.priority}</Badge></dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-xs text-text-tertiary">Tags</dt>
                  <dd className="flex gap-1.5 flex-wrap mt-0.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-text-secondary bg-inset border border-border-default">ato_burst</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-text-secondary bg-inset border border-border-default">high_velocity</span>
                  </dd>
                </div>
              </dl>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header title="Activity Feed" />
            <Card.Body className="p-0">
              <div className="flex flex-col">
                {[
                  { time: '10:48', action: 'Case escalated to Tier 2' },
                  { time: '10:45', action: 'Assigned to analyst_ra' },
                  { time: '10:42', action: 'Auto-flagged by Ensemble Model' },
                ].map((act, i) => (
                  <div key={i} className="flex gap-3 px-4 py-3 border-b border-border-subtle last:border-0 text-sm">
                    <span className="text-text-tertiary font-mono text-xs mt-0.5">{act.time}</span>
                    <span className="text-text-secondary">{act.action}</span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

        </div>

      </div>
    </div>
  )
}
