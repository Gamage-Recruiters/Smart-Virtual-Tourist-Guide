import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import h1 from '../../assets/headerAssets/Lanka.png'
import h2 from '../../assets/headerAssets/main-test-2.png'

export default function GuideBidsHeader({ menuOpen, onToggleMenu }) {
  const { user, checkingSession } = useAuth()
  const location = useLocation()
  const returnTo = `${location.pathname}${location.search}`
  const name = user?.fullName || user?.username || 'Account'

  return <header className="sticky top-0 z-30 border-b border-[#edf2f6] bg-white/95 backdrop-blur">
    <div className="mx-auto flex min-h-[78px] max-w-[1500px] items-center gap-4 px-4 py-2 sm:px-6 lg:px-8">
      <button type="button" onClick={onToggleMenu} aria-expanded={menuOpen} aria-controls="guide-navigation" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[#31546c] transition hover:bg-[#edf7ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3] md:hidden">
        {menuOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
      </button>
      <Link to="/guides" className="flex shrink-0 items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3]" aria-label="Smart Virtual Tourism Guide marketplace">
        <img src={h1} alt="" className="h-14 w-11 object-contain" />
        <img src={h2} alt="Smart Virtual Tourism Guide Sri Lanka" className="hidden w-[165px] object-contain sm:block" />
      </Link>
      <nav aria-label="Guide shortcuts" className="ml-auto flex items-center gap-2 sm:gap-4">
        <Link to="/guides" className="hidden min-h-10 items-center rounded-lg px-3 text-sm font-bold text-[#31546c] hover:bg-[#f2f7fa] sm:inline-flex">Marketplace</Link>
        {checkingSession ? <span role="status" className="text-xs font-semibold text-[#718396]">Checking session...</span> : user ? <span className="flex items-center gap-2 rounded-xl bg-[#f2f7fa] p-1 pr-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#285d87] text-xs font-bold text-white" aria-hidden="true">{name.charAt(0).toUpperCase()}</span>
          <span className="hidden max-w-40 truncate text-xs font-semibold text-[#263d4e] sm:block">{name}</span>
        </span> : <Link to="/login" state={{ returnTo }} className="guide-button-primary">Sign in</Link>}
      </nav>
    </div>
  </header>
}
