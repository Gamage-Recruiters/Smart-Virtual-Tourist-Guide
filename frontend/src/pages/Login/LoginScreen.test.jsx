import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { userAPI } from '../../services/api'
import LoginScreen from './LoginScreen'

describe('LoginScreen', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('stores the stable token key and returns to the guide request', async () => {
    vi.spyOn(userAPI, 'login').mockResolvedValue({
      token: 'stable-login-token',
      user: { _id: 'user-1', fullName: 'Test Tourist', role: 'tourist_user' },
    })
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={[{ pathname: '/login', state: { returnTo: '/guides/request' } }]}>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/guides/request" element={<h1>Guide request</h1>} />
      </Routes>
    </MemoryRouter>)
    await user.type(screen.getByLabelText('Email or username'), 'tourist@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByRole('heading', { name: 'Guide request' })).toBeInTheDocument()
    expect(window.localStorage.getItem('token')).toBe('stable-login-token')
    expect(JSON.parse(window.localStorage.getItem('userData')).role).toBe('tourist_user')
  })

  it.each([
    [{ code: 'INVALID_CREDENTIALS', status: 401, message: 'Invalid credentials.' }, 'Incorrect email/username or password.'],
    [{ code: 'NETWORK_ERROR', status: 0, message: 'network failed' }, 'Unable to reach the server.'],
    [{ code: 'INTERNAL_ERROR', status: 500, message: 'database details' }, 'The server could not complete your request. Please try again.'],
  ])('shows a safe, specific login error for %#', async (apiError, expectedMessage) => {
    vi.spyOn(userAPI, 'login').mockRejectedValue(apiError)
    const user = userEvent.setup()
    render(<MemoryRouter><LoginScreen /></MemoryRouter>)
    await user.type(screen.getByLabelText('Email or username'), 'tourist@example.com')
    await user.type(screen.getByLabelText('Password'), 'wrong-password')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(expectedMessage)
  })
})
