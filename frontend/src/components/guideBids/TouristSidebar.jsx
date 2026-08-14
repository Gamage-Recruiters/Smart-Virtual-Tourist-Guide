import { ClipboardList, Compass, Home, LogOut, Map, ShoppingBag } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const touristItems = [
  { label: 'Marketplace home', icon: Home, to: '/', active: (path) => path === '/' },
  { label: 'Browse guides', icon: ShoppingBag, to: '/guides', active: (path) => path === '/guides' },
  { label: 'Request a guide', icon: Map, to: '/guides/request', active: (path) => path === '/guides/request' },
  { label: 'Guide requests', icon: ClipboardList, to: '/guide-bids', active: (path) => path === '/guide-bids' || path.startsWith('/guides/requests/') || path.startsWith('/guides/bookings/') },
]

const providerItems = [
  { label: 'Marketplace home', icon: Home, to: '/', active: (path) => path === '/' },
  { label: 'Browse guides', icon: ShoppingBag, to: '/guides', active: (path) => path === '/guides' },
  { label: 'Guide opportunities', icon: ClipboardList, to: '/guides/opportunities', active: (path) => path === '/guides/opportunities' },
]

function SidebarLink({ item, onNavigate, active }) {
  const Icon = item.icon
  return <Link to={item.to} onClick={onNavigate} aria-current={active ? 'page' : undefined} className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3] ${active ? 'bg-[#edf7ff] text-[#176eae]' : 'text-[#263d4e] hover:bg-[#f4f8fb] hover:text-[#176eae]'}`}>
    <Icon aria-hidden="true" className="h-4 w-4 shrink-0" /><span>{item.label}</span>
  </Link>
}

export default function TouristSidebar({ mobile = false, open = false, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const provider = user?.role === 'guide_user'
  const items = provider ? providerItems : touristItems
  const doLogout = () => {
    logout()
    onClose?.()
    navigate('/login', { replace: true })
  }
  const navigation = <nav id="guide-navigation" aria-label={provider ? 'Guide provider navigation' : 'Tourist guide navigation'} className="flex h-full flex-col px-3 py-5">
    <div className="mb-3 flex items-center gap-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#90a2b0]"><Compass aria-hidden="true" className="h-3.5 w-3.5" />{provider ? 'Guide menu' : 'Tourist menu'}</div>
    <div className="space-y-1">{items.map((item) => <SidebarLink key={item.label} item={item} onNavigate={onClose} active={item.active(location.pathname)} />)}</div>
    {user && <div className="mt-auto border-t border-[#edf2f6] pt-4"><button type="button" onClick={doLogout} className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-xs font-semibold text-[#263d4e] transition hover:bg-[#fff0ef] hover:text-[#9e281f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3]"><LogOut aria-hidden="true" className="h-4 w-4" />Logout</button></div>}
  </nav>

  if (!mobile) return <aside className="hidden min-h-[720px] w-[205px] shrink-0 border-r border-[#edf2f6] bg-white md:block">{navigation}</aside>
  if (!open) return null
  return <div className="fixed inset-0 z-40 md:hidden"><button type="button" aria-label="Close navigation menu" onClick={onClose} className="absolute inset-0 bg-[#071b2d]/45" /><aside className="relative h-full w-[280px] bg-white shadow-2xl">{navigation}</aside></div>
}
