import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ShieldAlert, LayoutDashboard, Activity, FileText, Share2, 
  Target, Globe, Shield, User, Settings as SettingsIcon, Menu, Bell, Search, Moon, Sun
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CommandPalette } from '../ui/CommandPalette'
import { ToastContainer } from '../ui/ToastContainer'
import { PageSkeleton } from './PageSkeleton'
import { useUIStore } from '../../lib/store'
import { cn } from '../../lib/cn'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Activity, label: 'Transactions', path: '/transactions' },
  { icon: FileText, label: 'Investigation Cases', path: '/cases' },
  { icon: Share2, label: 'Attack Chains', path: '/attack-chains' },
  { icon: Globe, label: 'Fraud Network', path: '/fraud-network' },
  { icon: Target, label: 'Fraud Campaigns', path: '/campaigns' },
  { icon: Activity, label: 'Risk Timeline', path: '/risk-timeline' },
  { icon: Shield, label: 'AI Investigations', path: '/investigations' },
  { icon: Activity, label: 'Analytics', path: '/analytics' },
  { icon: SettingsIcon, label: 'Settings', path: '/settings' },
]

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { setCommandPaletteOpen, darkMode, toggleDarkMode } = useUIStore()

  // Apply dark mode class to HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Route change mock loading
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timer)
  }, [location.pathname])

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) setSidebarOpen(false)
      else setSidebarOpen(true)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Keyboard shortcuts (g d, g c, g t)
  useEffect(() => {
    let lastKey = ''
    let timeout
    const handleKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      
      const key = e.key.toLowerCase()
      if (lastKey === 'g') {
        if (key === 'd') navigate('/')
        if (key === 'c') navigate('/cases')
        if (key === 't') navigate('/transactions')
        lastKey = ''
      } else {
        if (key === 'g') {
          lastKey = 'g'
          timeout = setTimeout(() => { lastKey = '' }, 1000)
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      clearTimeout(timeout)
    }
  }, [navigate])

  return (
    <div className="flex h-screen w-screen bg-canvas text-text-primary overflow-hidden font-sans">
      <CommandPalette />
      <ToastContainer />

      {/* ── Sidebar ── */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 64 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="h-full bg-surface border-r border-border-default flex flex-col shrink-0 overflow-hidden relative z-20"
      >
        <div className="h-14 flex items-center px-4 border-b border-border-default shrink-0">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-text-secondary hover:text-text-primary transition-colors focus:outline-none shrink-0"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
          
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="ml-3 flex items-center gap-2 whitespace-nowrap overflow-hidden"
              >
                <div className="w-6 h-6 bg-accent/10 rounded flex items-center justify-center border border-accent/20 shrink-0">
                  <ShieldAlert size={14} className="text-accent" />
                </div>
                <span className="font-display font-semibold tracking-tight text-sm">
                  FraudShield AI
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center h-9 px-2.5 rounded-md transition-all duration-150 group overflow-hidden",
                  isActive 
                    ? "bg-inset text-text-primary font-medium" 
                    : "text-text-tertiary hover:text-text-secondary hover:bg-inset/50"
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon 
                  size={16} 
                  strokeWidth={isActive ? 2 : 1.75} 
                  className={cn("shrink-0", isActive ? "text-accent" : "group-hover:text-text-secondary")} 
                />
                
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="ml-3 text-sm whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            )
          })}
        </nav>
      </motion.aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-canvas relative z-10">
        <header className="h-14 bg-surface border-b border-border-default flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center">
            {/* Contextual top-left area */}
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-inset border border-border-strong text-text-tertiary hover:text-text-secondary transition-colors text-xs font-mono"
            >
              <Search size={12} />
              <span>Search...</span>
              <span className="ml-4 border border-border-strong rounded px-1 text-[10px]">⌘K</span>
            </button>
            <div className="w-px h-5 bg-border-strong" />
            <button 
              onClick={toggleDarkMode}
              className="text-text-tertiary hover:text-text-primary transition-colors"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
            </button>
            <button className="text-text-tertiary hover:text-text-primary transition-colors">
              <Bell size={16} strokeWidth={1.5} />
            </button>
            <button className="w-7 h-7 rounded-full bg-accent/20 border border-accent flex items-center justify-center text-xs font-medium text-accent ml-2">
              A
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0"
              >
                <PageSkeleton />
              </motion.div>
            ) : (
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                className="h-full overflow-y-auto overflow-x-hidden"
              >
                <Outlet />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
