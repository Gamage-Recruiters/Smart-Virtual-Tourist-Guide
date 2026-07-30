import {
  Compass,
  LayoutDashboard,
  LogOut,
  Map,
  Navigation,
  Settings,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const primaryItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/guide-bids', active: true },
  { label: 'Plan Trip', icon: Map, to: '/booking-page' },
  { label: 'Marketplace', icon: ShoppingBag, to: '/guides' },
  { label: 'Navigation', icon: Navigation, to: '/guide-bids' },
  { label: 'Safety', icon: ShieldCheck, to: '/guide-bids' },
  { label: 'Profile', icon: UserRound, to: '/guide-bids' },
]

const utilityItems = [
  { label: 'Settings', icon: Settings, to: '/guide-bids' },
  { label: 'Logout', icon: LogOut, to: '/guide-bids' },
]

function SidebarLink({ item, onNavigate }) {
  const Icon = item.icon

  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      aria-current={item.active ? 'page' : undefined}
      className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3] ${
        item.active
          ? 'bg-[#edf7ff] text-[#176eae]'
          : 'text-[#263d4e] hover:bg-[#f4f8fb] hover:text-[#176eae]'
      }`}
    >
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{item.label}</span>
    </Link>
  )
}

export default function TouristSidebar({ mobile = false, open = false, onClose }) {
  const navigation = (
    <nav
      id="tourist-navigation"
      aria-label="Tourist dashboard"
      className="flex h-full flex-col px-3 py-5"
    >
      <div className="mb-3 flex items-center gap-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#90a2b0]">
        <Compass aria-hidden="true" className="h-3.5 w-3.5" />
        Tourist menu
      </div>
      <div className="space-y-1">
        {primaryItems.map((item) => (
          <SidebarLink key={item.label} item={item} onNavigate={onClose} />
        ))}
      </div>
      <div className="mt-auto space-y-1 border-t border-[#edf2f6] pt-4">
        {utilityItems.map((item) => (
          <SidebarLink key={item.label} item={item} onNavigate={onClose} />
        ))}
      </div>
    </nav>
  )

  if (!mobile) {
    return (
      <aside className="hidden min-h-[720px] w-[205px] shrink-0 border-r border-[#edf2f6] bg-white md:block">
        {navigation}
      </aside>
    )
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={onClose}
        className="absolute inset-0 bg-[#071b2d]/45"
      />
      <aside className="relative h-full w-[280px] bg-white shadow-2xl">
        {navigation}
      </aside>
    </div>
  )
}
