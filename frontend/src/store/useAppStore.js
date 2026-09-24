import { create } from 'zustand'

/**
 * FraudShield AI — Global Application Store (Zustand)
 * Lightweight state: theme, sidebar, active investigation context.
 */
export const useAppStore = create((set, get) => ({
  // ─── UI State ────────────────────────────────────────────────────────
  /** Sidebar collapsed state */
  sidebarCollapsed: false,
  setSidebarCollapsed: (val) => set({ sidebarCollapsed: val }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  /** Dark mode (always true initially — dark is the default) */
  darkMode: true,
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

  // ─── Alert State ─────────────────────────────────────────────────────
  /** Number of unread alerts */
  unreadAlerts: 7,
  clearAlerts: () => set({ unreadAlerts: 0 }),

  // ─── Active Investigation Context ────────────────────────────────────
  /** Currently focused transaction ID (for cross-page context) */
  activeTransactionId: null,
  setActiveTransactionId: (id) => set({ activeTransactionId: id }),

  /** Currently focused case ID */
  activeCaseId: null,
  setActiveCaseId: (id) => set({ activeCaseId: id }),

  /** Currently focused campaign ID */
  activeCampaignId: null,
  setActiveCampaignId: (id) => set({ activeCampaignId: id }),

  // ─── Search State ────────────────────────────────────────────────────
  globalSearchQuery: '',
  setGlobalSearchQuery: (q) => set({ globalSearchQuery: q }),
  globalSearchOpen: false,
  setGlobalSearchOpen: (val) => set({ globalSearchOpen: val }),

  // ─── Live Feed Toggle ────────────────────────────────────────────────
  liveMode: true,
  toggleLiveMode: () => set((s) => ({ liveMode: !s.liveMode })),

  // ─── Filters (shared across Transactions/Cases/Alerts pages) ─────────
  filters: {
    riskLevel: 'all',    // 'all' | 'safe' | 'low' | 'medium' | 'high' | 'critical'
    dateRange: '24h',    // '1h' | '24h' | '7d' | '30d' | 'custom'
    status: 'all',
  },
  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),
  resetFilters: () =>
    set({ filters: { riskLevel: 'all', dateRange: '24h', status: 'all' } }),
}))
