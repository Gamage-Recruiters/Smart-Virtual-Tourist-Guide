import { FaFacebookF, FaInstagram, FaX, FaPhone, FaEnvelope } from 'react-icons/fa6'
import { FaMapMarkerAlt } from 'react-icons/fa'

function Footer() {
    return (
        <footer className="relative mt-8 border-t border-slate-200 bg-linear-to-b from-white/60 to-sky-50/60">
            <div className="mx-auto w-[min(1440px,calc(100%-1.5rem))] py-10">
                {/* Decorative flower image - place your uploaded file at public/assets/lotus.png */}
                <img
                    src="/assets/lotus.png"
                    alt="decorative lotus"
                    className="pointer-events-none absolute left-0 top-1/2 hidden h-56 w-auto -translate-y-1/2 translate-x-[-20%] md:block opacity-95"
                />
                <div className="grid gap-8 md:grid-cols-6">
                    <div className="md:col-span-2">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-linear-to-br from-amber-300 to-sky-500 p-2 text-white">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="white"/></svg>
                            </div>
                            <div>
                                <p className="text-sm font-extrabold text-sky-700">Smart Virtual Tourism Guide</p>
                                <h4 className="mt-1 text-lg font-black text-slate-900">Sri Lanka</h4>
                            </div>
                        </div>

                        <p className="max-w-sm text-sm text-slate-600">AI-powered travel planning platform design to help you explore Sri Lanka safely, smartly and efficiently.</p>

                        <div className="mt-4 flex items-center gap-3 text-slate-700">
                            <FaFacebookF className="h-5 w-5" />
                            <FaInstagram className="h-5 w-5" />
                            <FaX className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <h5 className="mb-3 font-bold text-slate-800">Quick Links</h5>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>Home</li>
                            <li>Features</li>
                            <li>Destinations</li>
                            <li>How it Works</li>
                            <li>Safety</li>
                        </ul>
                    </div>

                    <div className="md:col-span-1">
                        <h5 className="mb-3 font-bold text-slate-800">Destinations</h5>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>Sigiriya</li>
                            <li>Ella</li>
                            <li>Galle</li>
                            <li>Yala National Park</li>
                            <li>Colombo</li>
                        </ul>
                    </div>

                    <div className="md:col-span-1">
                        <h5 className="mb-3 font-bold text-slate-800">Support</h5>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>Help Center</li>
                            <li>Privacy Policy</li>
                            <li>Terms & Condition</li>
                            <li>FAQ</li>
                        </ul>
                    </div>

                    <div className="md:col-span-1">
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

                <div className="mt-8 border-t border-slate-100 pt-4 text-center text-sm text-slate-500">svgt©2026 all right reserve</div>
            </div>
        </footer>
    )
}

export default Footer
