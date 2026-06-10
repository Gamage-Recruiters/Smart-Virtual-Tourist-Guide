import { FaFacebookF, FaInstagram, FaX, FaPhone, FaEnvelope } from 'react-icons/fa6'
import { FaMapMarkerAlt } from 'react-icons/fa'
import lotus from '../assets/Lotus Flower.png'
import siteLogo from '../assets/Sri Lanka Tourist Site.png'
import footerDesign from '../assets/Footer Design.png'

function Footer() {
	return (
		<footer className="relative mt-8 min-h-90 w-full overflow-hidden bg-sky-50 mb-0">
			<img src={lotus} alt="lotus" className="pointer-events-none absolute left-11 top-3 hidden h-90 w-auto -translate-x-1/3 md:block opacity-95" />
			<img src={footerDesign} alt="footer design" className="pointer-events-none absolute bottom-0 right-0 hidden w-2xl max-w-none md:block opacity-55" />

			<div className="w-full px-4 py-8 sm:px-6 lg:px-8">
				<div className="grid gap-8 md:grid-cols-6">
					<div className="flex items-start gap-6 md:col-span-2">
						<div className="mt-2 shrink-0 ml-28">
                            <div className="h-20 w-20 overflow-hidden rounded-full">
								<img src={siteLogo} alt="logo" className="h-full w-full object-contain" />
							</div>
							<p className="text-sm font-extrabold text-sky-700">Smart Virtual Tourism Guide</p>
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
							<p className="mt-3 max-w-72 text-sm text-slate-600">AI-powered travel planning platform design to help you explore Sri Lanka safety, smartly and efficiently.</p>

							<div className="mt-4 flex items-center gap-3 text-slate-700">
								<FaFacebookF className="h-5 w-5" />
								<FaInstagram className="h-5 w-5" />
								<FaX className="h-5 w-5" />
							</div>
						</div>
					</div>

					<div className="md:col-span-1 mt-8">
						<h5 className="mb-3 font-bold text-slate-800">Quick Links</h5>
						<ul className="space-y-2 text-sm text-slate-600">
							<li>Home</li>
							<li>Features</li>
							<li>Destinations</li>
							<li>How it Works</li>
							<li>Safety</li>
						</ul>
					</div>

					<div className="md:col-span-1 mt-8">
						<h5 className="mb-3 font-bold text-slate-800">Destinations</h5>
						<ul className="space-y-2 text-sm text-slate-600">
							<li>Sigiriya</li>
							<li>Ella</li>
							<li>Galle</li>
							<li>Yala National Park</li>
							<li>Colombo</li>
						</ul>
					</div>

					<div className="md:col-span-1 mt-8">
						<h5 className="mb-3 font-bold text-slate-800">Support</h5>
						<ul className="space-y-2 text-sm text-slate-600">
							<li>Help Center</li>
							<li>Privacy Policy</li>
							<li>Terms & Condition</li>
							<li>FAQ</li>
						</ul>
					</div>

					<div className="md:col-span-1 mt-8">
						<h5 className="mb-3 font-bold text-slate-800">Contact Us.</h5>
						<div className="flex items-start gap-3 text-sm text-slate-600">
							<FaMapMarkerAlt className="mt-1 text-sky-700" />
							<div>Colombo, Sri Lanka</div>
						</div>
						<div className="mt-3 flex items-start gap-3 text-sm text-slate-600">
							<FaPhone className="mt-1 text-amber-600" />
							<div>+91 9876543210</div>
						</div>
						<div className="mt-3 flex items-start gap-3 text-sm text-slate-600">
							<FaEnvelope className="mt-1 text-sky-700" />
							<div>support@svg.t.lk</div>
						</div>
					</div>
				</div>

				<div className="mt-6 flex items-center justify-center">
					<div className="text-center text-sm text-sky-600">SVGT©2026 all rights reserved</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
