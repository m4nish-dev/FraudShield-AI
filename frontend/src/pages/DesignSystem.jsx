import { useState } from 'react'
import {
  ShieldAlert, AlertTriangle, Search, Plus, Trash2,
  Download, RefreshCw, Eye, Filter, Fingerprint,
  Activity, GitBranch, Waypoints, BarChart3, Info,
  CheckCircle2, XCircle, Clock, Package,
} from 'lucide-react'

// UI Primitives
import Button            from '../components/ui/Button'
import IconButton        from '../components/ui/IconButton'
import Badge             from '../components/ui/Badge'
import RiskBadge         from '../components/ui/RiskBadge'
import RiskBar           from '../components/ui/RiskBar'
import Card              from '../components/ui/Card'
import Input             from '../components/ui/Input'
import Select            from '../components/ui/Select'
import { Tabs, TabList, Tab, TabPanel } from '../components/ui/Tabs'
import Table             from '../components/ui/Table'
import Tooltip           from '../components/ui/Tooltip'
import Modal             from '../components/ui/Modal'
import Drawer            from '../components/ui/Drawer'
import Skeleton, { SkeletonText } from '../components/ui/Skeleton'
import EmptyState        from '../components/ui/EmptyState'
import Kbd               from '../components/ui/Kbd'
import Divider           from '../components/ui/Divider'

// Shared
import StatCard          from '../components/shared/StatCard'
import AlertRow          from '../components/shared/AlertRow'
import ThemeToggle       from '../components/shared/ThemeToggle'

import mockAlerts        from '../mock/alerts.json'
import { cn }            from '../lib/cn'

// ─── Section wrapper ─────────────────────────────────────────────────────
function Section({ title, description, children, className }) {
  return (
    <section className={cn('flex flex-col gap-5', className)}>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-display font-semibold text-text-primary tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-text-secondary">{description}</p>
        )}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

// ─── Row helper ──────────────────────────────────────────────────────────
function Row({ label, children, className }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
          {label}
        </span>
      )}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

// ─── Swatch ──────────────────────────────────────────────────────────────
function ColorSwatch({ color, label, hex }) {
  return (
    <div className="flex flex-col gap-1.5 items-center">
      <div
        className="w-12 h-12 rounded-lg border border-border-default shadow-card"
        style={{ backgroundColor: hex }}
        title={hex}
      />
      <span className="text-xs text-text-tertiary text-center leading-tight">
        {label}
      </span>
    </div>
  )
}

// ─── Mock table data ──────────────────────────────────────────────────────
const TABLE_COLUMNS = [
  { key: 'id',     label: 'ID',       width: '140px' },
  { key: 'amount', label: 'Amount',   align: 'right' },
  { key: 'status', label: 'Status' },
  { key: 'score',  label: 'Risk',     align: 'right' },
]

const TABLE_ROWS = [
  { id: 'TXN-10a9f3b2', amount: '₹1,87,500', status: 'Flagged',  score: 91.4, risk: 91.4 },
  { id: 'TXN-20b1c4d3', amount: '₹42,000',   status: 'Reviewing', score: 73.8, risk: 73.8 },
  { id: 'TXN-30c2d5e4', amount: '₹9,800',    status: 'Cleared',  score: 18.2, risk: 18.2 },
]

// ─── Sparkline data ────────────────────────────────────────────────────
const spark = [
  { v: 42 }, { v: 47 }, { v: 39 }, { v: 58 }, { v: 61 },
  { v: 55 }, { v: 72 }, { v: 68 }, { v: 81 }, { v: 91 },
]

