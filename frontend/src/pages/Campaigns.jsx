import { useNavigate } from 'react'
import { motion } from 'framer-motion'
import { Plus, SlidersHorizontal, Users, Smartphone, Activity, ArrowRight, TrendingDown } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import RiskBar from '../components/ui/RiskBar'
import { getRiskColor, getRiskLevel } from '../lib/risk'
import { formatCompact, formatRelative } from '../lib/format'
import campaignsData from '../mock/campaigns.json'

// --- Static Mini Network Preview (CSS based for performance on grid) ---
const MiniNetworkPreview = ({ riskScore }) => {
  const color = getRiskColor(riskScore)
  return (
    <div className="h-32 w-full bg-inset rounded border border-border-default relative overflow-hidden flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
      {/* Mocking a static graph visually */}
      <svg width="100%" height="100%" className="absolute inset-0">
        <pattern id={`grid-${riskScore}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#71717A" opacity="0.2"/>
        </pattern>
        <rect width="100%" height="100%" fill={`url(#grid-${riskScore})`} />
        
        <path d="M50 40 L120 70 L200 50 M120 70 L160 100" stroke="#71717A" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.5" />
        <circle cx="50" cy="40" r="6" fill={color} opacity="0.8" />
        <circle cx="120" cy="70" r="10" fill={color} />
        <circle cx="200" cy="50" r="6" fill={color} opacity="0.8" />
        <circle cx="160" cy="100" r="8" fill={color} opacity="0.9" />
      </svg>
      <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none" />
    </div>
  )
}

function CampaignCard({ c, onClick }) {
  const color = getRiskColor(c.riskScore)
  const isActive = c.status === 'active'

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => onClick(c.id)}
      className="bg-surface border border-border-default rounded-lg p-5 flex flex-col gap-4 cursor-pointer hover:border-border-strong transition-colors duration-150 group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5 min-w-0">
          <h3 className="font-semibold text-text-primary text-base truncate">{c.name}</h3>
          <span className="font-mono text-xs text-text-tertiary">{c.id}</span>
        </div>
        <Badge variant={isActive ? 'danger' : 'neutral'} dot={isActive} className="shrink-0">
          {c.status}
        </Badge>
      </div>

      <MiniNetworkPreview riskScore={c.riskScore} />

      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="flex flex-col gap-1 bg-inset p-2 rounded border border-border-subtle">
          <span className="text-text-tertiary flex items-center gap-1"><Users size={12}/> Accs</span>
          <span className="font-mono font-medium text-text-secondary">{c.accountsInvolved}</span>
        </div>
        <div className="flex flex-col gap-1 bg-inset p-2 rounded border border-border-subtle">
          <span className="text-text-tertiary flex items-center gap-1"><Smartphone size={12}/> Devs</span>
          <span className="font-mono font-medium text-text-secondary">{c.sharedDevices}</span>
        </div>
        <div className="flex flex-col gap-1 bg-inset p-2 rounded border border-border-subtle">
          <span className="text-text-tertiary flex items-center gap-1"><Activity size={12}/> Txns</span>
          <span className="font-mono font-medium text-text-secondary">{c.totalTransactions}</span>
        </div>
        <div className="flex flex-col gap-1 bg-inset p-2 rounded border border-border-subtle">
          <span className="text-text-tertiary flex items-center gap-1"><TrendingDown size={12}/> Loss</span>
          <span className="font-mono font-medium text-risk-critical">{formatCompact(c.estimatedLoss)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <RiskBar score={c.riskScore} height="xs" className="flex-1" />
        <span className="font-mono text-xs tabular font-medium" style={{ color }}>
          {c.riskScore.toFixed(1)}
        </span>
      </div>

      <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
        <span className="text-xs text-text-tertiary">Discovered {formatRelative(c.discoveredAt)}</span>
        <div className="flex items-center gap-1 text-sm text-accent font-medium opacity-80 group-hover:opacity-100 transition-opacity">
          Open Campaign <ArrowRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  )
}

export default function Campaigns() {
  const navigate = useNavigate()

  return (
    <div className="min-h-full flex flex-col">
      <PageHeader
        title="Fraud Campaigns"
        subtitle="Coordinated multi-account threat actor activity"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" leftIcon={<SlidersHorizontal size={14} />}>Filter</Button>
            <Button variant="primary" size="md" leftIcon={<Plus size={14} />}>New Campaign</Button>
          </div>
        }
      />
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaignsData.map(c => (
            <CampaignCard key={c.id} c={c} onClick={(id) => navigate(`/campaigns/${id}`)} />
          ))}
        </div>
      </div>
    </div>
  )
}
