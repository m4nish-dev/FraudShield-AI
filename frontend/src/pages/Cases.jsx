import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, SlidersHorizontal, LayoutGrid, List, ArrowRight, Activity, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import IconButton from '../components/ui/IconButton'
import Badge from '../components/ui/Badge'
import RiskBar from '../components/ui/RiskBar'
import { getRiskColor, getRiskLevel } from '../lib/risk'
import { formatRelative } from '../lib/format'
import { cn } from '../lib/cn'
import casesData from '../mock/cases.json'

// --- Case Card Component ---
function CaseCard({ c, onClick }) {
  const color = getRiskColor(c.riskScore)

  // Fraud DNA mini strip (mock data logic for visual)
  const dnaStrand = useMemo(() => {
    // Generate 6 randomish heights based on risk score seed
    return Array.from({ length: 6 }).map((_, i) => {
      const h = Math.max(20, Math.min(100, (c.riskScore * (i + 1) * 17) % 100))
      return { height: `${h}%`, color: getRiskColor(h) }
    })
  }, [c.riskScore])

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => onClick(c.id)}
      className="bg-surface border border-border-default rounded-lg p-5 flex flex-col gap-4 cursor-pointer hover:border-border-strong transition-colors duration-150"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-sm text-text-primary font-medium">{c.id}</span>
          <Badge variant="neutral">{c.category}</Badge>
        </div>
        
        {/* Fraud DNA mini strip */}
        <div className="flex items-end gap-0.5 h-8 w-12 bg-inset p-1 rounded">
          {dnaStrand.map((strand, i) => (
            <div key={i} className="w-1.5 bg-border-strong rounded-t-sm" style={{ height: strand.height, backgroundColor: strand.color }} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-display font-semibold tabular leading-none" style={{ color }}>
            {c.riskScore.toFixed(1)}
          </span>
          <span className="text-xs text-text-tertiary">/ 100</span>
        </div>
        <RiskBar score={c.riskScore} height="sm" className="mt-2" />
      </div>

      <div className="flex items-center gap-4 text-xs text-text-secondary mt-2">
        <div className="flex items-center gap-1.5" title="Transactions involved">
          <Activity size={14} className="text-text-tertiary" />
          <span className="font-mono tabular">{c.transactionsCount}</span>
        </div>
        <div className="flex items-center gap-1.5" title="Entities involved">
          <Users size={14} className="text-text-tertiary" />
          <span className="font-mono tabular">{c.entitiesCount}</span>
        </div>
        <div className="ml-auto text-text-tertiary">
          {formatRelative(c.openedAt)}
        </div>
      </div>

      <div className="mt-2 pt-3 border-t border-border-subtle flex items-center justify-between group">
        <span className="text-xs text-text-disabled uppercase tracking-wider font-medium">Status: {c.status}</span>
        <div className="flex items-center gap-1 text-sm text-accent font-medium opacity-80 group-hover:opacity-100 transition-opacity">
          Investigate
          <ArrowRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  )
}


export default function Cases() {
  const navigate = useNavigate()
  const [view, setView] = useState('grid')
  const [filter, setFilter] = useState('All')

  const filters = ['All', 'Critical', 'High', 'Account Takeover', 'Mule Network', 'AML', 'Card Fraud', 'Synthetic Identity']

  const filteredCases = useMemo(() => {
    return casesData.filter(c => {
      if (filter === 'All') return true
      if (filter === 'Critical') return getRiskLevel(c.riskScore) === 'critical'
      if (filter === 'High') return getRiskLevel(c.riskScore) === 'high'
      return c.category === filter
    }).sort((a, b) => b.riskScore - a.riskScore)
  }, [filter])

  const highPriorityCount = casesData.filter(c => getRiskLevel(c.riskScore) === 'critical' || getRiskLevel(c.riskScore) === 'high').length

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } }
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } }
  }

  return (
    <div className="min-h-full flex flex-col">
      <PageHeader
        title="Investigation Cases"
        subtitle={`${casesData.length} active · ${highPriorityCount} high priority`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" leftIcon={<SlidersHorizontal size={14} />}>
              Filter
            </Button>
            <Button variant="primary" size="md" leftIcon={<Plus size={14} />}>
              New Case
            </Button>
          </div>
        }
      />

      <div className="p-6 flex flex-col gap-6">
        {/* Filter Chips & View Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                  filter === f
                    ? "bg-accent/10 text-accent border-accent/20"
                    : "bg-surface text-text-secondary border-border-default hover:bg-inset hover:text-text-primary"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-surface border border-border-default rounded-md p-0.5 shrink-0 ml-4">
            <button
              onClick={() => setView('grid')}
              className={cn("p-1.5 rounded", view === 'grid' ? "bg-inset text-text-primary" : "text-text-tertiary")}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView('list')}
              className={cn("p-1.5 rounded", view === 'list' ? "bg-inset text-text-primary" : "text-text-tertiary")}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Grid View */}
        {view === 'grid' && (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCases.map(c => (
              <motion.div key={c.id} variants={itemVariants}>
                <CaseCard c={c} onClick={(id) => navigate(`/cases/${id}`)} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* List View (Simplified placeholder for demo, grid is hero) */}
        {view === 'list' && (
          <div className="bg-surface border border-border-default rounded-lg flex items-center justify-center h-64 text-text-tertiary">
            List view is rendering (Toggle back to grid for hero view).
          </div>
        )}
      </div>
    </div>
  )
}
