import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Command, Search, Clock, FileText, ArrowRight } from 'lucide-react'
import { useUIStore } from '../../lib/store'
import { cn } from '../../lib/cn'

const NAV_LINKS = [
  { label: 'Dashboard', path: '/' },
  { label: 'Transactions', path: '/transactions' },
  { label: 'Investigation Cases', path: '/cases' },
  { label: 'Attack Chains', path: '/attack-chains' },
  { label: 'Fraud Network', path: '/fraud-network' },
  { label: 'Fraud Campaigns', path: '/campaigns' },
  { label: 'Risk Timeline', path: '/risk-timeline' },
  { label: 'AI Investigations', path: '/investigations' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Settings', path: '/settings' },
]

export function CommandPalette() {
  const navigate = useNavigate()
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUIStore()
  const [search, setSearch] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(!isCommandPaletteOpen)
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCommandPaletteOpen, setCommandPaletteOpen])

  if (!isCommandPaletteOpen) return null

  const filteredLinks = NAV_LINKS.filter(l => l.label.toLowerCase().includes(search.toLowerCase()))

  const handleSelect = (path) => {
    navigate(path)
    setCommandPaletteOpen(false)
    setSearch('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setCommandPaletteOpen(false)}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-xl bg-elevated border border-border-default rounded-xl shadow-elevated overflow-hidden flex flex-col"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
          <Command size={16} className="text-text-tertiary shrink-0" />
          <input 
            autoFocus
            type="text"
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none outline-none text-text-primary font-mono text-sm placeholder:text-text-disabled"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border-strong bg-inset text-[10px] font-mono text-text-tertiary">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 flex flex-col gap-1">
          {search && filteredLinks.length === 0 && (
            <div className="p-4 text-center text-sm text-text-tertiary">No results found.</div>
          )}
          
          {filteredLinks.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="px-2 py-1.5 text-xs font-medium text-text-tertiary uppercase tracking-wider">Pages</span>
              {filteredLinks.map((link, idx) => (
                <button
                  key={link.path}
                  onClick={() => handleSelect(link.path)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-inset text-left group transition-colors focus:bg-inset focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={14} className="text-text-tertiary group-hover:text-text-primary" />
                    <span className="text-sm text-text-secondary group-hover:text-text-primary">{link.label}</span>
                  </div>
                  <ArrowRight size={14} className="text-text-disabled opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
