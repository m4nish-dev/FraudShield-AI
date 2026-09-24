import { createContext, useContext, useState, useId } from 'react'
import { cn } from '../../lib/cn'

const TabsContext = createContext(null)

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs sub-components must be used within <Tabs>')
  return ctx
}

/**
 * Tabs — underline-style tab navigation.
 *
 * Usage:
 *   <Tabs defaultValue="overview">
 *     <TabList>
 *       <Tab value="overview">Overview</Tab>
 *       <Tab value="evidence">Evidence</Tab>
 *     </TabList>
 *     <TabPanel value="overview">...</TabPanel>
 *     <TabPanel value="evidence">...</TabPanel>
 *   </Tabs>
 */
export function Tabs({ defaultValue, value: controlledValue, onChange, children, className }) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')

  const active = controlledValue ?? internalValue
  const setActive = (v) => {
    setInternalValue(v)
    onChange?.(v)
  }

  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={cn('flex flex-col', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabList({ className, children }) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-end gap-0 border-b border-border-subtle',
        'overflow-x-auto scrollbar-none',
        className
      )}
    >
      {children}
    </div>
  )
}

export function Tab({ value, disabled = false, children, className }) {
  const { active, setActive } = useTabs()
  const isActive = active === value

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      disabled={disabled}
      onClick={() => !disabled && setActive(value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (!disabled) setActive(value)
        }
      }}
      className={cn(
        'relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium',
        'transition-colors duration-150 ease-out select-none whitespace-nowrap',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-inset',
        'border-b-2 -mb-px', // offset to sit on the TabList border
        isActive
          ? 'text-text-primary border-accent'
          : 'text-text-secondary border-transparent hover:text-text-primary hover:border-border-strong',
        disabled && 'opacity-40 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabPanel({ value, children, className }) {
  const { active } = useTabs()

  if (active !== value) return null

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={cn('flex-1', className)}
    >
      {children}
    </div>
  )
}

Tabs.displayName = 'Tabs'
TabList.displayName = 'TabList'
Tab.displayName = 'Tab'
TabPanel.displayName = 'TabPanel'

export default Tabs
