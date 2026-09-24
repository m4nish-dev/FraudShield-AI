import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  SlidersHorizontal, Download, RefreshCw, Search,
  Columns3, ArrowUpDown, ChevronUp, ChevronDown,
  Smartphone, MoreHorizontal, Copy, ArrowRight,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import PageHeader   from '../components/layout/PageHeader'
import Button       from '../components/ui/Button'
import IconButton   from '../components/ui/IconButton'
import Badge        from '../components/ui/Badge'
import RiskBadge    from '../components/ui/RiskBadge'
import RiskBar      from '../components/ui/RiskBar'
import Input        from '../components/ui/Input'
import Select       from '../components/ui/Select'
import Drawer       from '../components/ui/Drawer'
import Tooltip      from '../components/ui/Tooltip'
import EmptyState   from '../components/ui/EmptyState'

import { TransactionDetailPanel } from '../components/fraud/TransactionDetailPanel'

import transactions from '../mock/transactions.json'
import { getRiskLevel } from '../lib/risk'
import { formatTime, formatRelative } from '../lib/format'
import { cn }       from '../lib/cn'

// ─── Status config ─────────────────────────────────────────────────────
const STATUS_VARIANT = { blocked: 'danger', review: 'warning', cleared: 'success', pending: 'neutral' }
const STATUS_LABEL   = { blocked: 'Blocked', review: 'Review', cleared: 'Cleared', pending: 'Pending' }

// ─── Sort indicator ────────────────────────────────────────────────────
function SortIcon({ field, sortField, sortDir }) {
  if (sortField !== field) {
    return <ArrowUpDown size={11} strokeWidth={1.75} className="text-text-disabled shrink-0" />
  }
  return sortDir === 'asc'
    ? <ChevronUp  size={11} strokeWidth={2} className="text-accent shrink-0" />
    : <ChevronDown size={11} strokeWidth={2} className="text-accent shrink-0" />
}

// ─── Sortable column header ────────────────────────────────────────────
function SortableHeader({ field, label, sortField, sortDir, onSort, align = 'left', className }) {
  return (
    <th
      scope="col"
      onClick={() => onSort(field)}
      className={cn(
        'py-2 px-3 border-b border-border-default select-none cursor-pointer',
        'text-xs font-medium uppercase tracking-wider text-text-tertiary',
        'hover:text-text-secondary whitespace-nowrap',
        'transition-colors duration-100',
        align === 'right' && 'text-right',
        className
      )}
    >
      <span className={cn('inline-flex items-center gap-1', align === 'right' && 'justify-end w-full')}>
        {label}
        <SortIcon field={field} sortField={sortField} sortDir={sortDir} />
      </span>
    </th>
  )
}

