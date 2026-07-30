import { Mail, MapPin, Phone } from 'lucide-react'
import { FaFacebookF, FaInstagram } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import h1 from '../assets/h1.png'
import h2 from '../assets/h2.png'
import Lotus1 from '../assets/Lotus1.png'
import Lotus2 from '../assets/Lotus2.png'

const footerColumns = [
  {
    title: 'Quick Links',
    links: ['Home', 'Features', 'Destinations', 'How It Works', 'Safety'],
  },
  {
    title: 'Destinations',
    links: ['Sigiriya', 'Ella', 'Galle', 'Yala National Park', 'Colombo'],
  },
  {
    title: 'Support',
    links: ['Help Center', 'Privacy Policy', 'Terms & Conditions', 'FAQ', 'Travel Safety Guidelines'],
  },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-white via-[#eef9ff] to-[#cdeeff] pt-14">
      <img
        src={Lotus1}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-12 bottom-0 w-[180px] object-contain opacity-80 sm:left-0 sm:w-[220px]"
      />
      <img
        src={Lotus2}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 -right-20 hidden w-[390px] object-contain opacity-75 lg:block"
      />

      <div className="relative z-10 mx-auto grid max-w-[1280px] gap-10 px-6 pb-10 sm:px-10 md:grid-cols-2 lg:grid-cols-[1.35fr_0.7fr_0.7fr_1fr_1.1fr] lg:px-12">
        <div>
          <div className="flex items-center gap-2">
            <img src={h1} alt="" className="h-20 w-16 object-contain" />
            <img src={h2} alt="Smart Virtual Tourism Guide Sri Lanka" className="w-[175px] object-contain" />
          </div>
          <p className="mt-2 max-w-[250px] text-xs leading-5 text-[#324b5d]">
            AI-powered travel planning designed to help you explore Sri Lanka safely, smartly and
            efficiently.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="#facebook"
              aria-label="Facebook"
              className="grid h-8 w-8 place-items-center rounded-full bg-white/75 text-[#1877f2] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3]"
            >
              <FaFacebookF aria-hidden="true" size={14} />
            </a>
            <a
              href="#instagram"
              aria-label="Instagram"
              className="grid h-8 w-8 place-items-center rounded-full bg-white/75 text-[#e1306c] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3]"
            >
              <FaInstagram aria-hidden="true" size={15} />
            </a>
            <a
              href="#x"
              aria-label="X"
              className="grid h-8 w-8 place-items-center rounded-full bg-white/75 text-[#102538] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3]"
            >
              <FaXTwitter aria-hidden="true" size={14} />
            </a>
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <h2 className="text-xs font-extrabold text-[#102538]">{column.title}</h2>
            <ul className="mt-4 space-y-2 text-xs text-[#324b5d]">
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replaceAll(' ', '-')}`}
                    className="transition hover:text-[#087bd3] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3]"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="text-xs font-extrabold text-[#102538]">Contact Us</h2>
          <ul className="mt-4 space-y-4 text-xs text-[#324b5d]">
            <li className="flex items-center gap-2">
              <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-[#ef4b4b]" />
              <span>Colombo, Sri Lanka</span>
            </li>
            <li>
              <a
                href="tel:+94112345678"
                className="flex items-center gap-2 transition hover:text-[#087bd3] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3]"
              >
                <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-[#ef4b4b]" />
                <span>+94 11 234 5678</span>
              </a>
            </li>
            <li>
              <a
                href="mailto:support@svgt.lk"
                className="flex items-center gap-2 transition hover:text-[#087bd3] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3]"
              >
                <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-[#168cdb]" />
                <span>support@svgt.lk</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/60 px-6 py-4 text-center text-[11px] text-[#1683c8]">
        © 2026 Smart Virtual Tourism Guide. All rights reserved.
      </div>
    </footer>
  )
}
