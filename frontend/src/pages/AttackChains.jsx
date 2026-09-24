import { useState, useMemo } from 'react'
import { Search, ChevronRight, Zap, Target, SlidersHorizontal, Activity } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Badge from '../components/ui/Badge'
import Input from '../components/ui/Input'
import { AttackChainFlow } from '../components/fraud/AttackChainFlow'
import { getRiskColor } from '../lib/risk'
import { formatTime } from '../lib/format'
import { cn } from '../lib/cn'

// Mock Data for Attack Chains
const MOCK_CHAINS = [
  {
    id: 'CHAIN-94A',
    category: 'ATO Burst',
    riskScore: 94.2,
    lastActivity: '10:26',
    steps: [
      { icon: 'login', title: 'Suspicious Login (New Device)', timestamp: '10:14:22', riskScore: 42, model: 'Behaviour', evidence: 'IP matched known VPN ASN' },
      { icon: 'device', title: 'Device Emulation Detected', timestamp: '10:15:01', riskScore: 78, model: 'Anomaly', evidence: 'Fingerprint clash with 3 active sessions' },
      { icon: 'beneficiary', title: 'New Beneficiary Added', timestamp: '10:18:44', riskScore: 86, model: 'Behaviour', evidence: 'Added without typical navigation delay' },
      { icon: 'burst', title: 'Transaction Burst Started', timestamp: '10:21:05', riskScore: 94, model: 'Temporal', evidence: 'Velocity is 6.4x historical baseline' },
      { icon: 'transfer', title: 'Transfer to Mule Network', timestamp: '10:26:12', riskScore: 98, model: 'Graph', evidence: 'Terminal node 2-hops from flagged mule' },
    ]
  },
  {
    id: 'CHAIN-88B',
    category: 'Synthetic Identity',
    riskScore: 88.5,
    lastActivity: '08:14',
    steps: [
      { icon: 'login', title: 'Account Creation', timestamp: '06:12:00', riskScore: 65, model: 'Anomaly', evidence: 'Document sub-patterns match known factory' },
      { icon: 'device', title: 'Dormancy Period', timestamp: '07:00:00', riskScore: 40, model: 'Temporal', evidence: 'No activity for 45 days post-creation' },
      { icon: 'burst', title: 'Micro-deposits Received', timestamp: '08:10:11', riskScore: 72, model: 'Transaction', evidence: 'Inbound ₹1 sweeps from 14 accounts' },
      { icon: 'transfer', title: 'Consolidation Transfer', timestamp: '08:14:05', riskScore: 88.5, model: 'Graph', evidence: 'Funds routed to offshore gateway' },
    ]
  },
  {
    id: 'CHAIN-76C',
    category: 'Card Testing',
    riskScore: 76.1,
    lastActivity: '14:22',
    steps: [
      { icon: 'login', title: 'Gateway Access', timestamp: '14:10:12', riskScore: 35, model: 'Behaviour', evidence: 'Rapid sequence of checkout requests' },
      { icon: 'transfer', title: '₹1 Authorization Attempt', timestamp: '14:15:00', riskScore: 55, model: 'Transaction', evidence: 'Common card-testing micro-auth' },
      { icon: 'transfer', title: 'Escalating Auth Failed', timestamp: '14:18:45', riskScore: 68, model: 'Transaction', evidence: '₹500 attempt declined (CVV mismatch)' },
      { icon: 'burst', title: 'BIN Swarm Detected', timestamp: '14:22:10', riskScore: 76.1, model: 'Graph', evidence: '14 similar attempts on same BIN prefix' },
    ]
  }
]

export default function AttackChains() {
  const [selectedChainId, setSelectedChainId] = useState(MOCK_CHAINS[0].id)
  const [search, setSearch] = useState('')

  const selectedChain = useMemo(() => 
    MOCK_CHAINS.find(c => c.id === selectedChainId) || MOCK_CHAINS[0]
  , [selectedChainId])

  const filteredChains = useMemo(() => {
    if (!search.trim()) return MOCK_CHAINS
    const q = search.toLowerCase()
    return MOCK_CHAINS.filter(c => 
      c.id.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <PageHeader
        title="Attack Chains"
        subtitle="Reconstructed fraud progressions across accounts"
      />

      <div className="flex-1 flex overflow-hidden border-t border-border-default">
        {/* ── Left Rail: Chain List ── */}
        <div className="w-72 border-r border-border-default bg-surface flex flex-col shrink-0">
          <div className="p-3 border-b border-border-default">
            <Input 
              id="search-chains"
              placeholder="Search chains..." 
              leftIcon={<Search size={14} />}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
            {filteredChains.map((chain) => {
              const isActive = chain.id === selectedChainId
              const color = getRiskColor(chain.riskScore)
              return (
                <button
                  key={chain.id}
                  onClick={() => setSelectedChainId(chain.id)}
                  className={cn(
                    "flex flex-col gap-2 p-3 rounded-lg text-left transition-colors border",
                    isActive 
                      ? "bg-elevated border-border-strong border-l-2" 
                      : "bg-surface border-transparent hover:bg-inset",
                    isActive && `border-l-[${color}]`
                  )}
                  style={isActive ? { borderLeftColor: color } : {}}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-text-primary">{chain.id}</span>
                    <span className="text-[10px] font-mono tabular" style={{ color }}>{chain.riskScore.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="neutral" className="scale-90 origin-left">{chain.category}</Badge>
                    <span className="text-text-tertiary font-mono">{chain.lastActivity}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-text-tertiary mt-1">
                    <Target size={10} />
                    <span>{chain.steps.length} progression steps</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Main Canvas: AttackChainFlow ── */}
        <div className="flex-1 bg-canvas relative flex flex-col">
          <div className="absolute top-4 left-4 z-10 bg-surface/80 backdrop-blur-md border border-border-default rounded-md px-4 py-2 flex items-center gap-4 shadow-sm">
            <span className="text-sm font-medium text-text-primary">{selectedChain.category}</span>
            <div className="w-px h-4 bg-border-strong" />
            <span className="text-xs font-mono text-text-secondary">{selectedChain.id}</span>
          </div>
          
          <div className="flex-1 w-full h-full p-6">
            <AttackChainFlow steps={selectedChain.steps} />
          </div>
        </div>

        {/* ── Right Rail: Legend & Evidence ── */}
        <div className="w-80 border-l border-border-default bg-surface flex flex-col shrink-0">
          <div className="p-4 border-b border-border-default flex items-center gap-2">
            <Activity size={16} className="text-accent" />
            <h3 className="text-sm font-medium text-text-primary">Progression Legend</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 relative">
            {/* Connecting line behind steps */}
            <div className="absolute left-7 top-6 bottom-6 w-px bg-border-strong" />
            
            {selectedChain.steps.map((step, idx) => {
              const color = getRiskColor(step.riskScore)
              return (
                <div key={idx} className="flex gap-4 relative z-10">
                  <div className="flex flex-col items-center gap-1 mt-0.5">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-background ring-4 ring-surface"
                      style={{ backgroundColor: color }}
                    >
                      {idx + 1}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 flex-1 pt-1 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-text-tertiary tabular">{step.timestamp}</span>
                      <Badge variant="neutral" className="scale-90 origin-right">{step.model}</Badge>
                    </div>
                    <span className="text-sm font-medium text-text-primary leading-snug">{step.title}</span>
                    <p className="text-xs text-text-secondary leading-relaxed bg-inset p-2 rounded border border-border-default mt-1">
                      {step.evidence}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
