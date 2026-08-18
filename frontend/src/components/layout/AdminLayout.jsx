import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiFacebook,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiMenu,
  FiPhone,
  FiTwitter,
  FiX,
} from 'react-icons/fi';
import Logo from '../../assets/logo.png';

const primaryNavigation = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Packages', to: '#' },
  { label: 'Booking', to: '#' },
  { label: 'Analytics', to: '#' },
  { label: 'Contact', to: '#' },
];

const AdminLayout = ({ children, isAuthenticated = false, admin = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsMobileMenuOpen(false);
    navigate('/admin/login', { replace: true });
  };

  const isActiveLink = (to) => to === '/admin' && location.pathname === '/admin';

  const authenticationControl = isAuthenticated ? (
    <button
      type="button"
      onClick={handleLogout}
      title={admin ? `Signed in as ${admin.username}` : 'Signed in'}
      className="inline-flex min-h-10 min-w-[118px] items-center justify-center rounded-[6px] bg-red-500 px-6 py-2 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
    >
      Log out
    </button>
  ) : (
    <Link
      to="/admin/login"
      onClick={() => setIsMobileMenuOpen(false)}
      className="inline-flex min-h-10 min-w-[118px] items-center justify-center rounded-[6px] bg-[#0075FF] px-6 py-2 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075FF] focus-visible:ring-offset-2"
    >
      Sign in
    </Link>
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F9FF] font-inter text-[#111111]">
      <header className="relative z-50 border-b border-slate-100 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
        <div className="mx-auto flex min-h-[88px] w-full max-w-[1440px] items-center justify-between px-4 py-3 sm:px-6 lg:min-h-[132px] lg:px-10 lg:py-4 xl:px-12">
          <Link to="/admin" className="flex shrink-0 items-center gap-3 lg:gap-4" aria-label="Admin dashboard">
            <img
              src={Logo}
              alt="Smart Virtual Tourism Guide"
              className="h-16 w-auto object-contain sm:h-20 lg:h-24"
            />
            <div className="hidden flex-col sm:flex">
              <span className="text-[11px] font-semibold text-[#1E3A8A] lg:text-[13px]">
                Smart Virtual Tourism Guide
              </span>
              <span className="text-[20px] font-bold tracking-[0.2em] text-green-600 lg:text-[25px]">
                Sri <span className="text-orange-500">Lanka</span>
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-[14px] font-medium text-[#111111] lg:flex xl:gap-10" aria-label="Primary navigation">
            {primaryNavigation.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`transition-colors hover:text-[#0075FF] ${isActiveLink(item.to) ? 'text-[#8979FF]' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            {authenticationControl}
            <label className="sr-only" htmlFor="admin-language">Language</label>
            <select
              id="admin-language"
              defaultValue="en"
              className="cursor-pointer rounded-md border-0 bg-transparent px-1 py-2 text-[13px] font-medium text-[#111111] outline-none focus-visible:ring-2 focus-visible:ring-[#0075FF]"
            >
              <option value="en">EN</option>
              <option value="si">SI</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-[#111111] transition-colors hover:bg-[#EBF4FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075FF] lg:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="admin-mobile-navigation"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div id="admin-mobile-navigation" className="absolute inset-x-0 top-full border-t border-slate-100 bg-white px-5 py-5 shadow-xl lg:hidden">
            <nav className="mx-auto flex max-w-xl flex-col gap-1" aria-label="Mobile navigation">
              {primaryNavigation.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 text-[15px] font-medium transition-colors hover:bg-[#EBF4FF] hover:text-[#0075FF] ${isActiveLink(item.to) ? 'bg-[#EBF4FF] text-[#8979FF]' : 'text-[#111111]'}`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
                {authenticationControl}
                <select
                  defaultValue="en"
                  aria-label="Language"
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-[14px] font-medium outline-none focus:ring-2 focus:ring-[#0075FF]"
                >
                  <option value="en">EN</option>
                  <option value="si">SI</option>
                </select>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="relative z-20 flex-grow">{children}</main>

      <footer className="relative mt-auto overflow-hidden bg-gradient-to-b from-white to-[#CDEBFF] px-6 pb-8 pt-14 sm:px-8 lg:px-12 lg:pb-10 lg:pt-20">
        <div className="pointer-events-none absolute -bottom-40 -right-36 h-96 w-96 rounded-full border-[32px] border-white/35" />
        <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.9fr_1fr_1fr] lg:gap-9">
          <div className="flex flex-col items-start gap-3">
            <img src={Logo} alt="Smart Virtual Tourism Guide" className="h-28 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-[#1E3A8A]">Smart Virtual Tourism Guide</span>
              <span className="text-[23px] font-bold tracking-[0.2em] text-green-600">
                Sri <span className="text-orange-500">Lanka</span>
              </span>
            </div>
            <p className="max-w-[270px] text-[13px] leading-5 text-slate-700">
              AI-powered travel planning platform designed to help you explore Sri Lanka safely, smartly and efficiently.
            </p>
            <div className="mt-1 flex gap-4" aria-label="Social media links">
              <FiFacebook className="cursor-pointer text-xl text-[#1877F2] transition-opacity hover:opacity-70" />
              <FiInstagram className="cursor-pointer text-xl text-pink-500 transition-opacity hover:opacity-70" />
              <FiTwitter className="cursor-pointer text-xl text-slate-800 transition-opacity hover:opacity-70" />
            </div>
          </div>

          <FooterLinks title="Quick Links" items={['Home', 'Features', 'Destinations', 'How it Works', 'Safety']} />
          <FooterLinks title="Destinations" items={['Sigiriya', 'Ella', 'Galle', 'Yala National Park', 'Colombo']} />

          <FooterLinks title="Support" items={['Help Center', 'Privacy Policy', 'Terms & Condition', 'FAQ', 'Travel Safety Guidelines']} />
          <div>
            <h4 className="mb-4 text-[15px] font-bold text-[#111111]">Contact Us.</h4>
            <div className="flex flex-col gap-4 text-[13px] text-slate-700">
              <div className="flex items-center gap-3"><FiMapPin className="shrink-0 text-lg text-red-500" /><span>Colombo, Sri Lanka</span></div>
              <div className="flex items-center gap-3"><FiPhone className="shrink-0 text-lg text-red-500" /><span>+94 9876543210</span></div>
              <div className="flex items-center gap-3"><FiMail className="shrink-0 text-lg text-blue-400" /><span>support@svgt.lk</span></div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-12 max-w-[1240px] border-t border-blue-200/70 pt-6 text-center text-[13px] font-medium text-[#00AAFF]">
          svgt©2026 all rights reserved
        </div>
      </footer>
    </div>
  );
};

const FooterLinks = ({ title, items }) => (
  <div>
    <h4 className="mb-4 text-[15px] font-bold text-[#111111]">{title}</h4>
    <ul className="ml-4 list-disc space-y-2 text-[13px] text-slate-700">
      {items.map((item) => (
        <li key={item}><Link to="#" className="transition-colors hover:text-[#0075FF]">{item}</Link></li>
      ))}
    </ul>
  </div>
);

export default AdminLayout;
