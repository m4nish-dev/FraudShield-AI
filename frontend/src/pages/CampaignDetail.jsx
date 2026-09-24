import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Flag, Users, Smartphone, Activity, AlertTriangle, ShieldAlert } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import RiskBadge from '../components/ui/RiskBadge'
import Divider from '../components/ui/Divider'
import { FraudNetworkGraph } from '../components/fraud/FraudNetworkGraph'
import { InterventionPanel } from '../components/fraud/InterventionPanel'

import campaignsData from '../mock/campaigns.json'
import entitiesData from '../mock/entities.json' // We'll just reuse the mock graph
import transactionsData from '../mock/transactions.json' // Mock transactions
import { getRiskColor } from '../lib/risk'
import { formatCompact, formatRelative, formatTime } from '../lib/format'

export default function CampaignDetail() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('Overview')
  
  const c = useMemo(() => campaignsData.find(cmp => cmp.id === id) || campaignsData[0], [id])
  const color = getRiskColor(c.riskScore)

  const TABS = ['Overview', 'Accounts', 'Transactions', 'Timeline']

  // Mock layout assignment for graph
  const positionedNodes = useMemo(() => {
    return entitiesData.nodes.slice(0, 15).map((node, i, arr) => {
      const angle = (i / arr.length) * Math.PI * 2
      const radius = 180
      return {
        ...node,
        position: { x: 300 + Math.cos(angle) * radius, y: 200 + Math.sin(angle) * radius }
      }
    })
  }, [])
  const validNodeIds = new Set(positionedNodes.map(n => n.id))
  const filteredEdges = entitiesData.edges.filter(e => validNodeIds.has(e.source) && validNodeIds.has(e.target))

  return (
    <div className="min-h-full">
      {/* ── Breadcrumb Header ── */}
      <div className="px-6 pt-5 pb-4 border-b border-border-subtle flex items-center justify-between gap-4 sticky top-[57px] z-30 bg-surface/90 backdrop-blur-md">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
            <Link to="/campaigns" className="hover:text-text-primary transition-colors flex items-center gap-1">
              <ChevronLeft size={12} strokeWidth={2} /> Campaigns
            </Link>
            <span>›</span>
            <span className="font-mono text-text-secondary">{c.id}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-xl font-display font-semibold tracking-tight text-text-primary">
              {c.name}
            </h1>
            <Badge variant={c.status === 'active' ? 'danger' : 'neutral'} dot={c.status === 'active'}>
              {c.status}
            </Badge>
            <RiskBadge score={c.riskScore} size="md" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="danger" size="md" leftIcon={<Flag size={14} />}>Declare Incident</Button>
        </div>
      </div>

      {/* ── 2-Column Layout ── */}
      <div className="p-6 grid grid-cols-3 gap-6 items-start">
        
        {/* ══ LEFT COLUMN (2/3) ══ */}
        <div className="col-span-2 flex flex-col gap-6">
          
          <Card className="flex flex-col overflow-hidden">
            <div className="border-b border-border-default px-2 flex">
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
            
            <div className="flex-1 flex flex-col relative min-h-[600px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 flex flex-col overflow-hidden"
                >
                  {activeTab === 'Overview' && (
                    <div className="flex flex-col h-full">
                      <div className="p-6 flex flex-col gap-2 shrink-0">
                        <h3 className="text-sm font-medium text-text-primary">Campaign Network Topology</h3>
                        <p className="text-xs text-text-secondary max-w-2xl">
                          The mapped entity graph reveals a tightly coupled device cluster driving synthetic accounts to rapidly transfer funds. 
                        </p>
                      </div>
                      <div className="flex-1 w-full border-t border-border-default">
                        <FraudNetworkGraph nodesData={positionedNodes} edgesData={filteredEdges} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'Accounts' && (
                    <div className="p-6 overflow-auto">
                      <h3 className="text-sm font-medium text-text-primary mb-4">Compromised / Mule Accounts ({c.accountsInvolved})</h3>
                      <div className="bg-surface border border-border-default rounded-lg text-sm flex items-center justify-center h-48 text-text-tertiary">
                        Account table visualization... (Mock)
                      </div>
                    </div>
                  )}

                  {activeTab === 'Transactions' && (
                    <div className="p-6 overflow-auto">
                      <h3 className="text-sm font-medium text-text-primary mb-4">Campaign Transactions ({c.totalTransactions})</h3>
                      <div className="bg-surface border border-border-default rounded-lg text-sm flex items-center justify-center h-48 text-text-tertiary">
                        Transaction feed visualization... (Mock)
                      </div>
                    </div>
                  )}

                  {activeTab === 'Timeline' && (
                    <div className="p-6 overflow-auto">
                      <h3 className="text-sm font-medium text-text-primary mb-4">Campaign Evolution</h3>
                      <div className="flex flex-col gap-4 border-l-2 border-border-strong ml-2 pl-4">
                        {[
                          { t: 'T-14 Days', desc: 'Initial device fingerprint DEV-f02c9a appears.' },
                          { t: 'T-7 Days', desc: '14 accounts created matching document factory sub-patterns.' },
                          { t: 'T-1 Day', desc: 'Micro-deposits received across all accounts.' },
                          { t: 'T-0 (Now)', desc: 'Coordinated burst transfer execution begins.' },
                        ].map((ev, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="relative"
                          >
                            <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-surface" />
                            <span className="text-xs font-mono text-text-tertiary">{ev.t}</span>
                            <p className="text-sm text-text-secondary mt-1">{ev.desc}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </Card>
        </div>

        {/* ══ RIGHT COLUMN (1/3) ══ */}
        <div className="col-span-1 flex flex-col gap-6 sticky top-[141px]">
          
          <InterventionPanel 
            recommendation="CONTAIN CAMPAIGN" 
            reasoning={[
              `Freeze all ${c.accountsInvolved} linked accounts globally.`,
              `Blacklist ${c.sharedDevices} shared device fingerprints.`,
              "Report IOCs to regional CERT."
            ]}
            alternatives={[
              { action: "Monitor Only", desc: "Continue observing network expansion." },
            ]}
          />

          <Card>
            <Card.Header title="Campaign Facts" />
            <Card.Body>
              <dl className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <dt className="text-xs text-text-tertiary">Discovered</dt>
                  <dd className="text-sm font-mono">{formatTime(c.discoveredAt)} · {formatRelative(c.discoveredAt)}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <dt className="text-xs text-text-tertiary">Accounts</dt>
                    <dd className="text-sm font-mono flex items-center gap-1.5"><Users size={12}/>{c.accountsInvolved}</dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-xs text-text-tertiary">Devices</dt>
                    <dd className="text-sm font-mono flex items-center gap-1.5"><Smartphone size={12}/>{c.sharedDevices}</dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-xs text-text-tertiary">Transactions</dt>
                    <dd className="text-sm font-mono flex items-center gap-1.5"><Activity size={12}/>{c.totalTransactions}</dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-xs text-text-tertiary">Est. Loss</dt>
                    <dd className="text-sm font-mono text-risk-critical">₹{c.estimatedLoss.toLocaleString('en-IN')}</dd>
                  </div>
                </div>
                <Divider />
                <div className="flex flex-col gap-1">
                  <dt className="text-xs text-text-tertiary">Targeted Vectors</dt>
                  <dd className="flex gap-1.5 flex-wrap mt-1">
                    {c.type.split(',').map(t => t.trim()).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-mono text-text-secondary bg-inset border border-border-default">
                        {tag}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header title="Connected Campaigns" />
            <Card.Body>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border-default bg-inset hover:border-border-strong cursor-pointer transition-colors">
                <ShieldAlert size={20} className="text-risk-high shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-text-primary">Operation Ghost Account</span>
                  <span className="text-xs text-text-tertiary">CMP-003 · 78% IOC Overlap</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

      </div>
    </div>
  )
}
