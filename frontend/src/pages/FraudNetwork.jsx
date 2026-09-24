import { useState, useMemo } from 'react'
import { Filter, Eye, Maximize, AlertCircle, Share2, Layers } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import IconButton from '../components/ui/IconButton'
import Badge from '../components/ui/Badge'
import RiskBadge from '../components/ui/RiskBadge'
import { FraudNetworkGraph } from '../components/fraud/FraudNetworkGraph'
import entitiesData from '../mock/entities.json'

export default function FraudNetwork() {
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  
  // Example filters state
  const [filters, setFilters] = useState({
    user: true,
    account: true,
    device: true,
    ip: true,
  })

  // Filter nodes based on state
  const filteredNodes = useMemo(() => {
    return entitiesData.nodes.filter(n => filters[n.type] !== false)
  }, [filters])

  // Filter edges to only include those between visible nodes
  const filteredEdges = useMemo(() => {
    const visibleIds = new Set(filteredNodes.map(n => n.id))
    return entitiesData.edges.filter(e => visibleIds.has(e.source) && visibleIds.has(e.target))
  }, [filteredNodes])

  // Mock layout assignment if positions are missing
  const positionedNodes = useMemo(() => {
    // In a real app, you'd use Dagre or ELK for layouting. 
    // Here we'll just arrange them in a rough circle/grid if missing.
    return filteredNodes.map((node, i) => {
      if (node.position) return node
      const angle = (i / filteredNodes.length) * Math.PI * 2
      const radius = 250
      return {
        ...node,
        position: {
          x: 400 + Math.cos(angle) * radius,
          y: 300 + Math.sin(angle) * radius
        }
      }
    })
  }, [filteredNodes])

  const selectedNode = positionedNodes.find(n => n.id === selectedNodeId)

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <PageHeader
        title="Fraud Network"
        subtitle="Global entity relationship graph across all cases"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" leftIcon={<Filter size={14} />}>Saved Views</Button>
            <Button variant="secondary" size="sm" leftIcon={<Share2 size={14} />}>Export Graph</Button>
          </div>
        }
      />

      <div className="flex-1 flex overflow-hidden border-t border-border-default">
        {/* ── Left Rail: Filters ── */}
        <div className="w-64 border-r border-border-default bg-surface p-4 flex flex-col shrink-0 gap-6 overflow-y-auto">
          
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-text-tertiary">Entity Types</h3>
            <div className="flex flex-col gap-2">
              {['user', 'account', 'device', 'ip'].map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-4 h-4">
                    <input 
                      type="checkbox" 
                      className="peer appearance-none w-4 h-4 border border-border-strong rounded bg-inset checked:bg-accent checked:border-accent transition-colors"
                      checked={filters[type]}
                      onChange={(e) => setFilters(f => ({ ...f, [type]: e.target.checked }))}
                    />
                    <div className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-background">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm text-text-secondary capitalize group-hover:text-text-primary transition-colors">
                    {type}s
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-border-subtle" />

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-text-tertiary">Risk Threshold</h3>
            <div className="flex flex-col gap-1">
              <input type="range" min="0" max="100" defaultValue="40" className="w-full accent-accent" />
              <div className="flex justify-between text-[10px] font-mono text-text-tertiary mt-1">
                <span>0</span>
                <span>100</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Main Canvas ── */}
        <div className="flex-1 bg-canvas relative flex flex-col">
          {/* Note: FraudNetworkGraph handles full width/height internally. We'll wrap it slightly */}
          <div className="absolute inset-0 z-0 p-4">
            <FraudNetworkGraph 
              nodesData={positionedNodes} 
              edgesData={filteredEdges} 
              // We could add an onNodeClick handler to FraudNetworkGraph in reality
            />
          </div>
          
          {/* Mock Floating click area to select a node just for demo */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-surface/80 backdrop-blur border border-border-default rounded-full px-4 py-1.5 shadow-sm text-xs text-text-secondary flex items-center gap-2">
            <Layers size={14} className="text-accent" />
            <span>Click any node (simulated here) to view details</span>
            <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 ml-2" onClick={() => setSelectedNodeId('ENT-N001')}>
              Simulate Selection
            </Button>
          </div>
        </div>

        {/* ── Right Rail: Node Details ── */}
        {selectedNodeId && selectedNode && (
          <div className="w-80 border-l border-border-default bg-surface flex flex-col shrink-0 animate-in slide-in-from-right-8 duration-200">
            <div className="p-4 border-b border-border-default flex items-center justify-between">
              <h3 className="text-sm font-medium text-text-primary">Entity Details</h3>
              <IconButton variant="ghost" size="sm" onClick={() => setSelectedNodeId(null)}>
                <Maximize size={14} />
              </IconButton>
            </div>
            
            <div className="p-5 flex flex-col gap-6 overflow-y-auto">
              
              <div className="flex flex-col gap-3 items-start">
                <Badge variant="neutral" className="uppercase">{selectedNode.type}</Badge>
                <h2 className="text-lg font-display font-medium text-text-primary">{selectedNode.label}</h2>
                <span className="font-mono text-xs text-text-tertiary">{selectedNode.id}</span>
              </div>

              <div className="flex flex-col gap-1.5 bg-inset p-3 rounded-lg border border-border-default">
                <span className="text-xs text-text-tertiary uppercase tracking-wider">Risk Score</span>
                <RiskBadge score={selectedNode.riskScore} size="lg" />
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-medium uppercase tracking-wider text-text-tertiary border-b border-border-subtle pb-1">Attributes</h4>
                <dl className="flex flex-col gap-2">
                  {Object.entries(selectedNode).filter(([k]) => !['id','type','label','riskScore','position','tags'].includes(k)).map(([k, v]) => (
                    <div key={k} className="flex flex-col">
                      <dt className="text-[10px] text-text-tertiary uppercase">{k}</dt>
                      <dd className="text-sm text-text-secondary font-mono mt-0.5">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {selectedNode.tags && (
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-text-tertiary border-b border-border-subtle pb-1">Tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-surface border border-border-default rounded text-[10px] font-mono text-text-secondary">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Button variant="primary" className="w-full mt-4" rightIcon={<Eye size={14} />}>
                Open Full Profile
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Bar ── */}
      <div className="h-10 bg-surface border-t border-border-default flex items-center px-4 justify-between text-xs text-text-tertiary shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-risk-critical" /> Critical
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-risk-high" /> High
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-risk-medium" /> Medium
          </div>
        </div>
        <div className="flex items-center gap-4 font-mono">
          <span>Nodes: {filteredNodes.length}</span>
          <span>Edges: {filteredEdges.length}</span>
          <span>Clusters: 4</span>
        </div>
      </div>
    </div>
  )
}
