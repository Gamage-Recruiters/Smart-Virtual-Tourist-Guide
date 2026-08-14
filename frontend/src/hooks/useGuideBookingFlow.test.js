import { describe, expect, it } from 'vitest'
import { defaultGuideFilters } from '../utils/guideFilters'
import { buildBidQuery, GUIDE_BIDS_PER_PAGE } from './useGuideBookingFlow'

describe('guide bid server query mapping', () => {
  it('maps filters, sorting and pagination to backend parameters', () => {
    expect(buildBidQuery({
      ...defaultGuideFilters,
      search: ' Rohan ',
      minPrice: '10000',
      maxPrice: '30000',
      rating: '4.5',
      language: 'English',
      experience: '5',
      speciality: 'Photography',
      availability: 'Available',
      verifiedOnly: true,
    }, 'lowest', 2)).toEqual({
      search: 'Rohan', minPrice: '10000', maxPrice: '30000', minRating: '4.5', language: 'English',
      minExperience: '5', speciality: 'Photography', availability: 'Available', verified: true,
      sort: 'price_asc', page: 2, limit: GUIDE_BIDS_PER_PAGE,
    })
  })
})
