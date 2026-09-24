import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldAlert,
  LayoutDashboard,
  ArrowLeftRight,
  Bell,
  FolderSearch,
  GitBranch,
  Waypoints,
  Radar,
  LineChart,
  Sparkles,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { cn } from '../../lib/cn'

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard',     icon: LayoutDashboard, path: '/' },
    ],
  },
  {
    label: 'Detect',
    items: [
      { label: 'Transactions',  icon: ArrowLeftRight,  path: '/transactions' },
      { label: 'Alerts',        icon: Bell,            path: '/alerts' },
      { label: 'Cases',         icon: FolderSearch,    path: '/cases' },
    ],
  },
  {
    label: 'Investigate',
    items: [
      { label: 'Attack Chains', icon: GitBranch,       path: '/attack-chains' },
      { label: 'Fraud Network', icon: Waypoints,       path: '/fraud-network' },
      { label: 'Campaigns',     icon: Radar,           path: '/campaigns' },
      { label: 'Risk Timeline', icon: LineChart,       path: '/risk-timeline' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'AI Investigations', icon: Sparkles,   path: '/investigations' },
      { label: 'Analytics',     icon: BarChart3,       path: '/analytics' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings',      icon: Settings,        path: '/settings' },
    ],
  },
]

function NavItem({ item, collapsed }) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
          'transition-all duration-150 ease-out cursor-pointer select-none',
          isActive
            ? 'bg-elevated text-text-primary nav-active-bar'
            : 'text-text-secondary hover:bg-surface hover:text-text-primary'
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            strokeWidth={1.75}
            className={cn(
              'shrink-0 transition-colors duration-150',
              isActive ? 'text-accent' : 'text-text-tertiary group-hover:text-text-secondary'
            )}
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="overflow-hidden whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
          {/* Tooltip when collapsed */}
          {collapsed && (
            <div
              className={cn(
                'absolute left-full ml-3 z-50 hidden group-hover:flex',
                'items-center px-2.5 py-1.5 rounded-md',
                'bg-elevated border border-border-default shadow-elevated',
                'text-text-primary text-sm font-medium whitespace-nowrap',
                'pointer-events-none'
              )}
            >
              {item.label}
            </div>
          )}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'relative flex flex-col h-full shrink-0 overflow-hidden',
        'bg-surface border-r border-border-subtle',
      )}
    >
      {/* ─── Wordmark ─────────────────────────────────────────────── */}
      <div
        className={cn(
          'flex items-center gap-2.5 px-4 border-b border-border-subtle',
          'h-topbar shrink-0'
        )}
      >
        <ShieldAlert
          size={20}
          strokeWidth={1.75}
          className="shrink-0 text-accent"
        />
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="overflow-hidden"
            >
              <span className="font-display font-semibold text-md tracking-tight text-text-primary whitespace-nowrap">
                FraudShield
              </span>
              <span className="font-display font-semibold text-md tracking-tight text-accent ml-0.5">
                AI
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Navigation ───────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="px-3 pb-1.5 text-xs font-medium tracking-wider text-text-tertiary uppercase select-none"
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem key={item.path} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ─── Collapse Button ──────────────────────────────────────── */}
      <div className="shrink-0 p-2 border-t border-border-subtle">
        <button
          onClick={toggleSidebar}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'flex items-center justify-center w-full rounded-md p-2',
            'text-text-tertiary hover:text-text-primary hover:bg-elevated',
            'transition-all duration-150 ease-out'
          )}
        >
          {collapsed ? (
            <ChevronRight size={16} strokeWidth={1.75} />
          ) : (
            <div className="flex items-center gap-2 w-full">
              <ChevronLeft size={16} strokeWidth={1.75} />
              <span className="text-xs text-text-tertiary">Collapse</span>
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  )
}
