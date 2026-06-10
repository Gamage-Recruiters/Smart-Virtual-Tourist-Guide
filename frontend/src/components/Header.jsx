import { FaLanguage, FaUserLarge } from 'react-icons/fa6'
import siteLogo from '../assets/Sri Lanka Tourist Site.png'

function Header() {
    return (
        <header className="relative grid w-full items-center gap-5 border border-slate-200/80 bg-white/70 py-4 shadow-[0_28px_60px_rgba(20,40,60,0.12)] backdrop-blur md:grid-cols-[auto_1fr_auto] md:px-5">
            <div className="flex items-center gap-3">
                <div className="grid h-30 w-30 place-items-center rounded-[22px]">
                    <img src={siteLogo} alt="logo" className="h-30 w-30 object-contain" />
                </div>
                <div>
                    <p className="text-[0.78rem] font-extrabold sentence-case tracking-[0.14em] text-sky-700">Smart Virtual Tourism Guide</p>
                    <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl flex items-center gap-1">
                        <span className="sr-only">Sri Lanka</span>
                        <span className="text-[1.6rem] leading-none" aria-hidden>
                            <span className="inline-block text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(90deg,#0b6b3a,#2fa84f)'}}>S</span>
                            <span className="inline-block text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(90deg,#2fa84f,#f7981d)'}}>r</span>
                            <span className="inline-block text-transparent bg-clip-text mr-3" style={{backgroundImage: 'linear-gradient(90deg,#f7981d,#e94e1b)'}}>i</span>

                            <span className="inline-block text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(90deg,#e94e1b,#ff7a18)'}}>L</span>
                            <span className="inline-block text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(90deg,#ff7a18,#d93a6c)'}}>a</span>
                            <span className="inline-block text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(90deg,#d93a6c,#8b1f6b)'}}>n</span>
                            <span className="inline-block text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(90deg,#8b1f6b,#6b1b5d)'}}>k</span>
                            <span className="inline-block text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(90deg,#6b1b5d,#d93a6c)'}}>a</span>
                        </span>
                    </h1>
                </div>
            </div>

            <nav className="flex flex-wrap items-center justify-start gap-4 text-sm font-bold text-slate-500 md:justify-center">
                <a className="transition hover:text-sky-800" href="hotel-owner-dashboard">Overview</a>
                <a className="transition hover:text-sky-800" href="view-rooms-packages">Rooms</a>
                <a className="transition hover:text-sky-800" href="#availability">Availability</a>
                <a className="transition hover:text-sky-800" href="#bookings">Bookings</a>
                <a className="transition hover:text-sky-800" href="#revenue">Revenue</a>
            </nav>

            <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <button
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-900"
                    type="button"
                >
                    <FaLanguage className="text-sky-700" /> EN
                </button>
            </div>

        </header>
    )
}

export default Header
