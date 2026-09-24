/**
 * Formatting utilities for FraudShield AI.
 * All monetary values are in Indian Rupees (INR).
 */

/**
 * Format a number as Indian Rupees with ₹ symbol and Indian comma grouping.
 * e.g. 1234567.89 → "₹12,34,567.89"
 * @param {number} amount
 * @param {number} [decimals=2]
 * @returns {string}
 */
export function formatINR(amount, decimals = 2) {
  if (amount === null || amount === undefined || isNaN(amount)) return '—'
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
  return formatted
}

/**
 * Format large numbers in compact human-readable form.
 * e.g. 12400 → "12.4K" | 1200000 → "1.2M" | 980 → "980"
 * @param {number} n
 * @returns {string}
 */
export function formatCompact(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (Math.abs(n) >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000)         return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

/**
 * Format an ISO timestamp as HH:MM:SS.
 * e.g. "2026-09-24T14:32:08Z" → "14:32:08"
 * @param {string} iso
 * @returns {string}
 */
export function formatTime(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  } catch {
    return '—'
  }
}

/**
 * Format an ISO timestamp as "24 Sep 2026".
 * @param {string} iso
 * @returns {string}
 */
export function formatDate(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

/**
 * Format an ISO timestamp as "24 Sep 2026 · 14:32:08 IST".
 * @param {string} iso
 * @returns {string}
 */
export function formatDateTime(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    return `${date} · ${time} UTC`
  } catch {
    return '—'
  }
}


/**
 * Format an ISO timestamp as a relative time string.
 * e.g. "2m ago" | "1h ago" | "3d ago" | "just now"
 * @param {string} iso
 * @returns {string}
 */
export function formatRelative(iso) {
  if (!iso) return '—'
  try {
    const now  = Date.now()
    const then = new Date(iso).getTime()
    const diff = Math.floor((now - then) / 1000) // seconds

    if (diff < 10)    return 'just now'
    if (diff < 60)    return `${diff}s ago`
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return formatDate(iso)
  } catch {
    return '—'
  }
}

/**
 * Truncate a long ID for display, keeping prefix and suffix.
 * e.g. "TXN-10a9f3b2c1d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f92c"
 *      → "TXN-10a…f92c"
 * @param {string} id
 * @param {number} [prefixLen=7]  chars to keep at start
 * @param {number} [suffixLen=4]  chars to keep at end
 * @returns {string}
 */
export function truncateId(id, prefixLen = 7, suffixLen = 4) {
  if (!id) return '—'
  if (id.length <= prefixLen + suffixLen + 1) return id
  return `${id.slice(0, prefixLen)}…${id.slice(-suffixLen)}`
}

/**
 * Format a decimal (0–1) or integer (0–100) as a percentage string.
 * @param {number} value  0–1 or 0–100
 * @param {boolean} [isDecimal=false] set true if value is 0–1
 * @returns {string}
 */
export function formatPercent(value, isDecimal = false) {
  if (value === null || value === undefined || isNaN(value)) return '—'
  const pct = isDecimal ? value * 100 : value
  return `${pct.toFixed(1)}%`
}

/**
 * Format a risk score (0–100) to 1 decimal place.
 * @param {number} score
 * @returns {string}
 */
export function formatRiskScore(score) {
  if (score === null || score === undefined || isNaN(score)) return '—'
  return score.toFixed(1)
}
