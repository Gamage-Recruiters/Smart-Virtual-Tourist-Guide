import { ApiError, apiRequest, AUTH_STORAGE_KEY } from './api'

export const GUIDE_STORAGE_KEYS = {
  draft: 'svtg.guide.requestDraft.v1',
}

const readDraft = () => {
  try {
    const raw = window.localStorage.getItem(GUIDE_STORAGE_KEYS.draft)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null
  } catch {
    window.localStorage.removeItem(GUIDE_STORAGE_KEYS.draft)
    return null
  }
}

const hasAuthToken = () => {
  const token = window.localStorage.getItem(AUTH_STORAGE_KEY)
  return Boolean(token && token !== 'null' && token !== 'undefined')
}

const queryString = (values = {}) => {
  const params = new URLSearchParams()
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value))
  })
  const query = params.toString()
  return query ? `?${query}` : ''
}

const nullOnNotFound = async (operation) => {
  try {
    return await operation()
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

export const guideService = {
  mode: 'api',

  async saveDraft(draft) {
    window.localStorage.setItem(GUIDE_STORAGE_KEYS.draft, JSON.stringify({ ...draft, savedAt: new Date().toISOString() }))
    return { saved: true }
  },

  getDraft: readDraft,

  clearDraft() {
    window.localStorage.removeItem(GUIDE_STORAGE_KEYS.draft)
  },

  async createRequest(input) {
    const { request } = await apiRequest('/guides/requests', { method: 'POST', body: input })
    this.clearDraft()
    return request
  },

  getRequest(requestId) {
    return nullOnNotFound(async () => (await apiRequest(`/guides/requests/${encodeURIComponent(requestId)}`)).request)
  },

  listGuides(params = {}) {
    return apiRequest(`/guides${queryString(params)}`)
  },

  listOpportunities(params = {}) {
    return apiRequest(`/guides/opportunities${queryString(params)}`)
  },

  getOwnGuideProfile() {
    return nullOnNotFound(async () => (await apiRequest('/guides/me/profile')).profile)
  },

  async createGuideProfile(input) {
    return (await apiRequest('/guides/me/profile', { method: 'POST', body: input })).profile
  },

  submitBid(requestId, input) {
    return apiRequest(`/guides/requests/${encodeURIComponent(requestId)}/bids`, { method: 'POST', body: input })
  },

  async getMostRecentRequest() {
    if (!hasAuthToken()) {
      throw new ApiError('Please sign in to view your guide requests.', 401, 'UNAUTHENTICATED')
    }

    const result = await apiRequest('/guides/requests?page=1&limit=1&sort=newest')
    return result.requests[0] || null
  },

  getBids(requestId, params = {}) {
    return apiRequest(`/guides/requests/${encodeURIComponent(requestId)}/bids${queryString(params)}`)
  },

  getBid(requestId, bidId) {
    return nullOnNotFound(async () => (await apiRequest(`/guides/requests/${encodeURIComponent(requestId)}/bids/${encodeURIComponent(bidId)}`)).bid)
  },

  getGuide(guideId, context = {}) {
    return nullOnNotFound(async () => apiRequest(`/guides/${encodeURIComponent(guideId)}${queryString(context)}`))
  },

  getBookingConfirmation(requestId, bidId) {
    return apiRequest(`/guides/requests/${encodeURIComponent(requestId)}/bids/${encodeURIComponent(bidId)}/confirmation`)
  },

  confirmBooking({ requestId, bidId, acknowledgements }) {
    return apiRequest('/guides/bookings', {
      method: 'POST',
      body: { requestId, bidId, acknowledgements },
    })
  },

  async getBookingById(bookingId) {
    return (await apiRequest(`/guides/bookings/${encodeURIComponent(bookingId)}`)).booking
  },

  async getBookingByReference(bookingReference) {
    return (await apiRequest(`/guides/bookings/reference/${encodeURIComponent(bookingReference)}`)).booking
  },
}
