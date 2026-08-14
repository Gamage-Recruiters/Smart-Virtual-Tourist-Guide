import { describe, expect, it } from 'vitest'
import { formatDate, formatDateRange } from './guideFormatters'

describe('guide date formatting', () => {
  it('formats MongoDB ISO timestamps without creating an invalid date', () => {
    expect(formatDate('2026-11-12T00:00:00.000Z')).toBe('12 Nov 2026')
    expect(formatDateRange('2026-11-12T00:00:00.000Z', '2026-11-15T00:00:00.000Z')).toBe('12 Nov 2026 – 15 Nov 2026')
  })

  it('continues to support date-only form values and safe missing values', () => {
    expect(formatDate('2026-11-12')).toBe('12 Nov 2026')
    expect(formatDateRange('', '')).toBe('Dates to be confirmed')
    expect(formatDate('not-a-date')).toBe('Date unavailable')
  })
})