// ─── Transactions Page ─────────────────────────────────────────────────
export default function Transactions() {
  const navigate = useNavigate()

  // ── Filter state ─────────────────────────────────────────────────────
  const [search,      setSearch]      = useState('')
  const [status,      setStatus]      = useState('all')
  const [riskLevel,   setRiskLevel]   = useState('all')
  const [amountBand,  setAmountBand]  = useState('all')
  const [sortField,   setSortField]   = useState('timestamp')
  const [sortDir,     setSortDir]     = useState('desc')

  // ── Drawer state ─────────────────────────────────────────────────────
  const [selectedTx,  setSelectedTx]  = useState(null)
  const [drawerOpen,  setDrawerOpen]  = useState(false)

  // ── Sort toggle ──────────────────────────────────────────────────────
  const handleSort = useCallback((field) => {
    setSortField(prev => {
      if (prev === field) {
        setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        return field
      }
      setSortDir('desc')
      return field
    })
  }, [])

  // ── Filtered + sorted data ────────────────────────────────────────────
  const filtered = useMemo(() => {
    let data = [...transactions]

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      data = data.filter(t =>
        t.id.toLowerCase().includes(q)           ||
        t.sender.name.toLowerCase().includes(q)  ||
        t.sender.id.toLowerCase().includes(q)    ||
        t.receiver.name.toLowerCase().includes(q)||
        t.receiver.id.toLowerCase().includes(q)  ||
        t.device.toLowerCase().includes(q)       ||
        t.location.city.toLowerCase().includes(q)
      )
    }

    if (status !== 'all')    data = data.filter(t => t.status === status)
    if (riskLevel !== 'all') data = data.filter(t => getRiskLevel(t.riskScore) === riskLevel)

    if (amountBand === 'lt10k')   data = data.filter(t => t.amount < 10_000)
    if (amountBand === '10k-1l')  data = data.filter(t => t.amount >= 10_000 && t.amount <= 100_000)
    if (amountBand === 'gt1l')    data = data.filter(t => t.amount > 100_000)

    data.sort((a, b) => {
      let av, bv
      if (sortField === 'timestamp') { av = new Date(a.timestamp).getTime(); bv = new Date(b.timestamp).getTime() }
      else if (sortField === 'amount')    { av = a.amount;    bv = b.amount    }
      else if (sortField === 'riskScore') { av = a.riskScore; bv = b.riskScore }
      else { av = a[sortField]; bv = b[sortField] }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ?  1 : -1
      return 0
    })

    return data
  }, [search, status, riskLevel, amountBand, sortField, sortDir])

  // ── Row click ────────────────────────────────────────────────────────
  const handleRowClick = useCallback((tx) => {
    setSelectedTx(tx)
    setDrawerOpen(true)
  }, [])

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false)
    setTimeout(() => setSelectedTx(null), 250)
  }, [])

  const handleCopyId = useCallback((e, id) => {
    e.stopPropagation()
    navigator.clipboard.writeText(id).catch(() => {})
  }, [])

  return (
    <div className="min-h-full flex flex-col">
      {/* ── Page Header ───────────────────────────────────────────────── */}
      <PageHeader
        title="Transactions"
        subtitle="12,482 scanned in the last 24 hours · real-time feed active"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<SlidersHorizontal size={14} strokeWidth={1.75} />}
            >
              Filters
            </Button>
            <Button
              variant="secondary"
              size="md"
              leftIcon={<Download size={14} strokeWidth={1.75} />}
            >
              Export
            </Button>
            <IconButton variant="ghost" size="md" aria-label="Refresh transactions">
              <RefreshCw size={15} strokeWidth={1.75} />
            </IconButton>
          </div>
        }
      />

      {/* ── Filter Bar (sticky) ──────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-surface border-b border-border-subtle">
        <div className="flex items-center gap-2 px-6 py-3 flex-wrap">
          {/* Search */}
          <Input
            id="txn-search"
            placeholder="Search by ID, account, device…"
            leftIcon={<Search size={13} strokeWidth={1.75} />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            wrapperClassName="w-64 shrink-0"
          />

          {/* Status filter */}
          <Select
            id="txn-status"
            value={status}
            onChange={e => setStatus(e.target.value)}
            wrapperClassName="w-36 shrink-0"
            options={[
              { value: 'all',     label: 'All Statuses' },
              { value: 'cleared', label: 'Cleared' },
              { value: 'review',  label: 'Review' },
              { value: 'blocked', label: 'Blocked' },
              { value: 'pending', label: 'Pending' },
            ]}
          />

          {/* Risk level filter */}
          <Select
            id="txn-risk"
            value={riskLevel}
            onChange={e => setRiskLevel(e.target.value)}
            wrapperClassName="w-36 shrink-0"
            options={[
              { value: 'all',      label: 'All Risk Levels' },
              { value: 'critical', label: 'Critical (80–100)' },
              { value: 'high',     label: 'High (60–80)' },
              { value: 'medium',   label: 'Medium (40–60)' },
              { value: 'low',      label: 'Low (20–40)' },
              { value: 'safe',     label: 'Safe (0–20)' },
            ]}
          />

          {/* Amount filter */}
          <Select
            id="txn-amount"
            value={amountBand}
            onChange={e => setAmountBand(e.target.value)}
            wrapperClassName="w-36 shrink-0"
            options={[
              { value: 'all',    label: 'All Amounts' },
              { value: 'lt10k',  label: 'Below ₹10K' },
              { value: '10k-1l', label: '₹10K – ₹1L' },
              { value: 'gt1l',   label: 'Above ₹1L' },
            ]}
          />

          {/* Spacer */}
          <div className="flex-1" />

          {/* Results count */}
          <span className="text-xs text-text-tertiary whitespace-nowrap shrink-0 font-mono tabular">
            Showing{' '}
            <span className="text-text-primary font-medium">
              {filtered.length.toLocaleString()}
            </span>
            {' '}of{' '}
            <span className="text-text-primary font-medium">12,482</span>
          </span>

          {/* Column button */}
          <Tooltip content="Toggle columns" placement="left">
            <IconButton variant="ghost" size="sm" aria-label="Manage columns">
              <Columns3 size={14} strokeWidth={1.75} />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* ── Data Table ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No transactions found"
            description="Adjust your filters or search query to find matching transactions."
            action="Clear Filters"
            onAction={() => { setSearch(''); setStatus('all'); setRiskLevel('all'); setAmountBand('all') }}
          />
        ) : (
          <table className="w-full border-collapse table-fixed text-sm">
            {/* ── Sticky Table Header ────────────────────────────────── */}
            <thead className="bg-surface sticky top-[57px] z-10">
              <tr>
                <SortableHeader
                  field="timestamp" label="Time"
                  sortField={sortField} sortDir={sortDir} onSort={handleSort}
                  className="w-[80px]"
                />
                <th scope="col" className="py-2 px-3 border-b border-border-default text-xs font-medium uppercase tracking-wider text-text-tertiary text-left w-[130px] whitespace-nowrap">
                  TX ID
                </th>
                <th scope="col" className="py-2 px-3 border-b border-border-default text-xs font-medium uppercase tracking-wider text-text-tertiary text-left whitespace-nowrap">
                  Sender
                </th>
                <th scope="col" className="py-2 px-3 border-b border-border-default text-xs font-medium uppercase tracking-wider text-text-tertiary text-left w-6" />
                <th scope="col" className="py-2 px-3 border-b border-border-default text-xs font-medium uppercase tracking-wider text-text-tertiary text-left whitespace-nowrap">
                  Receiver
                </th>
                <SortableHeader
                  field="amount" label="Amount"
                  sortField={sortField} sortDir={sortDir} onSort={handleSort}
                  align="right" className="w-[110px]"
                />
                <th scope="col" className="py-2 px-3 border-b border-border-default text-xs font-medium uppercase tracking-wider text-text-tertiary text-left w-[100px] whitespace-nowrap">
                  Device
                </th>
                <SortableHeader
                  field="riskScore" label="Risk"
                  sortField={sortField} sortDir={sortDir} onSort={handleSort}
                  className="w-[150px]"
                />
                <th scope="col" className="py-2 px-3 border-b border-border-default text-xs font-medium uppercase tracking-wider text-text-tertiary text-left w-[100px] whitespace-nowrap">
                  Status
                </th>
                <th scope="col" className="py-2 px-3 border-b border-border-default w-[44px]" />
              </tr>
            </thead>

            {/* ── Table Body ──────────────────────────────────────────── */}
            <tbody>
              {filtered.map((tx, idx) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.12, delay: Math.min(idx * 0.01, 0.3) }}
                  onClick={() => handleRowClick(tx)}
                  className={cn(
                    'border-b border-border-subtle cursor-pointer',
                    'transition-colors duration-100',
                    'hover:bg-elevated',
                    selectedTx?.id === tx.id && 'bg-elevated border-l-2 border-l-accent',
                  )}
                >
                  {/* Time */}
                  <td className="py-2.5 px-3 align-middle">
                    <span className="font-mono text-xs text-text-tertiary tabular">
                      {formatTime(tx.timestamp)}
                    </span>
                  </td>

                  {/* TX ID */}
                  <td className="py-2.5 px-3 align-middle">
                    <div className="flex items-center gap-1.5">
                      <Tooltip content={tx.id} placement="right">
                        <span className="font-mono text-xs text-accent truncate max-w-[100px] block">
                          {tx.id}
                        </span>
                      </Tooltip>
                      <button
                        onClick={(e) => handleCopyId(e, tx.id)}
                        aria-label={`Copy ${tx.id}`}
                        className="text-text-disabled hover:text-text-tertiary transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                      >
                        <Copy size={11} strokeWidth={1.75} />
                      </button>
                    </div>
                  </td>

                  {/* Sender */}
                  <td className="py-2.5 px-3 align-middle min-w-0">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-sm text-text-primary truncate">{tx.sender.name}</span>
                      <span className="font-mono text-xs text-text-tertiary tabular">{tx.sender.id}</span>
                    </div>
                  </td>

                  {/* Arrow */}
                  <td className="py-2.5 px-1 align-middle">
                    <ArrowRight size={12} strokeWidth={1.75} className="text-text-disabled" />
                  </td>

                  {/* Receiver */}
                  <td className="py-2.5 px-3 align-middle min-w-0">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-sm text-text-primary truncate">{tx.receiver.name}</span>
                      <span className="font-mono text-xs text-text-tertiary tabular">{tx.receiver.id}</span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-2.5 px-3 align-middle text-right">
                    <span className="font-mono text-sm tabular text-text-primary">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                  </td>

                  {/* Device */}
                  <td className="py-2.5 px-3 align-middle">
                    <div className="flex items-center gap-1.5">
                      <Smartphone size={12} strokeWidth={1.75} className="text-text-disabled shrink-0" />
                      <span className="font-mono text-xs text-text-tertiary truncate">
                        {tx.device.replace('DEV-', '')}
                      </span>
                    </div>
                  </td>

                  {/* Risk */}
                  <td className="py-2.5 px-3 align-middle">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <RiskBar score={tx.riskScore} height="xs" className="flex-1 mr-2" />
                        <span
                          className="font-mono text-xs tabular shrink-0 w-8 text-right"
                          style={{ color: tx.riskScore >= 60 ? undefined : undefined }}
                        >
                          <RiskBadge score={tx.riskScore} showScore={false} className="scale-90 origin-right" />
                        </span>
                      </div>
                      <span className="font-mono text-xs tabular text-text-tertiary">
                        {tx.riskScore.toFixed(1)}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-3 align-middle">
                    <Badge variant={STATUS_VARIANT[tx.status] ?? 'neutral'} dot>
                      {STATUS_LABEL[tx.status] ?? tx.status}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-3 align-middle" onClick={e => e.stopPropagation()}>
                    <Tooltip content="More actions" placement="left">
                      <IconButton variant="ghost" size="sm" aria-label="More actions">
                        <MoreHorizontal size={14} strokeWidth={1.75} />
                      </IconButton>
                    </Tooltip>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Transaction Detail Drawer ─────────────────────────────────── */}
      <Drawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        title={selectedTx?.id}
        description={
          selectedTx
            ? `${formatRelative(selectedTx.timestamp)} · ${selectedTx.channel} · ${selectedTx.sender.bank}`
            : ''
        }
        size="lg"
        className="w-[560px]"
        footer={
          selectedTx && (
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight size={13} strokeWidth={1.75} />}
              onClick={() => {
                handleCloseDrawer()
                navigate(`/transactions/${selectedTx.id}`)
              }}
            >
              Full Detail Page
            </Button>
          )
        }
      >
        {selectedTx && (
          <TransactionDetailPanel
            tx={selectedTx}
            layout="drawer"
            onClose={handleCloseDrawer}
          />
        )}
      </Drawer>
    </div>
  )
}
