import { beforeEach, describe, expect, it } from 'vitest'
import { installGuideApiMock } from '../test/guideApiMock'
import { demoGuideRequest } from '../data/guideMockData'
import { GUIDE_STORAGE_KEYS, guideService } from './guideService'

describe('guideService API repository', () => {
  let fetchMock
  beforeEach(() => {
    window.localStorage.clear()
    fetchMock = installGuideApiMock()
  })

  it('saves and restores a device-only form draft', async () => {
    await guideService.saveDraft({ destination: 'Sigiriya', specialities: [] })
    expect(guideService.getDraft().destination).toBe('Sigiriya')
    window.localStorage.setItem(GUIDE_STORAGE_KEYS.draft, '{broken')
    expect(guideService.getDraft()).toBeNull()
  })

  it('creates a request through the backend and clears the draft', async () => {
    window.localStorage.setItem('token', 'stable-login-token')
    await guideService.saveDraft({ destination: 'Draft' })
    const created = await guideService.createRequest({ ...demoGuideRequest, id: undefined })
    expect(created.id).toBe('507f1f77bcf86cd799439011')
    expect(guideService.getDraft()).toBeNull()
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/api/guides/requests'), expect.objectContaining({ method: 'POST' }))
    expect(fetchMock.mock.calls[0][1].headers.get('Authorization')).toBe('Bearer stable-login-token')
  })

  it('does not request the latest guide request without a valid auth token', async () => {
    await expect(guideService.getMostRecentRequest()).rejects.toMatchObject({ status: 401 })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('sends filters to the bids endpoint and confirms with identifiers and acknowledgements only', async () => {
    await guideService.getBids(demoGuideRequest.id, { search: 'Rohan', sort: 'price_asc', page: 1, limit: 4 })
    await guideService.confirmBooking({
      requestId: demoGuideRequest.id,
      bidId: 'bid-rohan-perera',
      acknowledgements: { tripDetailsConfirmed: true, cancellationPolicyAccepted: true, termsAccepted: true },
    })
    expect(fetchMock.mock.calls[0][0]).toContain('search=Rohan')
    const bookingBody = JSON.parse(fetchMock.mock.calls[1][1].body)
    expect(Object.keys(bookingBody).sort()).toEqual(['acknowledgements', 'bidId', 'requestId'])
  })

  it('loads Guide opportunities and submits a bid without a client guide ID', async () => {
    await guideService.listOpportunities({ destination: 'Sigiriya', page: 1, limit: 6 })
    await guideService.submitBid(demoGuideRequest.id, {
      amount: 18500,
      currency: 'LKR',
      proposedItinerary: 'Test itinerary',
      includedServices: ['Guide service'],
      excludedServices: [],
      cancellationPolicy: 'Test policy',
      expiresAt: '2027-11-11T12:00:00.000Z',
    })
    expect(fetchMock.mock.calls[0][0]).toContain('/api/guides/opportunities?destination=Sigiriya&page=1&limit=6')
    expect(fetchMock.mock.calls[1][0]).toContain(`/api/guides/requests/${demoGuideRequest.id}/bids`)
    const bidBody = JSON.parse(fetchMock.mock.calls[1][1].body)
    expect(bidBody.guideId).toBeUndefined()
  })
})
