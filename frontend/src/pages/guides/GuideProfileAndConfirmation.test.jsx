import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { installGuideApiMock } from '../../test/guideApiMock'
import GuideBookingConfirmationPage from './GuideBookingConfirmationPage'
import GuideProfilePage from './GuideProfilePage'

function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}{location.search}</div>
}

describe('guide profile and confirmation routes', () => {
  beforeEach(() => {
    window.localStorage.clear()
    installGuideApiMock()
    vi.setSystemTime(new Date('2026-08-06T10:00:00Z'))
  })

  it('renders the correct profile, reviews, and preserves IDs when selecting', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/guides/rohan-perera?requestId=demo-request-001&bidId=bid-rohan-perera']}><Routes><Route path="/guides/:guideId" element={<><GuideProfilePage /><LocationDisplay /></>} /><Route path="*" element={<LocationDisplay />} /></Routes></MemoryRouter>)
    expect(await screen.findByRole('heading', { name: 'Rohan Perera' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Traveller reviews' })).toBeInTheDocument()
    expect(screen.getByText('Amelia R.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Select guide' }))
    expect(screen.getByTestId('location')).toHaveTextContent('/guides/requests/demo-request-001/confirm/bid-rohan-perera?guideId=rohan-perera')
  })

  it('shows a not found state for an unknown guide', async () => {
    render(<MemoryRouter initialEntries={['/guides/unknown-guide']}><Routes><Route path="/guides/:guideId" element={<GuideProfilePage />} /></Routes></MemoryRouter>)
    expect(await screen.findByRole('heading', { name: 'Guide not found' })).toBeInTheDocument()
  })

  it('requires all acknowledgements, confirms once, and restores success state', async () => {
    const user = userEvent.setup()
    const route = '/guides/requests/demo-request-001/confirm/bid-rohan-perera?guideId=rohan-perera'
    const view = render(<MemoryRouter initialEntries={[route]}><Routes><Route path="/guides/requests/:requestId/confirm/:bidId" element={<GuideBookingConfirmationPage />} /></Routes></MemoryRouter>)
    const confirmButton = await screen.findByRole('button', { name: 'Confirm Booking' })
    expect(confirmButton).toBeDisabled()
    for (const checkbox of screen.getAllByRole('checkbox')) await user.click(checkbox)
    expect(confirmButton).toBeEnabled()
    await user.click(confirmButton)
    expect(await screen.findByRole('heading', { name: 'Booking confirmed' })).toBeInTheDocument()
    const reference = screen.getByText(/^GUIDE-/).textContent

    view.unmount()
    render(<MemoryRouter initialEntries={[route]}><Routes><Route path="/guides/requests/:requestId/confirm/:bidId" element={<GuideBookingConfirmationPage />} /></Routes></MemoryRouter>)
    expect(await screen.findByRole('heading', { name: 'Booking confirmed' })).toBeInTheDocument()
    expect(screen.getByText(reference)).toBeInTheDocument()
  })

  it('handles a missing bid safely', async () => {
    render(<MemoryRouter initialEntries={['/guides/requests/demo-request-001/confirm/missing?guideId=rohan-perera']}><Routes><Route path="/guides/requests/:requestId/confirm/:bidId" element={<GuideBookingConfirmationPage />} /></Routes></MemoryRouter>)
    expect(await screen.findByRole('heading', { name: 'Booking details not found' })).toBeInTheDocument()
  })

  it('blocks confirmation after bid expiry', async () => {
    vi.setSystemTime(new Date('2028-01-01T10:00:00Z'))
    render(<MemoryRouter initialEntries={['/guides/requests/demo-request-001/confirm/bid-rohan-perera?guideId=rohan-perera']}><Routes><Route path="/guides/requests/:requestId/confirm/:bidId" element={<GuideBookingConfirmationPage />} /></Routes></MemoryRouter>)
    expect(await screen.findByRole('alert')).toHaveTextContent(/expired/i)
    expect(screen.getByRole('button', { name: 'Confirm Booking' })).toBeDisabled()
  })
})
