import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '../../context/AuthContext'
import { userAPI } from '../../services/api'
import TouristSidebar from '../guideBids/TouristSidebar'
import ProtectedRoute from './ProtectedRoute'

function LoginDestination() {
  const location = useLocation()
  return <><h1>Login destination</h1><p>{location.state?.returnTo}</p></>
}

describe('guide route authentication', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('redirects a logged-out tourist and preserves the complete destination', async () => {
    render(<AuthProvider><MemoryRouter initialEntries={['/guides/request?source=marketplace']}><Routes>
      <Route path="/login" element={<LoginDestination />} />
      <Route path="/guides/request" element={<ProtectedRoute roles={['tourist_user']}><h1>Private request</h1></ProtectedRoute>} />
    </Routes></MemoryRouter></AuthProvider>)
    expect(await screen.findByRole('heading', { name: 'Login destination' })).toBeInTheDocument()
    expect(screen.getByText('/guides/request?source=marketplace')).toBeInTheDocument()
  })

  it('restores a valid token and logout clears the real session', async () => {
    window.localStorage.setItem('token', 'valid-token')
    window.localStorage.setItem('userData', JSON.stringify({ fullName: 'Stale Name' }))
    vi.spyOn(userAPI, 'getMe').mockResolvedValue({ user: { _id: 'tourist-1', fullName: 'Real Tourist', role: 'tourist_user' } })
    const user = userEvent.setup()
    render(<AuthProvider><MemoryRouter initialEntries={['/guide-bids']}><Routes>
      <Route path="/login" element={<h1>Signed out</h1>} />
      <Route path="/guide-bids" element={<ProtectedRoute roles={['tourist_user']}><TouristSidebar /></ProtectedRoute>} />
    </Routes></MemoryRouter></AuthProvider>)
    expect(await screen.findByRole('button', { name: 'Logout' })).toBeInTheDocument()
    expect(JSON.parse(window.localStorage.getItem('userData')).fullName).toBe('Real Tourist')
    await user.click(screen.getByRole('button', { name: 'Logout' }))
    expect(await screen.findByRole('heading', { name: 'Signed out' })).toBeInTheDocument()
    expect(window.localStorage.getItem('token')).toBeNull()
    expect(window.localStorage.getItem('userData')).toBeNull()
  })
})
