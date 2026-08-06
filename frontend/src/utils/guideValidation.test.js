import { beforeEach, describe, expect, it, vi } from 'vitest'
import { initialGuideRequest, validateGuideRequest } from './guideValidation'

const validRequest = {
  ...initialGuideRequest,
  startLocation: 'Colombo',
  destination: 'Sigiriya',
  startDate: '2026-11-12',
  endDate: '2026-11-15',
  adults: '2',
  children: '0',
  maxBudget: '30000',
}

describe('validateGuideRequest', () => {
  beforeEach(() => vi.setSystemTime(new Date('2026-08-06T10:00:00Z')))

  it('reports all required fields', () => {
    const errors = validateGuideRequest(initialGuideRequest)
    expect(errors.startLocation).toMatch(/required/i)
    expect(errors.destination).toMatch(/required/i)
    expect(errors.startDate).toMatch(/required/i)
    expect(errors.endDate).toMatch(/required/i)
    expect(errors.maxBudget).toMatch(/greater than zero/i)
  })

  it('rejects past dates and an invalid date order', () => {
    expect(validateGuideRequest({ ...validRequest, startDate: '2026-08-05' }).startDate).toMatch(/past/i)
    expect(validateGuideRequest({ ...validRequest, endDate: '2026-11-11' }).endDate).toMatch(/before/i)
  })

  it('rejects invalid budgets', () => {
    expect(validateGuideRequest({ ...validRequest, maxBudget: '0' }).maxBudget).toBeTruthy()
    expect(validateGuideRequest({ ...validRequest, minBudget: '40000' }).minBudget).toMatch(/cannot exceed/i)
  })

  it('accepts a valid request', () => {
    expect(validateGuideRequest(validRequest)).toEqual({})
  })
})
