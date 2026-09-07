import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SafetySidebar from '../../components/safety/SafetySidebar'
import { FiMenu } from 'react-icons/fi'
import Header from '../../components/header'
import Footer from '../../components/Footer'

export default function SafetyLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[225px_1fr]">
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
      
      <Footer />
    </div>
  )
}
