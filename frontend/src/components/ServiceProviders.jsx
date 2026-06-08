import { useState } from "react";
import PERSON from './../assets/person.jpg';

const ServiceProviders = () => {

    const TABS = ["All", "Drivers", "Hotels", "Guides", "Restaurants", "Activities"];


    const providers = [
        {
            name: "Ministry of Crab",
            role: "Restaurant",
            category: "Restaurants",
            rating: "4.9/5.0",
            desc: "Fine dining, Seafood specialties",
            img: PERSON
        },
        {
            name: "Blue Whale Tours",
            role: "Tours & Activities",
            category: "Activities",
            rating: "4.9/5.0",
            desc: "Whale watching & boat safaris",
            img: PERSON
        },
        {
            name: "Sampath Guide Services",
            role: "Tour Guide",
            category: "Guides",
            rating: "4.9/5.0",
            desc: "Cultural tours, Historical site guidance",
            img: PERSON
        },
        {
            name: "Ella Mount Heaven",
            role: "Accommodation",
            category: "Hotels",
            rating: "4.9/5.0",
            desc: "Boutique guesthouse, Mountain views",
            img: PERSON
        },
        {
            name: "Sri Lanka Railways",
            role: "Transportation",
            category: "Drivers",
            rating: "4.6/5.0",
            desc: "Scenic train journeys",
            img: PERSON
        },
        {
            name: "Quick Cabs Airport Service",
            role: "Transportation",
            category: "Drivers",
            rating: "4.9/5.0",
            desc: "24/7 airport transfers, City taxis",
            img: PERSON
        },
        {
            name: "Lanka Tours & Travels",
            role: "Transportation",
            category: "Drivers",
            rating: "4.9/5.0",
            desc: "Airport transfer, Private car rentals",
            img: PERSON
        },
        {
            name: "Cinnamon Hotels & Resorts",
            role: "Accommodation",
            category: "Hotels",
            rating: "4.9/5.0",
            desc: "Luxury hotels, Full-board packages",
            img: PERSON
        },
        {
            name: "Wild Safaris Lanka",
            role: "Tours & Activities",
            category: "Activities",
            rating: "4.9/5.0",
            desc: "Wildlife safaris, Nature tours",
            img: PERSON
        }
    ];


    const PARTNERS = [
        { img: "https://placehold.co/80x80/c5e8d5/333?text=SP", name: "Shan Perera", role: "Driver", rating: 4.9, reviews: 127 },
        { img: "https://placehold.co/80x80/b5d5f5/333?text=BW", name: "Blue Wave Tours", role: "Hotel", rating: 4.8, reviews: 89 },
        { img: "https://placehold.co/80x80/f0d5b5/333?text=SG", name: "Saman Gunawardena", role: "Guide", rating: 5.0, reviews: 203 },
        { img: "https://placehold.co/80x80/d5e8c5/333?text=PK", name: "Priya's Kitchen", role: "Restaurant", rating: 4.7, reviews: 64 },
        { img: "https://placehold.co/80x80/e8c5d5/333?text=CJ", name: "Chamath Jayawardena", role: "Driver", rating: 4.9, reviews: 98 },
        { img: "https://placehold.co/80x80/c5e8e8/333?text=KL", name: "Kandy Lake Resort", role: "Hotel", rating: 4.6, reviews: 145 },
        { img: "https://placehold.co/80x80/e8e8c5/333?text=DF", name: "Dilshan Fernando", role: "Guide", rating: 4.8, reviews: 77 },
        { img: "https://placehold.co/80x80/d5c5d5/333?text=LT", name: "Lanka Tastes & Treats", role: "Restaurant", rating: 4.9, reviews: 212 },
        { img: "https://placehold.co/80x80/c5d5c5/333?text=EA", name: "Exploration Activities SL", role: "Activities", rating: 4.7, reviews: 56 },
    ];

    // States
    const [activeTab, setActiveTab] = useState("All");
    const [visibleCount, setVisibleCount] = useState(8);

    // Filter Logic
    const filteredProviders = activeTab === "All"
        ? providers
        : providers.filter(p => p.category === activeTab);

    // Show More click handler
    const handleShowMore = () => {
        setVisibleCount(prev => prev + 3);
    };

    const visible = activeTab === "All"
        ? PARTNERS
        : PARTNERS.filter(p => TABS[p.role] === activeTab || p.role === activeTab);

    return (
        <section className="bg-white rounded-t-none rounded-b-none sm:rounded-b-none pt-6 px-6 pb-0 sm:pt-10 sm:px-10 md:pt-16 md:px-16 lg:pt-20 lg:px-20 w-full mb-0 !mt-0">

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-8">
                Service Providers & Partners
            </h3>

            <div className="w-full border-b border-gray-200 mb-10 overflow-x-auto scrollbar-hide">
                <div className="flex gap-6 sm:gap-8 min-w-[500px] pb-3">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                setVisibleCount(8);
                            }}
                            className={`relative text-xs sm:text-sm font-bold tracking-wide pb-1 transition-colors ${activeTab === tab ? "text-[#1E50FF]" : "text-gray-500 hover:text-[#1E50FF]"
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-[-14px] left-0 right-0 h-[3px] bg-[#1E50FF] rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {filteredProviders.slice(0, visibleCount).map((p, i) => (
                    <div
                        key={i}
                        className="bg-gradient-to-b from-white to-[#BCE2FF] rounded-[24px] p-6 flex flex-col items-center text-center gap-4 shadow-sm border border-[#A2D5FF]/20 hover:shadow-md transition-all duration-300"
                    >
                        <img
                            src={p.img}
                            alt={p.name}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-sm"
                        />

                        <div className="flex flex-col items-center gap-2 flex-grow">
                            {/* Provider Name */}
                            <p className="font-extrabold text-[#1C2C3F] text-base sm:text-[17px] leading-tight max-w-[200px]">
                                {p.name}
                            </p>

                            <span className="bg-[#1E50FF] text-white text-[10px] sm:text-xs font-bold px-4 py-1 rounded-full shadow-sm">
                                {p.role}
                            </span>

                            <div className="flex items-center gap-1 mt-1 justify-center">
                                <div className="flex text-amber-400 text-sm leading-none">
                                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                </div>
                                <span className="text-xs sm:text-[13px] font-bold text-gray-500 ml-1">
                                    {p.rating}
                                </span>
                            </div>

                            <p className="text-xs text-gray-500 font-medium max-w-[200px] leading-relaxed mt-1">
                                {p.desc}
                            </p>
                        </div>

                        <button className="w-full py-2.5 bg-[#1E50FF] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all mt-auto">
                            Contact
                        </button>
                    </div>
                ))}
            </div>

            {/* Show More Button Container */}
            {filteredProviders.length > visibleCount && (
                <div className="flex justify-center mt-12">
                    <button
                        onClick={handleShowMore}
                        className="px-10 py-2.5 bg-gradient-to-b from-white to-[#BCE2FF] text-[#1C2C3F] text-xs sm:text-sm font-bold rounded-2xl shadow-sm border border-[#A2D5FF]/30 hover:brightness-95 transition-all duration-300"
                    >
                        Show More
                    </button>
                </div>
            )}
        </section>
    );
}

export default ServiceProviders;