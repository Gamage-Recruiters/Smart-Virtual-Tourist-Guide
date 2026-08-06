import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GUIDE_STORAGE_KEYS, guideService } from '../../services/guideService'
import RequestGuidePage from './RequestGuidePage'

const renderPage = () => render(<MemoryRouter initialEntries={['/guides/request']}><Routes><Route path="/guides/request" element={<RequestGuidePage />} /><Route path="/guides/requests/:requestId/bids" element={<h1>Submitted request</h1>} /></Routes></MemoryRouter>)

describe('RequestGuidePage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
    vi.setSystemTime(new Date('2026-08-06T10:00:00Z'))
  })

  it('shows inline required validation and prevents invalid submission', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: 'Submit request' }))
    expect(await screen.findByText('Starting location is required.')).toBeInTheDocument()
    expect(screen.getByText('Main destination is required.')).toBeInTheDocument()
    expect(screen.getByLabelText(/Starting location/)).toHaveAttribute('aria-invalid', 'true')
  })

  it('restores a saved draft safely', () => {
    window.localStorage.setItem(GUIDE_STORAGE_KEYS.draft, JSON.stringify({ startLocation: 'Galle', destination: 'Kandy', specialities: [] }))
    renderPage()
    expect(screen.getByLabelText(/Starting location/)).toHaveValue('Galle')
    expect(screen.getByLabelText(/Main destination/)).toHaveValue('Kandy')
  })

  it('submits a valid request and blocks duplicate clicks while processing', async () => {
    const user = userEvent.setup()
    let resolveRequest
    const createSpy = vi.spyOn(guideService, 'createRequest').mockImplementation(() => new Promise((resolve) => { resolveRequest = resolve }))
    renderPage()
    await user.type(screen.getByLabelText(/Starting location/), 'Colombo')
    await user.type(screen.getByLabelText(/Main destination/), 'Sigiriya')
    await user.type(screen.getByLabelText(/Start date/), '2026-11-12')
    await user.type(screen.getByLabelText(/End date/), '2026-11-15')
    await user.type(screen.getByLabelText(/Maximum budget/), '30000')
    const submit = screen.getByRole('button', { name: 'Submit request' })
    await user.click(submit)
    expect(screen.getByRole('button', { name: 'Submitting…' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Submitting…' }))
    expect(createSpy).toHaveBeenCalledTimes(1)
    resolveRequest({ id: 'created-request' })
    expect(await screen.findByRole('heading', { name: 'Submitted request' })).toBeInTheDocument()
  })
})
