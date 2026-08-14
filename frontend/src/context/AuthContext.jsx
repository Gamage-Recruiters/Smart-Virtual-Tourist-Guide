import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { AUTH_STORAGE_KEY, setAccessToken, setStoredUser, userAPI } from '../services/api'

const storeSession = (user, token) => {
  setAccessToken(token)
  setStoredUser(user)
}

const clearSession = () => {
  setAccessToken(null)
  setStoredUser(null)
}

const AuthContext = createContext({
  user: null,
  checkingSession: false,
  isAuthenticated: false,
  signIn: storeSession,
  logout: clearSession,
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [checkingSession, setCheckingSession] = useState(() => Boolean(window.localStorage.getItem(AUTH_STORAGE_KEY)))

  useEffect(() => {
    let active = true
    const token = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!token || token === 'null' || token === 'undefined') {
      clearSession()
      return () => { active = false }
    }

    userAPI.getMe()
      .then((result) => {
        if (!active) return
        const authenticatedUser = result.user
        if (!authenticatedUser) throw new Error('The session response did not include a user.')
        setStoredUser(authenticatedUser)
        setUser(authenticatedUser)
      })
      .catch(() => {
        if (!active) return
        clearSession()
        setUser(null)
      })
      .finally(() => { if (active) setCheckingSession(false) })

    return () => { active = false }
  }, [])

  useEffect(() => {
    const handleAuthenticationRequired = () => {
      clearSession()
      setUser(null)
      setCheckingSession(false)
    }
    window.addEventListener('svtg:authentication-required', handleAuthenticationRequired)
    return () => window.removeEventListener('svtg:authentication-required', handleAuthenticationRequired)
  }, [])

  const value = useMemo(() => ({
    user,
    checkingSession,
    isAuthenticated: Boolean(user),
    signIn(authenticatedUser, token) {
      storeSession(authenticatedUser, token)
      setUser(authenticatedUser)
      setCheckingSession(false)
    },
    logout() {
      clearSession()
      setUser(null)
      setCheckingSession(false)
    },
  }), [user, checkingSession])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Context consumers intentionally live beside the provider so the session API
// remains a single source of truth.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
