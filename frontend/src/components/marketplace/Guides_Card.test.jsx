import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GuidesCard from './Guides_Card'

function LocationDisplay() {
  const location = useLocation()
  return <p data-testid="location">{location.pathname}:{location.state?.returnTo}</p>
}

describe('Guide marketplace', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('keeps public guide packages visible without contacting the backend', () => {
    const fetchSpy = vi.fn().mockRejectedValue(new TypeError('offline'))
    vi.stubGlobal('fetch', fetchSpy)
    render(<MemoryRouter><GuidesCard /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Kasun Jayawardena' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Elena Rostova' })).toBeInTheDocument()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('filters the public catalog and resets it', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><GuidesCard /></MemoryRouter>)
    await user.type(screen.getByRole('searchbox'), 'Sigiriya')
    expect(screen.getByRole('heading', { name: 'Saman Kumara' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Kasun Jayawardena' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reset' }))
    expect(screen.getByRole('heading', { name: 'Kasun Jayawardena' })).toBeInTheDocument()
  })

  it('sends a logged-out hire action through login with the request return path', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/guides']}><Routes><Route path="/guides" element={<><GuidesCard /><LocationDisplay /></>} /><Route path="/login" element={<LocationDisplay />} /></Routes></MemoryRouter>)
    await user.click(screen.getAllByRole('button', { name: 'Hire Guide' })[0])
    expect(screen.getByTestId('location')).toHaveTextContent('/login:/guides/request')
  })

  it('opens a public details route without authentication', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/guides']}><Routes><Route path="/guides" element={<GuidesCard />} /><Route path="/guides/catalog/:catalogId" element={<LocationDisplay />} /></Routes></MemoryRouter>)
    await user.click(screen.getAllByRole('button', { name: 'View details' })[0])
    expect(screen.getByTestId('location')).toHaveTextContent('/guides/catalog/saman-kumara')
  })
})
