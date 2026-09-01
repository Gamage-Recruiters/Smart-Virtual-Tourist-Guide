import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SafetySidebar from '../../components/safety/SafetySidebar'
import { FiMenu } from 'react-icons/fi'

export default function SafetyLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[225px_1fr]">
      {/* Mobile hamburger button */}
      <button
        type="button"
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed left-4 top-28 z-[9999] flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 shadow-md backdrop-blur-sm text-slate-700 hover:bg-white md:hidden transition-colors"
        aria-label="Open navigation menu"
      >
        <FiMenu size={22} />
      </button>

      <SafetySidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />
      <Outlet />
    </div>
  )
}
