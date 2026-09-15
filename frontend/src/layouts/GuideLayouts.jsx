import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, BookOpen, BriefcaseBusiness, CircleDollarSign, FileText, House, LogOut, Menu, Search, Settings, UsersRound, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/guide-system.css';

const initials = (value = '') => value.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'U';

export function GuideAdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const signOut = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <div className="gs-shell gs-guide">
      {open && <button className="gs-scrim" aria-label="Close navigation" onClick={() => setOpen(false)} />}
      <aside className={`gs-sidebar ${open ? 'is-open' : ''}`}>
        <div className="gs-brand">
          <div className="gs-guide-mark">GUIDES</div>
          <div><strong>GUIDE</strong><span>Admin Portal</span></div>
          <button className="gs-mobile-close" onClick={() => setOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>
        <nav aria-label="Guide dashboard">
          {guideItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
              <Icon size={19} aria-hidden="true" /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="gs-sidebar-user">
          <div className="gs-avatar">{initials(user?.fullName)}</div>
          <div><strong>{user?.fullName || 'Account'}</strong><span>Guide account</span></div>
          <button onClick={signOut} title="Logout" aria-label="Logout"><LogOut size={18} /></button>
        </div>
      </aside>
      <div className="gs-workspace">
        <header className="gs-topbar">
          <button className="gs-menu" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
          <label className="gs-search"><Search size={18} /><span className="sr-only">Search</span><input placeholder="Search dashboard" /></label>
          <button className="gs-icon-button" aria-label="Notifications"><Bell size={20} /></button>
          <div className="gs-top-user"><div className="gs-avatar">{initials(user?.fullName)}</div><span>{user?.fullName}</span></div>
        </header>
        <main className="gs-main"><Outlet /></main>
      </div>
    </div>
  );
}

const guideItems = [
  { to: '/dashboard-Guide', label: 'Dashboard', icon: House, end: true },
  { to: '/dashboard-Guide/opportunities', label: 'Tourist Requests', icon: UsersRound },
  { to: '/dashboard-Guide/bids', label: 'My Bids', icon: FileText },
  { to: '/dashboard-Guide/booking-requests', label: 'Booking Requests', icon: BookOpen },
  { to: '/dashboard-Guide/packages', label: 'My Tour Packages', icon: BriefcaseBusiness },
  { to: '/dashboard-Guide/earnings', label: 'Earnings', icon: CircleDollarSign },
  { to: '/dashboard-Guide/settings', label: 'Settings', icon: Settings },
];

