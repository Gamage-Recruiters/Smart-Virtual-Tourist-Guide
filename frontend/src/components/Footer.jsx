import LOTUS_LEFT_SRC from './../assets/LotesFlower.png';
import MANDALA_RIGHT_SRC from './../assets/RightSideFooter.png';
import LOGO_SRC from './../assets/SriLanka.png';
import FLAG_SRC from './../assets/srilankanflag.jpg';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-[#F4F9FF] to-[#D5EDFC] text-gray-800 px-6 sm:px-12 md:px-16 lg:px-24 pt-13 pb-8 w-full overflow-hidden">

      <img
        src={LOTUS_LEFT_SRC}
        alt=""
        className="hidden xl:block absolute bottom-0 left-[-50px] h-[380px] opacity-75 object-contain pointer-events-none z-0 scale-[1.2] origin-bottom-left transition-transform"
      />

      <img
        src={MANDALA_RIGHT_SRC}
        alt=""
        className="hidden xl:block absolute bottom-0 right-0 h-[300px] opacity-60 saturate-150 contrast-125 object-contain pointer-events-none z-0 scale-[2.5] origin-bottom-right transition-all duration-300"
      />

      <div className="relative z-10 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10 xl:gap-12 mt-12 sm:mt-20">


        <div className="sm:col-span-2 md:col-span-3 lg:col-span-2 flex flex-col items-center text-center gap-3">

          <div className="w-24 h-24 mb-2 flex justify-center">
            <img
              src={LOGO_SRC}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          {/* Brand Name */}
          <p className="font-extrabold text-[#0044BB] text-xs sm:text-sm tracking-wide leading-none text-center">
            Smart Virtual Tourism Guide
          </p>

          <div
            className="bg-clip-text text-transparent bg-cover bg-center flex flex-nowrap whitespace-nowrap justify-center gap-1 text-2xl sm:text-3xl font-medium tracking-widest uppercase leading-none select-none mt-1"

            style={{ backgroundImage: `url(${FLAG_SRC})` }}
          >
            <span>s</span>
            <span>r</span>
            <span>i</span>
            <span className="w-2"></span>
            <span>l</span>
            <span>a</span>
            <span>n</span>
            <span>k</span>
            <span>a</span>
          </div>

          <p className="text-gray-500 text-xs sm:text-sm font-semibold leading-relaxed max-w-[280px] mt-4 text-center">
            Ai-powered travel planning platform design to help you explore <span className="font-bold text-gray-700">Sri Lanka</span> safety, smartly and efficiently
          </p>
        </div>


        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10 xl:gap-12 mt-8 sm:mt-12 lg:mt-14">

          <div className="w-full">
            <h5 className="font-extrabold text-[#111111] text-xs sm:text-sm tracking-wide mb-4 uppercase">Quick Links</h5>
            <ul className="space-y-2.5">
              {["Home", "Features", "Destinations", "How it Works", "Safety"].map(l => (
                <li key={l} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-blue-600 font-bold transition-colors">
                  <span className="text-gray-400">•</span>
                  <a href="#">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full">
            <h5 className="font-extrabold text-[#111111] text-xs sm:text-sm tracking-wide mb-4 uppercase">Destinations</h5>
            <ul className="space-y-2.5">
              {["Sigiriya", "Ella", "Galle", "Yala National Park", "Colombo"].map(l => (
                <li key={l} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-blue-600 font-bold transition-colors">
                  <span className="text-gray-400">•</span>
                  <a href="#">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full">
            <h5 className="font-extrabold text-[#111111] text-xs sm:text-sm tracking-wide mb-4 uppercase">Support</h5>
            <ul className="space-y-2.5">
              {["Help Center", "Privacy Policy", "Terms & Condition", "FAQ", "Travel Safety Guidelines"].map(l => (
                <li key={l} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-blue-600 font-bold transition-colors">
                  <span className="text-gray-400">•</span>
                  <a href="#">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full flex flex-col gap-4">
            <h5 className="font-extrabold text-[#111111] text-xs sm:text-sm tracking-wide mb-2 uppercase">Contact Us.</h5>
            <ul className="space-y-3">
              {/* Location Line */}
              <li className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500 flex-shrink-0">
                  <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                </svg>
                <span>Colombo, Sri Lanka</span>
              </li>

              {/* Phone Line */}
              <li className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500 flex-shrink-0">
                  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                </svg>
                <span>+91 9876543210</span>
              </li>

              {/* Email Line */}
              <li className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#85C4F7] flex-shrink-0">
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905a.75.75 0 0 0 .53.5l14.25 3.667a.75.75 0 0 0 .896-.896L16.998 3.63a.75.75 0 0 0-.5-.53L3.478 2.404Z" />
                  <path d="M17.195 11.724A.75.75 0 0 0 16.5 11.5H3.667a.75.75 0 0 0-.5.53L.735 19.936a.75.75 0 0 0 .926.94l13.627-4.183a.75.75 0 0 0 .5-.53l1.407-4.439Z" />
                </svg>
                <span>support@svgt.com</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 mt-0 pt-3 w-full max-w-2xl mx-auto pr-24 sm:pr-32">

        {/* Social Media Links (Facebook, Instagram, X) */}
        <div className="flex gap-4">
          {/* Facebook */}
          <a href="#" className="text-blue-600 hover:scale-115 transition-transform">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6c.9 0 1.84.16 1.84.16v2.04h-1.04c-1 0-1.3.62-1.3 1.25V12h2.3l-.37 3h-1.93v6.8c4.56-.93 8-4.96 8-9.8z" />
            </svg>
          </a>
          {/* Instagram */}
          <a href="#" className="text-pink-600 hover:scale-115 transition-transform">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </a>
          {/* X */}
          <a href="#" className="text-black hover:scale-115 transition-transform">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>

        <span className="text-[#3498DB] text-xs sm:text-sm font-semibold tracking-wide mr-8 sm:mr-12">
          svgt©2026 all right reserve
        </span>

      </div>

    </footer>
  );
}

export default Footer;