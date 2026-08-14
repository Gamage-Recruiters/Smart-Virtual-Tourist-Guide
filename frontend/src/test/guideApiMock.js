import { vi } from 'vitest'
import { demoGuideRequest, mockGuideBids, mockGuides } from '../data/guideMockData'

const jsonResponse = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: status === 404 ? 'Not Found' : 'OK',
  text: async () => JSON.stringify(body),
})

export const installGuideApiMock = () => {
  let booking = null
  const fetchMock = vi.fn(async (input, options = {}) => {
    const url = new URL(String(input), 'http://localhost')
    const path = url.pathname.replace(/^\/api/, '')
    const method = options.method || 'GET'

    if (method === 'POST' && path === '/guides/requests') {
      const body = JSON.parse(options.body)
      return jsonResponse({ success: true, data: { request: { ...body, id: '507f1f77bcf86cd799439011', status: 'Open' } } }, 201)
    }
    if (method === 'GET' && path === '/guides/requests') {
      return jsonResponse({ success: true, data: { requests: [demoGuideRequest], pagination: { page: 1, totalItems: 1, totalPages: 1 } } })
    }
    if (method === 'GET' && path === '/guides/opportunities') {
      return jsonResponse({ success: true, data: { requests: [demoGuideRequest], pagination: { page: 1, limit: 6, totalItems: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false } } })
    }
    if (method === 'GET' && path === '/guides/me/profile') {
      return jsonResponse({ success: true, data: { profile: { _id: 'profile-1', displayName: 'Test Guide', availability: 'Available' } } })
    }
    const bidsMatch = path.match(/^\/guides\/requests\/([^/]+)\/bids$/)
    if (method === 'POST' && bidsMatch) {
      const body = JSON.parse(options.body)
      return jsonResponse({ success: true, data: { bid: { ...body, id: 'bid-created', requestId: bidsMatch[1] }, updatedExisting: false } }, 201)
    }
    if (method === 'GET' && bidsMatch) {
      if (bidsMatch[1] !== demoGuideRequest.id) return jsonResponse({ success: false, message: 'Guide request not found.' }, 404)
      let bids = mockGuideBids.map((bid) => ({ ...bid, status: 'Active', guide: mockGuides.find((guide) => guide.id === bid.guideId) }))
      const search = url.searchParams.get('search')?.toLowerCase()
      if (search) bids = bids.filter((bid) => bid.guide.name.toLowerCase().includes(search))
      const sort = url.searchParams.get('sort')
      if (sort === 'price_asc') bids.sort((a, b) => a.amount - b.amount)
      if (sort === 'price_desc') bids.sort((a, b) => b.amount - a.amount)
      const page = Number(url.searchParams.get('page') || 1)
      const limit = Number(url.searchParams.get('limit') || 4)
      const totalItems = bids.length
      return jsonResponse({ success: true, data: {
        request: demoGuideRequest,
        bids: bids.slice((page - 1) * limit, page * limit),
        pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit), hasNextPage: page * limit < totalItems, hasPreviousPage: page > 1 },
      } })
    }
    const bidMatch = path.match(/^\/guides\/requests\/([^/]+)\/bids\/([^/]+)$/)
    if (method === 'GET' && bidMatch) {
      const bid = mockGuideBids.find((item) => item.id === bidMatch[2])
      return bid ? jsonResponse({ success: true, data: { bid: { ...bid, status: 'Active' } } }) : jsonResponse({ success: false, message: 'Guide bid not found.' }, 404)
    }
    const confirmationMatch = path.match(/^\/guides\/requests\/([^/]+)\/bids\/([^/]+)\/confirmation$/)
    if (method === 'GET' && confirmationMatch) {
      const bid = mockGuideBids.find((item) => item.id === confirmationMatch[2])
      const guide = bid && mockGuides.find((item) => item.id === bid.guideId)
      if (!bid || !guide) return jsonResponse({ success: false, message: 'Guide bid not found.' }, 404)
      const expired = new Date(bid.expiresAt).getTime() <= Date.now()
      return jsonResponse({ success: true, data: {
        request: demoGuideRequest, bid: { ...bid, status: 'Active' }, guide,
        booking, canConfirm: !expired && !booking, blockingReason: expired ? 'This bid has expired.' : booking ? 'This request is already booked.' : null,
        availability: { available: !expired && !booking }, priceSummary: { total: bid.amount, currency: bid.currency },
      } })
    }
    const guideMatch = path.match(/^\/guides\/([^/]+)$/)
    if (method === 'GET' && guideMatch) {
      const guide = mockGuides.find((item) => item.id === guideMatch[1])
      if (!guide) return jsonResponse({ success: false, message: 'Guide profile not found.' }, 404)
      const bid = url.searchParams.get('bidId') ? mockGuideBids.find((item) => item.id === url.searchParams.get('bidId')) : undefined
      return jsonResponse({ success: true, data: { guide, ...(bid && { bid: { ...bid, status: 'Active' } }) } })
    }
    if (method === 'POST' && path === '/guides/bookings') {
      const body = JSON.parse(options.body)
      const bid = mockGuideBids.find((item) => item.id === body.bidId)
      if (!booking) booking = {
        id: '507f1f77bcf86cd799439099', bookingReference: 'GUIDE-2026-ABCDEF1234', requestId: body.requestId,
        bidId: body.bidId, guideId: bid.guideId, tripDetails: demoGuideRequest, amount: bid.amount,
        currency: bid.currency, paymentStatus: 'Pending', bookingStatus: 'Confirmed',
      }
      return jsonResponse({ success: true, data: { booking, alreadyConfirmed: false } }, 201)
    }
    return jsonResponse({ success: false, message: `Unhandled test request: ${method} ${path}` }, 404)
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}
