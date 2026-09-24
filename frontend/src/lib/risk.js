/**
 * Risk score utilities for FraudShield AI.
 * Score range: 0–100 (float).
 */

/** Risk levels mapped to score ranges */
export const RISK_LEVELS = {
  safe:     { min: 0,  max: 20  },
  low:      { min: 20, max: 40  },
  medium:   { min: 40, max: 60  },
  high:     { min: 60, max: 80  },
  critical: { min: 80, max: 100 },
}

/**
 * Returns the risk level string for a given score.
 * @param {number} score - 0 to 100
 * @returns {'safe' | 'low' | 'medium' | 'high' | 'critical'}
 */
export function getRiskLevel(score) {
  if (score < 20)  return 'safe'
  if (score < 40)  return 'low'
  if (score < 60)  return 'medium'
  if (score < 80)  return 'high'
  return 'critical'
}

/**
 * Returns the hex color for a given score from the risk palette.
 * @param {number} score - 0 to 100
 * @returns {string} hex color
 */
export function getRiskColor(score) {
  const level = getRiskLevel(score)
  const colors = {
    safe:     '#22D3EE',
    low:      '#4ADE80',
    medium:   '#FACC15',
    high:     '#FB923C',
    critical: '#F43F5E',
  }
  return colors[level]
}

/**
 * Returns the background color (10% opacity) for a risk score.
 * @param {number} score
 * @returns {string}
 */
export function getRiskBgColor(score) {
  const level = getRiskLevel(score)
  const colors = {
    safe:     'rgba(34,211,238,0.10)',
    low:      'rgba(74,222,128,0.10)',
    medium:   'rgba(250,204,21,0.10)',
    high:     'rgba(251,146,60,0.10)',
    critical: 'rgba(244,63,94,0.10)',
  }
  return colors[level]
}

/**
 * Returns the border color (25% opacity) for a risk score.
 * @param {number} score
 * @returns {string}
 */
export function getRiskBorderColor(score) {
  const level = getRiskLevel(score)
  const colors = {
    safe:     'rgba(34,211,238,0.25)',
    low:      'rgba(74,222,128,0.25)',
    medium:   'rgba(250,204,21,0.25)',
    high:     'rgba(251,146,60,0.25)',
    critical: 'rgba(244,63,94,0.25)',
  }
  return colors[level]
}

/**
 * Returns the display label for a risk score.
 * @param {number} score
 * @returns {'Safe' | 'Low' | 'Medium' | 'High' | 'Critical'}
 */
export function getRiskLabel(score) {
  const labels = {
    safe:     'Safe',
    low:      'Low',
    medium:   'Medium',
    high:     'High',
    critical: 'Critical',
  }
  return labels[getRiskLevel(score)]
}

/**
 * Returns Tailwind CSS class strings for a risk level.
 * Useful for badge styling.
 */
export function getRiskClasses(score) {
  const level = getRiskLevel(score)
  const map = {
    safe: {
      text:   'text-risk-safe',
      bg:     'bg-risk-safe-bg',
      border: 'border-risk-safe-border',
    },
    low: {
      text:   'text-risk-low',
      bg:     'bg-risk-low-bg',
      border: 'border-risk-low-border',
    },
    medium: {
      text:   'text-risk-medium',
      bg:     'bg-risk-medium-bg',
      border: 'border-risk-medium-border',
    },
    high: {
      text:   'text-risk-high',
      bg:     'bg-risk-high-bg',
      border: 'border-risk-high-border',
    },
    critical: {
      text:   'text-risk-critical',
      bg:     'bg-risk-critical-bg',
      border: 'border-risk-critical-border',
    },
  }
  return map[level]
}
