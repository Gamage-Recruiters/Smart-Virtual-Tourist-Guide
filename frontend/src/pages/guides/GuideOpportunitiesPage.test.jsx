import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { guideService } from '../../services/guideService'
import GuideOpportunitiesPage from './GuideOpportunitiesPage'

const opportunity = {
  id: '507f1f77bcf86cd799439011',
  startLocation: 'Colombo',
  destination: 'Sigiriya',
  startDate: '2026-11-12T00:00:00.000Z',
  endDate: '2026-11-15T00:00:00.000Z',
  expiresAt: '2026-11-12T08:00:00.000Z',
  adults: 2,
  children: 1,
  languages: ['English'],
  specialities: ['Historical tours'],
  stops: ['Dambulla'],
  maxBudget: 30000,
  currency: 'LKR',
  description: 'Cultural Triangle trip',
  status: 'Open',
}

describe('GuideOpportunitiesPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.setSystemTime(new Date('2026-08-14T10:00:00Z'))
    vi.spyOn(guideService, 'getOwnGuideProfile').mockResolvedValue({ _id: 'profile-1', displayName: 'Test Guide', availability: 'Available' })
    vi.spyOn(guideService, 'listOpportunities').mockResolvedValue({ requests: [opportunity], pagination: { page: 1, totalItems: 1, totalPages: 1 } })
  })

  it('renders open requests with valid backend dates and submits a real bid payload', async () => {
    const submit = vi.spyOn(guideService, 'submitBid').mockResolvedValue({ bid: { id: 'bid-1' }, updatedExisting: false })
    const user = userEvent.setup()
    render(<MemoryRouter><GuideOpportunitiesPage /></MemoryRouter>)
    expect(await screen.findByRole('heading', { name: 'Colombo to Sigiriya' })).toBeInTheDocument()
    expect(screen.getByText('12 Nov 2026 – 15 Nov 2026')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Submit or update bid' }))
    await user.type(screen.getByLabelText('Bid amount'), '18500')
    await user.type(screen.getByLabelText('Proposed itinerary'), 'Colombo pickup and a guided Sigiriya visit.')
    await user.click(screen.getByRole('button', { name: 'Submit bid' }))
    await waitFor(() => expect(submit).toHaveBeenCalledWith(opportunity.id, expect.objectContaining({ amount: 18500, currency: 'LKR' })))
    expect(await screen.findByText('Your bid was submitted successfully.')).toBeInTheDocument()
  })

  it('shows a valid empty state when there are no open requests', async () => {
    vi.spyOn(guideService, 'listOpportunities').mockResolvedValue({ requests: [], pagination: { page: 1, totalItems: 0, totalPages: 0 } })
    render(<MemoryRouter><GuideOpportunitiesPage /></MemoryRouter>)
    expect(await screen.findByRole('heading', { name: 'No open requests' })).toBeInTheDocument()
  })
})
