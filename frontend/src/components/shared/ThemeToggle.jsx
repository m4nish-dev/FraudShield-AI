import { Sun, Moon } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { cn } from '../../lib/cn'

/**
 * ThemeToggle — icon button that flips between dark and light mode.
 * Toggles `dark` class on <html> root via Zustand.
 */
export function ThemeToggle({ className }) {
  const darkMode       = useAppStore((s) => s.darkMode)
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode)

  return (
    <button
      onClick={toggleDarkMode}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'flex items-center justify-center h-8 w-8 rounded-md',
        'text-text-tertiary hover:text-text-primary hover:bg-elevated',
        'transition-all duration-150 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
        className
      )}
    >
      {darkMode
        ? <Sun  size={16} strokeWidth={1.75} aria-hidden="true" />
        : <Moon size={16} strokeWidth={1.75} aria-hidden="true" />
      }
    </button>
  )
}

ThemeToggle.displayName = 'ThemeToggle'
export default ThemeToggle
