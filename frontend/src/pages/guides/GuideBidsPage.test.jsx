import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GuideBidsPage from './GuideBidsPage'

function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}{location.search}</div>
}

const renderPage = () => render(
  <MemoryRouter initialEntries={['/guides/requests/demo-request-001/bids']}>
    <Routes>
      <Route path="/guides/requests/:requestId/bids" element={<><GuideBidsPage /><LocationDisplay /></>} />
      <Route path="*" element={<LocationDisplay />} />
    </Routes>
  </MemoryRouter>,
)

describe('GuideBidsPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.setSystemTime(new Date('2026-08-06T10:00:00Z'))
  })

  it('renders the four screenshot guides, filters, resets and paginates', async () => {
    const user = userEvent.setup()
    renderPage()
    expect(await screen.findByRole('heading', { name: 'Rohan Perera' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Maliki Perera' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ajith Perera' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'John Perera' })).toBeInTheDocument()

    await user.type(screen.getByRole('searchbox', { name: 'Guide name' }), 'Rohan')
    expect(screen.queryByRole('heading', { name: 'Maliki Perera' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reset filters' }))
    expect(await screen.findByRole('heading', { name: 'Maliki Perera' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Page 2' }))
    expect(await screen.findByRole('heading', { name: 'Nadeesha Silva' })).toBeInTheDocument()
  })

  it('supports up to three comparison selections and rejects the fourth', async () => {
    const user = userEvent.setup()
    renderPage()
    const boxes = await screen.findAllByRole('checkbox', { name: 'Compare' })
    await user.click(boxes[0])
    await user.click(boxes[1])
    await user.click(boxes[2])
    expect(screen.getByText('3 selected')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Compare' })).toBeEnabled()
    await user.click(boxes[3])
    expect(await screen.findByText('You can compare up to three guides.')).toBeInTheDocument()
    expect(screen.getByText('3 selected')).toBeInTheDocument()
  })

  it('navigates to profile and confirmation with all identifiers', async () => {
    const user = userEvent.setup()
    renderPage()
    const profileButtons = await screen.findAllByRole('button', { name: 'View profile' })
    await user.click(profileButtons[0])
    expect(screen.getByTestId('location')).toHaveTextContent('/guides/rohan-perera?requestId=demo-request-001&bidId=bid-rohan-perera')

    renderPage()
    const selectButtons = await screen.findAllByRole('button', { name: 'Select guide' })
    await user.click(selectButtons[0])
    await waitFor(() => expect(screen.getAllByTestId('location').at(-1)).toHaveTextContent('/guides/requests/demo-request-001/confirm/bid-rohan-perera?guideId=rohan-perera'))
  })
})
