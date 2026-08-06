import { demoGuideRequest, mockGuideBids, mockGuides } from '../data/guideMockData'

export const GUIDE_STORAGE_KEYS = {
  requests: 'svtg.guide.requests.v1',
  bookings: 'svtg.guide.bookings.v1',
  draft: 'svtg.guide.requestDraft.v1',
  latestRequest: 'svtg.guide.latestRequestId.v1',
}

const wait = (milliseconds = 180) => import.meta.env.MODE === 'test'
  ? Promise.resolve()
  : new Promise((resolve) => window.setTimeout(resolve, milliseconds))

const readJson = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch (error) {
    console.warn(`Ignoring corrupted guide data in ${key}.`, error)
    window.localStorage.removeItem(key)
    return fallback
  }
}

const writeJson = (key, value) => window.localStorage.setItem(key, JSON.stringify(value))

const getStoredRequests = () => {
  const requests = readJson(GUIDE_STORAGE_KEYS.requests, [])
  return Array.isArray(requests) ? requests : []
}

const getStoredBookings = () => {
  const bookings = readJson(GUIDE_STORAGE_KEYS.bookings, [])
  return Array.isArray(bookings) ? bookings : []
}

const randomId = (prefix) => {
  if (window.crypto?.randomUUID) return `${prefix}-${window.crypto.randomUUID()}`
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const bidsForRequest = (requestId) => mockGuideBids.map((bid) => ({ ...bid, requestId }))

export const guideService = {
  mode: 'mock',

  async saveDraft(draft) {
    writeJson(GUIDE_STORAGE_KEYS.draft, { ...draft, savedAt: new Date().toISOString() })
    return { saved: true }
  },

  getDraft() {
    const draft = readJson(GUIDE_STORAGE_KEYS.draft, null)
    return draft && typeof draft === 'object' && !Array.isArray(draft) ? draft : null
  },

  clearDraft() {
    window.localStorage.removeItem(GUIDE_STORAGE_KEYS.draft)
  },

  async createRequest(input) {
    await wait()
    const request = {
      ...input,
      id: randomId('guide-request'),
      userId: 'demo-tourist',
      status: 'Request Open',
      createdAt: new Date().toISOString(),
    }
    const requests = getStoredRequests()
    writeJson(GUIDE_STORAGE_KEYS.requests, [request, ...requests])
    window.localStorage.setItem(GUIDE_STORAGE_KEYS.latestRequest, request.id)
    this.clearDraft()
    return request
  },

  async getRequest(requestId) {
    await wait(120)
    const storedRequest = getStoredRequests().find((request) => request?.id === requestId)
    if (storedRequest) return storedRequest
    if (requestId === demoGuideRequest.id) return { ...demoGuideRequest }
    return null
  },

  async getMostRecentRequest() {
    await wait(80)
    const latestId = window.localStorage.getItem(GUIDE_STORAGE_KEYS.latestRequest)
    const stored = getStoredRequests()
    return stored.find((request) => request?.id === latestId) || stored[0] || { ...demoGuideRequest }
  },

  async getBids(requestId) {
    await wait()
    const request = await this.getRequest(requestId)
    if (!request) return []
    return bidsForRequest(requestId)
  },

  async getGuide(guideId) {
    await wait(120)
    const guide = mockGuides.find((item) => item.id === guideId)
    return guide ? { ...guide } : null
  },

  async getBid(requestId, bidId) {
    const bids = await this.getBids(requestId)
    return bids.find((bid) => bid.id === bidId) || null
  },

  async confirmBooking({ requestId, bidId, guideId }) {
    await wait(350)
    const bookings = getStoredBookings()
    const existing = bookings.find(
      (booking) => booking.requestId === requestId && booking.bidId === bidId,
    )
    if (existing) return { booking: existing, alreadyConfirmed: true }

    const [request, guide, bid] = await Promise.all([
      this.getRequest(requestId),
      this.getGuide(guideId),
      this.getBid(requestId, bidId),
    ])
    if (!request || !guide || !bid) throw new Error('Booking details could not be found.')
    if (guide.availability !== 'Available' || bid.status !== 'Available') {
      throw new Error('This guide is not available for booking.')
    }
    if (new Date(bid.expiresAt).getTime() <= Date.now()) throw new Error('This bid has expired.')

    const booking = {
      id: randomId('guide-booking'),
      bookingReference: `SVTG-${Date.now().toString(36).toUpperCase()}`,
      requestId,
      bidId,
      guideId,
      touristId: 'demo-tourist',
      tripDetails: request,
      amount: bid.amount,
      currency: bid.currency,
      paymentStatus: 'Payment integration pending',
      bookingStatus: 'Confirmed',
      createdAt: new Date().toISOString(),
    }
    writeJson(GUIDE_STORAGE_KEYS.bookings, [booking, ...bookings])
    const requests = getStoredRequests()
    const selectedRequest = {
      ...request,
      status: 'Guide Selected',
      selectedGuideId: guideId,
      selectedBidId: bidId,
    }
    writeJson(
      GUIDE_STORAGE_KEYS.requests,
      [selectedRequest, ...requests.filter((item) => item?.id !== requestId)],
    )
    return { booking, alreadyConfirmed: false }
  },

  async getBooking({ requestId, bidId }) {
    await wait(80)
    return getStoredBookings().find(
      (booking) => booking.requestId === requestId && booking.bidId === bidId,
    ) || null
  },
}
