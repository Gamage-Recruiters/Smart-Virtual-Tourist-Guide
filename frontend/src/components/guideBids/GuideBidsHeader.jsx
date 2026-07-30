import { Bell, Globe2, Menu, Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import h1 from '../../assets/h1.png'
import h2 from '../../assets/h2.png'

export default function GuideBidsHeader({ menuOpen, onToggleMenu }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#edf2f6] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[78px] max-w-[1500px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onToggleMenu}
          aria-expanded={menuOpen}
          aria-controls="tourist-navigation"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[#31546c] transition hover:bg-[#edf7ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3] md:hidden"
        >
          {menuOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
        </button>

        <Link
          to="/guide-bids"
          className="flex shrink-0 items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3]"
          aria-label="Smart Virtual Tourism Guide home"
        >
          <img src={h1} alt="" className="h-14 w-11 object-contain" />
          <img
            src={h2}
            alt="Smart Virtual Tourism Guide Sri Lanka"
            className="hidden w-[165px] object-contain sm:block"
          />
        </Link>

        <label className="mx-auto hidden h-10 w-full max-w-[540px] items-center gap-2 rounded-lg bg-[#f5f8fb] px-4 text-[#8b9aa8] lg:flex">
          <Search aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span className="sr-only">Search destinations, bookings, or activities</span>
          <input
            type="search"
            placeholder="Search destinations, bookings, or activities..."
            className="w-full bg-transparent text-xs text-[#2d485c] outline-none placeholder:text-[#a8b3bd]"
          />
        </label>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            aria-label="Language: English"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl px-2 text-xs font-semibold text-[#2d485c] transition hover:bg-[#f2f7fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3]"
          >
            <Globe2 aria-hidden="true" className="h-[18px] w-[18px]" />
            <span>EN</span>
          </button>

          <button
            type="button"
            aria-label="Notifications, one unread"
            className="relative grid h-10 w-10 place-items-center rounded-xl text-[#2d485c] transition hover:bg-[#f2f7fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3]"
          >
            <Bell aria-hidden="true" className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#ef4444]" />
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl p-1 pr-2 transition hover:bg-[#f2f7fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3]"
            aria-label="Open Dasuni's profile"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#285d87] text-xs font-bold text-white">
              D
            </span>
            <span className="hidden text-xs font-semibold text-[#263d4e] sm:block">Dasuni</span>
          </button>
        </div>
      </div>
    </header>
  )
}
