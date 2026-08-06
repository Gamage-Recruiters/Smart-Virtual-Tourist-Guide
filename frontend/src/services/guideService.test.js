import { beforeEach, describe, expect, it, vi } from 'vitest'
import { demoGuideRequest } from '../data/guideMockData'
import { GUIDE_STORAGE_KEYS, guideService } from './guideService'

describe('guideService mock repository', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.setSystemTime(new Date('2026-08-06T10:00:00Z'))
  })

  it('saves and restores a draft and recovers from corrupted storage', async () => {
    await guideService.saveDraft({ destination: 'Sigiriya', specialities: [] })
    expect(guideService.getDraft().destination).toBe('Sigiriya')
    window.localStorage.setItem(GUIDE_STORAGE_KEYS.draft, '{broken')
    expect(guideService.getDraft()).toBeNull()
  })

  it('creates and restores a valid request after refresh', async () => {
    const created = await guideService.createRequest({ ...demoGuideRequest, id: undefined, destination: 'Kandy' })
    expect(created.id).toMatch(/^guide-request-/)
    await expect(guideService.getRequest(created.id)).resolves.toMatchObject({ destination: 'Kandy' })
    await expect(guideService.getMostRecentRequest()).resolves.toMatchObject({ id: created.id })
  })

  it('prevents a duplicate booking and preserves the booking record', async () => {
    const input = { requestId: demoGuideRequest.id, bidId: 'bid-rohan-perera', guideId: 'rohan-perera' }
    const first = await guideService.confirmBooking(input)
    const second = await guideService.confirmBooking(input)
    expect(first.alreadyConfirmed).toBe(false)
    expect(first.booking.bookingReference).toMatch(/^SVTG-/)
    expect(second.alreadyConfirmed).toBe(true)
    expect(second.booking.id).toBe(first.booking.id)
    await expect(guideService.getBooking(input)).resolves.toMatchObject({ id: first.booking.id })
    await expect(guideService.getRequest(demoGuideRequest.id)).resolves.toMatchObject({
      status: 'Guide Selected',
      selectedGuideId: 'rohan-perera',
      selectedBidId: 'bid-rohan-perera',
    })
  })
})
