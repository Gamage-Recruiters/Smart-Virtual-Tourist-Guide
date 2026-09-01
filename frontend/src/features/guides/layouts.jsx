import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Bell, BriefcaseBusiness, CalendarCheck, CircleDollarSign,
  LayoutDashboard, Menu, Package, Search, Settings, Users, X,
} from 'lucide-react';
import TouristHeader from '../../components/Tourist/Header.jsx';
import TouristFooter from '../../components/Tourist/Footer.jsx';
import logo from '../../assets/Tourist/logo.png';
import { useAuth } from '../../context/AuthContext.jsx';
import { UserAvatar } from './components.jsx';

const touristLinks = [
  ['/dashboard-Tourist', 'Tourist Dashboard', true],
  ['/dashboard-Tourist/guides', 'Find a Guide'],
  ['/dashboard-Tourist/guides/request', 'Request a Guide'],
  ['/dashboard-Tourist/guides/requests', 'My Guide Requests'],
];

export function TouristGuideLayout() {
  return <div className="guide-tourist-shell guide-page">
    <TouristHeader />
    <div className="guide-tourist-body">
      <nav className="guide-tourist-nav" aria-label="Tourist guide navigation">
        {touristLinks.map(([to, label, end]) => <NavLink key={to} to={to} end={end}>{label}</NavLink>)}
      </nav>
      <main className="guide-tourist-main"><Outlet /></main>
    </div>
    <TouristFooter />
  </div>;
}

const providerLinks = [
  ['/dashboard-Guide', 'Dashboard', LayoutDashboard, true],
  ['/dashboard-Guide/opportunities', 'Tourist Requests / Opportunities', Users],
  ['/dashboard-Guide/bids', 'My Bids', BriefcaseBusiness],
  ['/dashboard-Guide/booking-requests', 'Booking Requests', CalendarCheck],
  ['/dashboard-Guide/packages', 'My Tour Packages', Package],
  ['/dashboard-Guide/earnings', 'Earnings', CircleDollarSign],
  ['/dashboard-Guide/settings', 'Settings', Settings],
];

export function GuideAdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const storedUser = user || JSON.parse(localStorage.getItem('userData') || 'null');
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return <div className="guide-provider-page"><div className="guide-shell guide-page">
    <aside className={`guide-sidebar ${menuOpen ? 'open' : ''}`}>
      <div className="guide-brand"><img src={logo} alt="Smart Virtual Tourist Guide" /><span><strong>GUIDES</strong><small>Admin Portal</small></span></div>
      <nav className="guide-nav" aria-label="Guide portal navigation">
        {providerLinks.map(([to, label, Icon, end]) => <NavLink onClick={() => setMenuOpen(false)} key={to} to={to} end={end}><Icon size={18} />{label}</NavLink>)}
      </nav>
      <div className="guide-account">
        <UserAvatar user={storedUser} />
        <div style={{ minWidth: 0, flex: 1 }}><strong style={{ display: 'block', fontSize: 13 }}>{storedUser?.fullName || 'Guide'}</strong><small style={{ color: '#7a8799' }}>Guide account</small></div>
        <button onClick={handleLogout} title="Sign out" className="guide-btn" style={{ padding: 8, minHeight: 32 }}><X size={16} /></button>
      </div>
    </aside>
    <div className="guide-main">
      <header className="guide-topbar">
        <button className="guide-btn guide-mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation"><Menu size={21} /></button>
        <div className="guide-search"><Search size={18} /><input aria-label="Search guide portal" placeholder="Search requests, bookings or packages" /></div>
        <div className="guide-actions"><button className="guide-btn" aria-label="Notifications"><Bell size={19} /></button><div className="guide-topbar-account"><strong>{storedUser?.fullName || 'Guide'}</strong><small>Tour Guide</small></div><UserAvatar user={storedUser} /></div>
      </header>
      <main className="guide-content"><Outlet /></main>
    </div>
  </div><TouristFooter /></div>;
}