export default function DesignSystem() {
  const [modalOpen, setModalOpen]   = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [inputVal, setInputVal]     = useState('')
  const [selectVal, setSelectVal]   = useState('')
  const [tabValue, setTabValue]     = useState('colors')

  return (
    <div className="min-h-screen bg-canvas">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-canvas/90 backdrop-blur-sm border-b border-border-subtle px-8 py-4">
        <div className="flex items-center justify-between max-w-content mx-auto">
          <div>
            <h1 className="text-xl font-display font-semibold tracking-tight text-text-primary">
              Design System
            </h1>
            <p className="text-xs text-text-tertiary mt-0.5">
              FraudShield AI · Component QA Catalog · Phase 2
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="accent" dot>Live</Badge>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* ── Top Tabs ──────────────────────────────────────────────────── */}
      <div className="max-w-content mx-auto px-8">
        <Tabs value={tabValue} onChange={setTabValue}>
          <TabList>
            <Tab value="colors">Colors</Tab>
            <Tab value="typography">Typography</Tab>
            <Tab value="buttons">Buttons</Tab>
            <Tab value="badges">Badges & Risk</Tab>
            <Tab value="forms">Forms</Tab>
            <Tab value="cards">Cards & Layout</Tab>
            <Tab value="data">Data Display</Tab>
            <Tab value="overlays">Overlays</Tab>
            <Tab value="feedback">Feedback</Tab>
            <Tab value="shared">Shared</Tab>
          </TabList>

          {/* ════════════════════════════════════════════════════════════ */}
          {/*  COLORS                                                      */}
          {/* ════════════════════════════════════════════════════════════ */}
          <TabPanel value="colors">
            <div className="py-8 flex flex-col gap-10">

              <Section title="Surface System" description="Canvas → Surface → Elevated → Inset hierarchy">
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: 'canvas',   hex: '#0A0A0B' },
                    { label: 'surface',  hex: '#111113' },
                    { label: 'elevated', hex: '#17171A' },
                    { label: 'inset',    hex: '#08080A' },
                  ].map((s) => <ColorSwatch key={s.label} {...s} />)}
                </div>
              </Section>

              <Divider />

              <Section title="Border System">
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: 'border.subtle',  hex: '#1F1F23' },
                    { label: 'border.default', hex: '#27272C' },
                    { label: 'border.strong',  hex: '#3A3A42' },
                  ].map((s) => <ColorSwatch key={s.label} {...s} />)}
                </div>
              </Section>

              <Divider />

              <Section title="Text System">
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: 'primary',   hex: '#F4F4F5' },
                    { label: 'secondary', hex: '#A1A1AA' },
                    { label: 'tertiary',  hex: '#71717A' },
                    { label: 'disabled',  hex: '#52525B' },
                  ].map((s) => <ColorSwatch key={s.label} {...s} />)}
                </div>
              </Section>

              <Divider />

              <Section title="Accent Scale (Sky-blue)">
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: 'accent-900 (muted)', hex: '#0C4A6E' },
                    { label: 'accent-700',         hex: '#0369A1' },
                    { label: 'accent-500',         hex: '#0EA5E9' },
                    { label: 'accent-DEFAULT',     hex: '#38BDF8' },
                    { label: 'accent-300',         hex: '#7DD3FC' },
                    { label: 'accent-100',         hex: '#E0F2FE' },
                  ].map((s) => <ColorSwatch key={s.label} {...s} />)}
                </div>
              </Section>

              <Divider />

              <Section title="Risk Semantic Palette" description="Critical (80–100) → High → Medium → Low → Safe (0–20)">
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: 'critical', hex: '#F43F5E' },
                    { label: 'high',     hex: '#FB923C' },
                    { label: 'medium',   hex: '#FACC15' },
                    { label: 'low',      hex: '#4ADE80' },
                    { label: 'safe',     hex: '#22D3EE' },
                  ].map((s) => <ColorSwatch key={s.label} {...s} />)}
                </div>
                <div className="grid grid-cols-5 gap-3 mt-2">
                  {[91.4, 72.3, 50.1, 33.8, 9.2].map((score) => (
                    <RiskBar key={score} score={score} height="md" showLabel />
                  ))}
                </div>
              </Section>
            </div>
          </TabPanel>

          {/* ════════════════════════════════════════════════════════════ */}
          {/*  TYPOGRAPHY                                                  */}
          {/* ════════════════════════════════════════════════════════════ */}
          <TabPanel value="typography">
            <div className="py-8 flex flex-col gap-10">
              <Section title="Type Scale" description="Density-optimised — 14px base, Inter primary">
                <div className="flex flex-col gap-3 bg-surface border border-border-default rounded-lg p-6">
                  {[
                    { cls: 'text-xs',  label: 'text-xs — 11px/16px' },
                    { cls: 'text-sm',  label: 'text-sm — 13px/18px' },
                    { cls: 'text-base',label: 'text-base — 14px/20px  (default body)' },
                    { cls: 'text-md',  label: 'text-md — 15px/22px' },
                    { cls: 'text-lg',  label: 'text-lg — 17px/24px' },
                    { cls: 'text-xl',  label: 'text-xl — 20px/28px' },
                    { cls: 'text-2xl', label: 'text-2xl — 24px/32px  (page title)' },
                    { cls: 'text-3xl', label: 'text-3xl — 30px/38px  (metric)' },
                    { cls: 'text-4xl', label: 'text-4xl — 36px/44px  (hero)' },
                  ].map(({ cls, label }) => (
                    <div key={cls} className="flex items-baseline gap-4">
                      <code className="w-24 shrink-0 text-xs text-text-tertiary font-mono">{cls}</code>
                      <span className={cn(cls, 'text-text-primary font-sans')}>{label}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Font Families">
                <div className="flex flex-col gap-4 bg-surface border border-border-default rounded-lg p-6">
                  <div>
                    <p className="text-xs text-text-tertiary mb-1 font-mono">font-sans (Inter)</p>
                    <p className="font-sans text-text-primary text-lg">
                      The quick brown fox jumps over the lazy dog — 0123456789
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-tertiary mb-1 font-mono">font-display (Inter Tight)</p>
                    <p className="font-display font-semibold text-text-primary text-2xl tracking-tight">
                      FraudShield AI — Intelligence Platform
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-tertiary mb-1 font-mono">font-mono (JetBrains Mono)</p>
                    <p className="font-mono text-text-primary text-sm">
                      TXN-10a9f3b2c1d4…f92c  ₹1,87,500.00  91.4%  2026-09-24T11:47:23Z
                    </p>
                  </div>
                </div>
              </Section>
            </div>
          </TabPanel>

          {/* ════════════════════════════════════════════════════════════ */}
          {/*  BUTTONS                                                     */}
          {/* ════════════════════════════════════════════════════════════ */}
          <TabPanel value="buttons">
            <div className="py-8 flex flex-col gap-10">
              <Section title="Button Variants">
                <Row label="Sizes — Secondary">
                  <Button variant="secondary" size="sm">Small</Button>
                  <Button variant="secondary" size="md">Medium</Button>
                  <Button variant="secondary" size="lg">Large</Button>
                </Row>
                <Row label="Primary">
                  <Button variant="primary" size="sm">Confirm</Button>
                  <Button variant="primary" size="md">Export Report</Button>
                  <Button variant="primary" size="lg">Launch Investigation</Button>
                </Row>
                <Row label="Ghost">
                  <Button variant="ghost" size="sm">Cancel</Button>
                  <Button variant="ghost" size="md">View Details</Button>
                  <Button variant="ghost" size="lg">Dismiss All</Button>
                </Row>
                <Row label="Danger">
                  <Button variant="danger" size="sm">Delete</Button>
                  <Button variant="danger" size="md">Escalate Case</Button>
                  <Button variant="danger" size="lg">Block Account</Button>
                </Row>
                <Row label="With Icons">
                  <Button variant="primary" size="md" leftIcon={<Plus size={14} strokeWidth={1.75} />}>
                    New Case
                  </Button>
                  <Button variant="secondary" size="md" leftIcon={<Download size={14} strokeWidth={1.75} />}>
                    Export CSV
                  </Button>
                  <Button variant="ghost" size="md" rightIcon={<Eye size={14} strokeWidth={1.75} />}>
                    View All
                  </Button>
                  <Button variant="danger" size="md" leftIcon={<Trash2 size={14} strokeWidth={1.75} />}>
                    Remove
                  </Button>
                </Row>
                <Row label="Loading + Disabled">
                  <Button variant="primary" size="md" loading>Processing…</Button>
                  <Button variant="secondary" size="md" loading>Analyzing</Button>
                  <Button variant="primary" size="md" disabled>Disabled</Button>
                  <Button variant="danger" size="md" disabled>Blocked</Button>
                </Row>
              </Section>

              <Divider />

              <Section title="Icon Buttons">
                <Row label="Ghost (default)">
                  <IconButton aria-label="Filter" size="md"><Filter size={16} strokeWidth={1.75} /></IconButton>
                  <IconButton aria-label="Refresh" size="md"><RefreshCw size={16} strokeWidth={1.75} /></IconButton>
                  <IconButton aria-label="Download" size="md"><Download size={16} strokeWidth={1.75} /></IconButton>
                  <IconButton aria-label="Search" size="sm"><Search size={14} strokeWidth={1.75} /></IconButton>
                </Row>
                <Row label="Secondary + Primary + Danger">
                  <IconButton variant="secondary" aria-label="Add" size="md"><Plus size={16} strokeWidth={1.75} /></IconButton>
                  <IconButton variant="primary" aria-label="Confirm" size="md"><CheckCircle2 size={16} strokeWidth={1.75} /></IconButton>
                  <IconButton variant="danger" aria-label="Delete" size="md"><Trash2 size={16} strokeWidth={1.75} /></IconButton>
                </Row>
              </Section>

              <Divider />

              <Section title="Kbd">
                <Row>
                  <Kbd>⌘</Kbd><Kbd>K</Kbd>
                  <span className="text-text-tertiary text-xs mx-2">—</span>
                  <Kbd>⌘</Kbd><Kbd>⇧</Kbd><Kbd>F</Kbd>
                  <span className="text-text-tertiary text-xs mx-2">—</span>
                  <Kbd>Esc</Kbd>
                  <span className="text-text-tertiary text-xs mx-2">—</span>
                  <Kbd>Enter</Kbd>
                </Row>
              </Section>
            </div>
          </TabPanel>

          {/* ════════════════════════════════════════════════════════════ */}
          {/*  BADGES & RISK                                               */}
          {/* ════════════════════════════════════════════════════════════ */}
          <TabPanel value="badges">
            <div className="py-8 flex flex-col gap-10">
              <Section title="Badge Variants">
                <Row label="Sm (default)">
                  <Badge>Default</Badge>
                  <Badge variant="accent">Accent</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                  <Badge variant="neutral">Neutral</Badge>
                  <Badge variant="high">High</Badge>
                </Row>
                <Row label="With Dot">
                  <Badge dot>Live</Badge>
                  <Badge variant="accent" dot>Active</Badge>
                  <Badge variant="success" dot>Cleared</Badge>
                  <Badge variant="warning" dot>Reviewing</Badge>
                  <Badge variant="danger" dot>Critical</Badge>
                </Row>
                <Row label="Md size">
                  <Badge size="md">Default Md</Badge>
                  <Badge size="md" variant="accent" dot>Accent Md</Badge>
                  <Badge size="md" variant="danger" dot>Flagged Md</Badge>
                </Row>
              </Section>

              <Divider />

              <Section title="RiskBadge — Auto-color from score">
                <Row label="All 5 levels">
                  {[9, 31, 52, 74, 91].map((score) => (
                    <RiskBadge key={score} score={score} />
                  ))}
                </Row>
                <Row label="Score hidden">
                  {[9, 31, 52, 74, 91].map((score) => (
                    <RiskBadge key={score} score={score} showScore={false} />
                  ))}
                </Row>
                <Row label="Md size">
                  {[9, 31, 52, 74, 91].map((score) => (
                    <RiskBadge key={score} score={score} size="md" />
                  ))}
                </Row>
              </Section>

              <Divider />

              <Section title="RiskBar — Horizontal risk score bars">
                <div className="max-w-sm flex flex-col gap-5">
                  {[9.2, 33.8, 52.4, 74.1, 91.4].map((score) => (
                    <RiskBar key={score} score={score} height="md" showLabel />
                  ))}
                </div>
                <Row label="Heights">
                  <div className="flex flex-col gap-3 w-64">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-tertiary w-6">xs</span>
                      <RiskBar score={87} height="xs" className="flex-1" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-tertiary w-6">sm</span>
                      <RiskBar score={87} height="sm" className="flex-1" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-tertiary w-6">md</span>
                      <RiskBar score={87} height="md" className="flex-1" />
                    </div>
                  </div>
                </Row>
              </Section>
            </div>
          </TabPanel>

          {/* ════════════════════════════════════════════════════════════ */}
          {/*  FORMS                                                       */}
          {/* ════════════════════════════════════════════════════════════ */}
          <TabPanel value="forms">
            <div className="py-8 flex flex-col gap-10">
              <Section title="Input" description="Keyboard accessible, ARIA-described">
                <div className="grid grid-cols-2 gap-6 max-w-2xl">
                  <Input
                    id="search-input"
                    label="Search Transactions"
                    placeholder="TXN ID, account, amount…"
                    leftIcon={<Search size={14} strokeWidth={1.75} />}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                  />
                  <Input
                    id="amount-input"
                    label="Amount Filter"
                    placeholder="₹0.00"
                    helper="Enter minimum flagged amount"
                  />
                  <Input
                    id="error-input"
                    label="Account ID"
                    placeholder="ACC-XXXX"
                    error="Account not found in system"
                  />
                  <Input
                    id="disabled-input"
                    label="Case Reference (locked)"
                    placeholder="CASE-0042"
                    disabled
                    value="CASE-0042"
                  />
                </div>
              </Section>

              <Divider />

              <Section title="Select">
                <div className="grid grid-cols-2 gap-6 max-w-2xl">
                  <Select
                    id="risk-select"
                    label="Risk Level"
                    placeholder="All levels"
                    value={selectVal}
                    onChange={(e) => setSelectVal(e.target.value)}
                    options={[
                      { value: 'critical', label: 'Critical (80–100)' },
                      { value: 'high',     label: 'High (60–80)' },
                      { value: 'medium',   label: 'Medium (40–60)' },
                      { value: 'low',      label: 'Low (20–40)' },
                      { value: 'safe',     label: 'Safe (0–20)' },
                    ]}
                  />
                  <Select
                    id="status-select"
                    label="Case Status"
                    placeholder="All statuses"
                    options={[
                      { value: 'open',      label: 'Open' },
                      { value: 'reviewing', label: 'Reviewing' },
                      { value: 'closed',    label: 'Closed' },
                    ]}
                  />
                  <Select
                    id="error-select"
                    label="Channel (required)"
                    placeholder="Select channel"
                    error="Please select a payment channel"
                    options={[
                      { value: 'upi',  label: 'UPI' },
                      { value: 'imps', label: 'IMPS' },
                      { value: 'rtgs', label: 'RTGS' },
                    ]}
                  />
                  <Select
                    id="disabled-select"
                    label="Model Type (readonly)"
                    disabled
                    options={[{ value: 'fusion', label: 'Fusion (all models)' }]}
                    value="fusion"
                    onChange={() => {}}
                  />
                </div>
              </Section>
            </div>
          </TabPanel>

          {/* ════════════════════════════════════════════════════════════ */}
          {/*  CARDS & LAYOUT                                              */}
          {/* ════════════════════════════════════════════════════════════ */}
          <TabPanel value="cards">
            <div className="py-8 flex flex-col gap-10">
              <Section title="Card — Compound pattern">
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <Card.Header
                      title="Transaction Overview"
                      subtitle="Last 24 hours"
                      actions={
                        <IconButton aria-label="Refresh" size="sm">
                          <RefreshCw size={14} strokeWidth={1.75} />
                        </IconButton>
                      }
                    />
                    <Card.Body>
                      <p className="text-sm text-text-secondary">
                        Card body content — charts, tables, or detail panels go here.
                        The body is <code className="font-mono text-xs text-accent">p-5</code> padded.
                      </p>
                    </Card.Body>
                    <Card.Footer>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-tertiary">Updated 2m ago</span>
                        <Button variant="ghost" size="sm">View All</Button>
                      </div>
                    </Card.Footer>
                  </Card>

                  <Card>
                    <Card.Header title="Risk Profile" />
                    <Card.Body>
                      <div className="flex flex-col gap-4">
                        {[
                          { label: 'Transaction Model', score: 88.2 },
                          { label: 'Behavioural Model', score: 93.1 },
                          { label: 'Anomaly Model',     score: 95.0 },
                          { label: 'Temporal Model',    score: 79.6 },
                          { label: 'Graph Model',       score: 87.4 },
                        ].map(({ label, score }) => (
                          <div key={label} className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-text-secondary">{label}</span>
                              <span className="text-xs tabular font-mono text-text-secondary">{score.toFixed(1)}</span>
                            </div>
                            <RiskBar score={score} height="xs" />
                          </div>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Section>

              <Divider />

              <Section title="Divider variants">
                <div className="flex flex-col gap-4 max-w-md">
                  <Divider />
                  <Divider label="SECTION BREAK" />
                  <div className="flex items-center gap-4 h-8">
                    <span className="text-sm text-text-secondary">Left</span>
                    <Divider orientation="vertical" />
                    <span className="text-sm text-text-secondary">Right</span>
                  </div>
                </div>
              </Section>
            </div>
          </TabPanel>

          {/* ════════════════════════════════════════════════════════════ */}
          {/*  DATA DISPLAY                                                */}
          {/* ════════════════════════════════════════════════════════════ */}
          <TabPanel value="data">
            <div className="py-8 flex flex-col gap-10">
              <Section title="Table — Sticky header, row hover, custom render">
                <Card>
                  <Table
                    columns={TABLE_COLUMNS}
                    rows={TABLE_ROWS}
                    onRowClick={(row) => console.log('Row clicked:', row)}
                    renderCell={(col, row) => {
                      if (col.key === 'id') {
                        return <span className="font-mono text-xs text-accent">{row.id}</span>
                      }
                      if (col.key === 'amount') {
                        return <span className="font-mono text-xs text-text-primary tabular">{row.amount}</span>
                      }
                      if (col.key === 'status') {
                        const v = row.status === 'Flagged' ? 'danger'
                          : row.status === 'Reviewing' ? 'warning'
                          : 'success'
                        return <Badge variant={v} dot>{row.status}</Badge>
                      }
                      if (col.key === 'score') {
                        return <RiskBadge score={row.risk} />
                      }
                      return row[col.key]
                    }}
                  />
                </Card>
              </Section>

              <Divider />

              <Section title="Tooltip">
                <Row>
                  <Tooltip content="This is the fusion score — weighted average across all 5 ML models.">
                    <Button variant="secondary" size="sm" rightIcon={<Info size={12} strokeWidth={1.75} />}>
                      Hover me (top)
                    </Button>
                  </Tooltip>
                  <Tooltip content="Critical risk — immediate intervention recommended." placement="bottom">
                    <RiskBadge score={91.4} />
                  </Tooltip>
                  <Tooltip content="Attack chain reconstructed from 14 evidence nodes." placement="right">
                    <IconButton variant="secondary" aria-label="Info" size="md">
                      <GitBranch size={16} strokeWidth={1.75} />
                    </IconButton>
                  </Tooltip>
                </Row>
              </Section>
            </div>
          </TabPanel>

          {/* ════════════════════════════════════════════════════════════ */}
          {/*  OVERLAYS                                                    */}
          {/* ════════════════════════════════════════════════════════════ */}
          <TabPanel value="overlays">
            <div className="py-8 flex flex-col gap-10">
              <Section title="Modal" description="Framer Motion fade + scale, backdrop blur, escape-to-close">
                <Row>
                  <Button variant="secondary" size="md" onClick={() => setModalOpen(true)}>
                    Open Modal
                  </Button>
                </Row>
                <Modal
                  open={modalOpen}
                  onClose={() => setModalOpen(false)}
                  title="Confirm Intervention"
                  description="This action will place a block on all linked accounts and notify the fraud response team."
                  footer={
                    <>
                      <Button variant="ghost" size="md" onClick={() => setModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="danger" size="md" onClick={() => setModalOpen(false)}>
                        Block Accounts
                      </Button>
                    </>
                  }
                >
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-text-secondary">
                      The following accounts will be flagged and restricted from all outgoing transfers:
                    </p>
                    <div className="bg-inset rounded-lg p-3 flex flex-col gap-2">
                      {['ACC-8812 — Rajesh Kumar Sharma', 'ACC-3345 — Mule Account (Thane)', 'ACC-9981 — Vertex Infra Pvt Ltd'].map((acc) => (
                        <div key={acc} className="flex items-center gap-2">
                          <XCircle size={14} strokeWidth={1.75} className="text-risk-critical" />
                          <span className="font-mono text-xs text-text-primary">{acc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Modal>
              </Section>

              <Divider />

              <Section title="Drawer" description="Right-side slide-in, 520px, custom easing">
                <Row>
                  <Button variant="secondary" size="md" onClick={() => setDrawerOpen(true)}>
                    Open Drawer
                  </Button>
                </Row>
                <Drawer
                  open={drawerOpen}
                  onClose={() => setDrawerOpen(false)}
                  title="TXN-10a9f3b2"
                  description="High-velocity UPI transfer · ACC-8812 · ₹1,87,500"
                  footer={
                    <>
                      <Button variant="ghost" size="md" onClick={() => setDrawerOpen(false)}>Close</Button>
                      <Button variant="primary" size="md">Open Full Detail</Button>
                    </>
                  }
                >
                  <div className="p-6 flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                      <RiskBadge score={91.4} size="md" />
                      <Badge variant="danger" dot>Flagged</Badge>
                    </div>
                    <div className="flex flex-col gap-3">
                      {[
                        { label: 'Transaction Model', score: 88.2 },
                        { label: 'Behavioural Model', score: 93.1 },
                        { label: 'Anomaly Model',     score: 95.0 },
                        { label: 'Temporal Model',    score: 79.6 },
                        { label: 'Graph Model',       score: 87.4 },
                      ].map(({ label, score }) => (
                        <div key={label}>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-text-secondary">{label}</span>
                            <span className="text-xs font-mono tabular text-text-secondary">{score}</span>
                          </div>
                          <RiskBar score={score} height="sm" />
                        </div>
                      ))}
                    </div>
                    <Divider />
                    <p className="text-xs text-text-tertiary leading-relaxed">
                      This transaction triggered velocity rule VR-012 (14 transfers in 18 minutes). 
                      Graph analysis links to 2 known mule accounts in CMP-009 campaign cluster.
                    </p>
                  </div>
                </Drawer>
              </Section>
            </div>
          </TabPanel>

          {/* ════════════════════════════════════════════════════════════ */}
          {/*  FEEDBACK STATES                                             */}
          {/* ════════════════════════════════════════════════════════════ */}
          <TabPanel value="feedback">
            <div className="py-8 flex flex-col gap-10">
              <Section title="Skeleton — Shimmer loading states">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <Skeleton className="h-8 w-32" rounded="md" />
                    <SkeletonText lines={3} />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" rounded="md" />
                      <Skeleton className="h-6 w-20" rounded="md" />
                      <Skeleton className="h-6 w-12" rounded="md" />
                    </div>
                  </div>
                  <Card>
                    <Card.Header title="Loading…" />
                    <Card.Body>
                      <div className="flex flex-col gap-3">
                        <Skeleton className="h-32 w-full" rounded="lg" />
                        <SkeletonText lines={2} />
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Section>

              <Divider />

              <Section title="EmptyState — No data scenarios">
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <EmptyState
                      icon={Activity}
                      title="No alerts in the last hour"
                      description="All monitored transactions are within normal parameters. System is operating normally."
                      action="View All Alerts"
                      onAction={() => {}}
                    />
                  </Card>
                  <Card>
                    <EmptyState
                      icon={Package}
                      title="No cases assigned"
                      description="You have no open cases. New flagged transactions will appear here when assigned."
                      action="Browse All Cases"
                      onAction={() => {}}
                      actionVariant="primary"
                    />
                  </Card>
                </div>
              </Section>
            </div>
          </TabPanel>

          {/* ════════════════════════════════════════════════════════════ */}
          {/*  SHARED COMPONENTS                                           */}
          {/* ════════════════════════════════════════════════════════════ */}
          <TabPanel value="shared">
            <div className="py-8 flex flex-col gap-10">
              <Section title="StatCard — KPI metric cards">
                <div className="grid grid-cols-4 gap-4">
                  <StatCard
                    label="Transactions Today"
                    value="14,821"
                    delta={8.3}
                    deltaLabel="vs yesterday"
                    icon={Activity}
                    sparkline={spark}
                    sparkColor="#38BDF8"
                  />
                  <StatCard
                    label="Flagged"
                    value="247"
                    delta={23.1}
                    deltaLabel="vs yesterday"
                    icon={AlertTriangle}
                    sparkline={[...spark].reverse()}
                    sparkColor="#F43F5E"
                  />
                  <StatCard
                    label="Avg Risk Score"
                    value="68.4"
                    delta={-4.2}
                    deltaLabel="vs yesterday"
                    icon={Fingerprint}
                    sparkline={spark.map((d, i) => ({ v: 60 + i * 2.5 }))}
                    sparkColor="#FB923C"
                  />
                  <StatCard
                    label="Active Cases"
                    value="31"
                    delta={0}
                    deltaLabel="no change"
                    icon={BarChart3}
                  />
                </div>
              </Section>

              <Divider />

              <Section title="AlertRow — Alert list items">
                <Card>
                  {mockAlerts.map((alert) => (
                    <AlertRow
                      key={alert.id}
                      alert={alert}
                      onClick={(a) => console.log('Alert clicked:', a.id)}
                    />
                  ))}
                </Card>
              </Section>

              <Divider />

              <Section title="ThemeToggle">
                <Row>
                  <ThemeToggle />
                  <span className="text-xs text-text-tertiary">
                    Toggles dark/light mode via Zustand → html.dark class
                  </span>
                </Row>
              </Section>
            </div>
          </TabPanel>
        </Tabs>
      </div>

      {/* Bottom padding */}
      <div className="h-16" />
    </div>
  )
}
