import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, checkingSession } = useAuth()
  const location = useLocation()

  if (checkingSession) {
    return <main className="grid min-h-screen place-items-center bg-[#f7faff] px-4" role="status">
      <p className="rounded-xl bg-white px-5 py-4 text-sm font-semibold text-[#31546c] shadow">Checking your session...</p>
    </main>
  }

  if (!user) {
    const returnTo = `${location.pathname}${location.search}${location.hash}`
    return <Navigate replace to="/login" state={{ returnTo }} />
  }

  if (roles.length && !roles.includes(user.role)) {
    const guideOnly = roles.includes('guide_user') && !roles.includes('tourist_user')
    return <main className="grid min-h-screen place-items-center bg-[#f7faff] px-4">
      <section className="max-w-lg rounded-2xl border border-[#efd7a7] bg-white p-7 text-center shadow">
        <h1 className="text-2xl font-extrabold text-[#183b56]">{guideOnly ? 'Guide account required' : 'Tourist account required'}</h1>
        <p className="mt-3 text-sm leading-6 text-[#627587]">This action is available to signed-in {guideOnly ? 'guides' : 'tourists'}. Your current account does not have permission.</p>
      </section>
    </main>
  }

  return children
}
