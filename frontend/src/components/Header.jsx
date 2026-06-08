import React, { useState } from 'react';
import LOGO_SRC from './../assets/SriLanka.png';
import FLAG_SRC from './../assets/srilankanflag.jpg';

const Header = (props) => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { label: 'Home', href: '#' },
        { label: 'Features', href: '#' },
        { label: 'Destinations', href: '#' },
        { label: 'How it Works', href: '#' },
        { label: 'Contact', href: '#' }
    ];

    return (
        <header className="sticky top-0 h-24 z-50 w-full bg-white border-b border-gray-100 font-sans">

            <div className="w-full px-2 sm:px-4 md:px-6 flex justify-between items-center h-full relative">

                <div
                    className="
                        absolute top-[12px] left-3
                        w-[100px] h-[100px]
                        md:top-[12px] md:left-6
                        md:w-[110px] md:h-[130px]
                        bg-white rounded-full 
                        flex items-center justify-center p-1
                    "
                >
                    <img
                        src={LOGO_SRC}
                        alt="SVT Logo"
                        className="w-full h-full object-cover rounded-full"
                        onError={e => { e.target.src = "https://placehold.co/120x120/1E50FF/white?text=SVT"; }}
                    />
                </div>

                <div className="pl-[102px] md:pl-[135px] flex flex-col justify-center select-none whitespace-nowrap z-10">
                    <span className="text-[#0044BB] text-[11px] md:text-[14px] font-semibold block leading-tight tracking-normal">
                        Smart Virtual Tourism Guide
                    </span>

                    <span
                        className="font-bold text-xl md:text-3xl tracking-[0.22em] leading-none inline-block bg-clip-text text-transparent select-none mt-1.5"
                        style={{
                            color: "#CE1126",
                            backgroundImage: `url(${FLAG_SRC})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Sri Lanka
                    </span>
                </div>

                <nav className="hidden lg:flex items-center gap-x-6 xl:gap-x-10 mx-4">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-gray-700 hover:text-[#0066FF] text-[15px] md:text-[16px] font-semibold transition-colors duration-200"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-4 z-10">
                    <a
                        href="#signin"
                        className="hidden sm:inline-flex items-center justify-center bg-[#0066FF] hover:bg-[#0055DD] text-white font-medium text-[15px] px-6 py-2.5 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                        Sign in
                    </a>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 rounded-md text-gray-600 hover:text-[#0066FF] hover:bg-gray-50 focus:outline-none transition-colors"
                        aria-label="Toggle navigation menu"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="absolute top-24 left-0 w-full bg-white border-b border-gray-200 shadow-xl lg:hidden z-40 transition-all duration-300 ease-in-out">
                    <div className="px-4 pt-4 pb-6 space-y-2 flex flex-col">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-[#0066FF] hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="pt-4 border-t border-gray-100 sm:hidden">
                            <a
                                href="#signin"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full flex items-center justify-center bg-[#0066FF] text-white font-medium text-base py-3 rounded-lg"
                            >
                                Sign in
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;