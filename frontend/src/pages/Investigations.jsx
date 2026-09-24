import { useState } from 'react'
import { Sparkles, ArrowRight, Search, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import RiskBadge from '../components/ui/RiskBadge'
import { formatRelative } from '../lib/format'
import { cn } from '../lib/cn'

const MOCK_REPORTS = [
  { id: 'FS-10042', generatedAt: '2026-09-24T10:25:00Z', summary: 'This case represents a highly coordinated Account Takeover (ATO) followed by an immediate drain to a known mule network. The attack bypassed static rules but was caught by the ensemble anomaly detection.', riskScore: 94.2, model: 'claude-sonnet-4.6' },
  { id: 'FS-10039', generatedAt: '2026-09-23T14:10:00Z', summary: 'Evidence points to Synthetic Identity fraud. 14 accounts created matching document factory sub-patterns with subsequent dormancy before receiving micro-deposits.', riskScore: 88.5, model: 'gemini-1.5-pro' },
  { id: 'FS-10031', generatedAt: '2026-09-21T09:45:00Z', summary: 'Card testing attempt detected on 14 similar BIN prefixes. Initial authorization attempts for ₹1 were followed by escalating but declined charges.', riskScore: 76.1, model: 'claude-sonnet-4.6' },
  { id: 'FS-10028', generatedAt: '2026-09-18T16:20:00Z', summary: 'Anomalous velocity detected but strongly correlated with legitimate user patterns (festival season spending). No network links found to known threat actors.', riskScore: 42.0, model: 'gemini-1.5-pro' },
]

export default function Investigations() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')

  return (
    <div className="min-h-full flex flex-col">
      <PageHeader
        title="AI Investigations"
        subtitle="LLM-generated case reports grounded in ML evidence"
        actions={
          <Button variant="primary" size="md" leftIcon={<Sparkles size={14} />}>
            New Report
          </Button>
        }
      />
      <div className="flex-1 flex overflow-hidden border-t border-border-default">
        {/* Main List */}
        <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
          <Input 
            id="search-reports"
            placeholder="Search by Case ID or keywords..."
            leftIcon={<Search size={14} />}
            wrapperClassName="w-96 mb-2"
          />
          <div className="flex flex-col gap-3">
            {MOCK_REPORTS.map(rep => (
              <div 
                key={rep.id}
                onClick={() => navigate(`/cases/${rep.id}`)}
                className="bg-surface border border-border-default rounded-lg p-4 flex gap-4 cursor-pointer hover:border-border-strong transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Sparkles size={20} className="text-accent" />
                </div>
                <div className="flex flex-col flex-1 gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-text-primary">{rep.id}</span>
                      <Badge variant="neutral" className="font-mono text-[10px]">{rep.model}</Badge>
                    </div>
                    <span className="text-xs text-text-tertiary">{formatRelative(rep.generatedAt)}</span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mt-1">
                    {rep.summary}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between ml-4 shrink-0 border-l border-border-subtle pl-4">
                  <RiskBadge score={rep.riskScore} />
                  <div className="flex items-center gap-1 text-sm text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Open <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Filter Rail */}
        <div className="w-64 border-l border-border-default bg-surface p-4 flex flex-col shrink-0">
          <div className="flex items-center gap-2 mb-4 text-text-primary">
            <Filter size={16} />
            <h3 className="text-sm font-medium">Filters</h3>
          </div>
          <div className="flex flex-col gap-1">
            {['All', 'Generated Today', 'This Week'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "text-left px-3 py-2 rounded text-sm transition-colors",
                  filter === f ? "bg-inset text-text-primary font-medium" : "text-text-secondary hover:bg-inset/50"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
