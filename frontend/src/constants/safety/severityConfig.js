/**
 * Unified severity/risk configuration for the Safety & Emergency module.
 * Single source of truth for the 4-tier risk system used across:
 *  - AlertCard, AlertMap, SecurityAlertsPage, WeatherAlertsPage
 */

// Canonical severity levels (lowercase, matches backend enum)
export const SEVERITY_LEVELS = ['critical', 'high', 'medium', 'low'];

// Hex colors for map markers & legend dots
export const SEVERITY_COLORS = {
  critical: '#E53935',
  high:     '#F97316',
  medium:   '#EAB308',
  low:      '#22C55E',
};

// Legend items array (used by MapLegend component)
export const SEVERITY_LEGEND_ITEMS = [
  { color: '#E53935', label: 'Critical' },
  { color: '#F97316', label: 'High' },
  { color: '#EAB308', label: 'Medium' },
  { color: '#22C55E', label: 'Low' },
];

// Tailwind card styles for AlertCard (keyed lowercase to match backend severity enum)
export const SEVERITY_CARD_STYLES = {
  critical: {
    border: 'border-[#B91C1C]',
    bg:     'bg-[#FEF2F2]',
    text:   'text-[#B91C1C]',
    iconBg: 'bg-[#E53935]',
  },
  high: {
    border: 'border-[#EA580C]',
    bg:     'bg-[#FFF7ED]',
    text:   'text-[#EA580C]',
    iconBg: 'bg-[#F97316]',
  },
  medium: {
    border: 'border-[#CA8A04]',
    bg:     'bg-[#FEFCE8]',
    text:   'text-[#CA8A04]',
    iconBg: 'bg-[#EAB308]',
  },
  low: {
    border: 'border-[#16A34A]',
    bg:     'bg-[#F0FDF4]',
    text:   'text-[#16A34A]',
    iconBg: 'bg-[#22C55E]',
  },
};

// Tailwind badge styles for status pills (keyed capitalized to match WeatherAlertsPage status strings)
export const STATUS_BADGE_STYLES = {
  Critical: 'bg-red-100 text-red-800',
  High:     'bg-orange-100 text-orange-800',
  Medium:   'bg-yellow-100 text-yellow-800',
  Low:      'bg-green-100 text-green-800',
};

// Full risk panel styles for travel recommendations (keyed capitalized)
export const RISK_STYLES = {
  Critical: {
    bg:     'bg-red-50 border-red-200 text-red-900',
    badge:  'bg-red-100 text-red-800 border-red-200',
    icon:   '🔴',
    advice: 'Immediate, severe danger to safety. Halt outdoor movements and seek safe shelter instantly. Avoid mountain passes and coastal zones.',
  },
  High: {
    bg:     'bg-orange-50 border-orange-200 text-orange-900',
    badge:  'bg-orange-100 text-orange-800 border-orange-200',
    icon:   '🟠',
    advice: 'Severe weather detected. High risk of dehydration or low visibility. Consider delaying travel and avoid waterfall trails.',
  },
  Medium: {
    bg:     'bg-yellow-50 border-yellow-200 text-yellow-900',
    badge:  'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon:   '🟡',
    advice: 'Passing showers or elevated heat. Proceed with your itinerary but carry an umbrella and stay hydrated.',
  },
  Low: {
    bg:     'bg-green-50 border-green-200 text-green-900',
    badge:  'bg-green-100 text-green-800 border-green-200',
    icon:   '🟢',
    advice: 'Favourable weather conditions. Great time for sightseeing, hiking, and outdoor activities. Standard precautions apply.',
  },
};
