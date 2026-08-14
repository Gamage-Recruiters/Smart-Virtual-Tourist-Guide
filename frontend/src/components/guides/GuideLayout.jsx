import { useEffect, useState } from 'react'
import Footer from '../Footer'
import GuideBidsHeader from '../guideBids/GuideBidsHeader'
import TouristSidebar from '../guideBids/TouristSidebar'

export default function GuideLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7faff] font-sans text-[#102538]">
      <GuideBidsHeader menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((open) => !open)} />
      <TouristSidebar mobile open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="mx-auto flex max-w-[1500px]">
        <TouristSidebar />
        <main className="min-w-0 flex-1 px-4 pb-16 pt-7 sm:px-7 lg:px-10 lg:pt-10 xl:px-14">
          <div className="mx-auto max-w-[1120px]">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
