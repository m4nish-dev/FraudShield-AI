import { useState, useRef } from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  Command,
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { cn } from '../../lib/cn'

/** Route → breadcrumb label map */
const ROUTE_LABELS = {
  '/':                'Dashboard',
  '/transactions':    'Transactions',
  '/alerts':          'Alerts',
  '/cases':           'Cases',
  '/attack-chains':   'Attack Chains',
  '/fraud-network':   'Fraud Network',
  '/campaigns':       'Campaigns',
  '/risk-timeline':   'Risk Timeline',
  '/investigations':  'AI Investigations',
  '/analytics':       'Analytics',
  '/settings':        'Settings',
}

function LiveIndicator() {
  return (
    <div className="flex items-center gap-2 select-none" aria-label="Live data feed active">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75 animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-risk-low" />
      </span>
      <span className="text-xs text-text-tertiary font-medium">Live</span>
    </div>
  )
}

function Breadcrumb() {
  const location = useLocation()
  const parts = location.pathname.split('/').filter(Boolean)
  const currentLabel = ROUTE_LABELS[location.pathname] || (parts[parts.length - 1] ?? 'Dashboard')

  if (parts.length <= 1) {
    return (
      <span className="text-sm font-medium text-text-primary">
        {currentLabel}
      </span>
    )
  }

  const parentPath = '/' + parts.slice(0, -1).join('/')
  const parentLabel = ROUTE_LABELS[parentPath] || parts[parts.length - 2]

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Link
        to={parentPath}
        className="text-text-tertiary hover:text-text-primary transition-colors duration-150"
      >
        {parentLabel}
      </Link>
      <ChevronRight size={14} strokeWidth={1.75} className="text-text-disabled" />
      <span className="text-text-primary font-medium">{currentLabel}</span>
    </div>
  )
}

export default function Topbar() {
  const darkMode      = useAppStore((s) => s.darkMode)
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode)
  const unreadAlerts  = useAppStore((s) => s.unreadAlerts)
  const [searchFocused, setSearchFocused] = useState(false)
  const searchRef = useRef(null)

  return (
    <header
      className={cn(
        'flex items-center gap-4 px-6 shrink-0',
        'h-topbar border-b border-border-subtle bg-surface',
        'z-30'
      )}
    >
      {/* ─── Breadcrumb ────────────────────────────────────────── */}
      <div className="w-44 shrink-0">
        <Breadcrumb />
      </div>

      {/* ─── Global Search ─────────────────────────────────────── */}
      <div className="flex-1 flex justify-center">
        <div
          className={cn(
            'relative w-full max-w-md flex items-center gap-2',
            'bg-inset border rounded-md px-3 h-9',
            'transition-all duration-150',
            searchFocused
              ? 'border-accent ring-2 ring-accent/20'
              : 'border-border-default hover:border-border-strong'
          )}
        >
          <Search
            size={14}
            strokeWidth={1.75}
            className="shrink-0 text-text-tertiary"
            aria-hidden="true"
          />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search transactions, accounts, cases…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={cn(
              'flex-1 bg-transparent text-sm text-text-primary',
              'placeholder:text-text-tertiary',
              'focus:outline-none border-none ring-0'
            )}
            aria-label="Global search"
          />
          {/* ⌘K kbd hint */}
          <div className="flex items-center gap-0.5 shrink-0" aria-label="Keyboard shortcut: Command K">
            <kbd className={cn(
              'inline-flex items-center justify-center',
              'h-5 min-w-5 px-1 rounded',
              'bg-elevated border border-border-default',
              'text-text-disabled font-mono text-xs'
            )}>
              ⌘
            </kbd>
            <kbd className={cn(
              'inline-flex items-center justify-center',
              'h-5 min-w-5 px-1 rounded',
              'bg-elevated border border-border-default',
              'text-text-disabled font-mono text-xs'
            )}>
              K
            </kbd>
          </div>
        </div>
      </div>

      {/* ─── Right Controls ────────────────────────────────────── */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Live indicator */}
        <LiveIndicator />

        {/* Divider */}
        <div className="h-5 w-px bg-border-subtle" aria-hidden="true" />

        {/* Alerts bell */}
        <button
          className={cn(
            'relative flex items-center justify-center w-8 h-8 rounded-md',
            'text-text-tertiary hover:text-text-primary hover:bg-elevated',
            'transition-all duration-150'
          )}
          aria-label={`Alerts — ${unreadAlerts} unread`}
        >
          <Bell size={16} strokeWidth={1.75} />
          {unreadAlerts > 0 && (
            <span
              className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-risk-critical"
              aria-hidden="true"
            />
          )}
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleDarkMode}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-md',
            'text-text-tertiary hover:text-text-primary hover:bg-elevated',
            'transition-all duration-150'
          )}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode
            ? <Sun size={16} strokeWidth={1.75} />
            : <Moon size={16} strokeWidth={1.75} />
          }
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-border-subtle" aria-hidden="true" />

        {/* Avatar */}
        <button
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-full',
            'bg-accent-900 border border-accent-700',
            'text-accent text-xs font-semibold font-mono',
            'hover:border-accent transition-all duration-150'
          )}
          aria-label="User profile — Risk Analyst"
        >
          RA
        </button>
      </div>
    </header>
  )
}
