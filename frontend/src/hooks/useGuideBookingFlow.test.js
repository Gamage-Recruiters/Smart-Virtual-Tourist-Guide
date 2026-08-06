import { describe, expect, it } from 'vitest'
import { mockGuideBids, mockGuides } from '../data/guideMockData'
import { defaultGuideFilters } from '../utils/guideFilters'
import { filterAndSortBids, GUIDE_BIDS_PER_PAGE } from './useGuideBookingFlow'

const items = mockGuideBids.map((bid) => ({ bid, guide: mockGuides.find((guide) => guide.id === bid.guideId) }))

describe('guide bid filtering and sorting', () => {
  it('keeps the four screenshot guides on the first recommended page', () => {
    const results = filterAndSortBids(items, defaultGuideFilters, 'recommended').slice(0, GUIDE_BIDS_PER_PAGE)
    expect(results.map(({ guide }) => guide.name)).toEqual(['Rohan Perera', 'Maliki Perera', 'Ajith Perera', 'John Perera'])
  })

  it('filters by search, price and language', () => {
    expect(filterAndSortBids(items, { ...defaultGuideFilters, search: 'Rohan' }, 'recommended')).toHaveLength(1)
    expect(filterAndSortBids(items, { ...defaultGuideFilters, minPrice: '20000', maxPrice: '26000' }, 'recommended').every(({ bid }) => bid.amount >= 20000 && bid.amount <= 26000)).toBe(true)
    expect(filterAndSortBids(items, { ...defaultGuideFilters, language: 'French' }, 'recommended').map(({ guide }) => guide.name)).toEqual(['Maliki Perera'])
  })

  it('sorts by price, rating, experience and newest bid', () => {
    expect(filterAndSortBids(items, defaultGuideFilters, 'lowest')[0].bid.amount).toBe(15000)
    expect(filterAndSortBids(items, defaultGuideFilters, 'highest')[0].bid.amount).toBe(45000)
    expect(filterAndSortBids(items, defaultGuideFilters, 'rating')[0].guide.rating).toBe(5)
    expect(filterAndSortBids(items, defaultGuideFilters, 'experience')[0].guide.experienceYears).toBe(12)
    expect(filterAndSortBids(items, defaultGuideFilters, 'newest')[0].guide.name).toBe('Shan Peris')
  })
})
