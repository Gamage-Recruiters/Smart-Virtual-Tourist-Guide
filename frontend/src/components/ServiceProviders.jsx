import React, { useState, useEffect } from 'react';
import { fetchMyBookings } from '../services/bookingService';

const ServiceProviders = ({ userEmail }) => {
    const TABS = ["All", "Drivers", "Hotels", "Guides", "Restaurants", "Activities"];
    
    const [allProviders, setAllProviders] = useState([]);
    const [activeTab, setActiveTab] = useState("All");
    const [visibleCount, setVisibleCount] = useState(8);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProviders = async () => {
            const result = await fetchMyBookings(userEmail);
            if (result.success) {
                const combined = [
                    ...result.data.activities.map(a => ({ ...a.service, category: 'Activities' })),
                    ...result.data.hotels.map(h => ({ ...h.service, category: 'Hotels' })),
                    ...result.data.vehicles.map(v => ({ ...v.service, category: 'Drivers' }))
                ];
                setAllProviders(combined);
            }
            setLoading(false);
        };
        loadProviders();
    }, [userEmail]);

    const filteredProviders = activeTab === "All"
        ? allProviders
        : allProviders.filter(p => p.category === activeTab);

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
                            onClick={() => { setActiveTab(tab); setVisibleCount(8); }}
                            className={`relative text-xs sm:text-sm font-bold tracking-wide pb-1 transition-colors ${activeTab === tab ? "text-[#1E50FF]" : "text-gray-500 hover:text-[#1E50FF]"}`}
                        >
                            {tab}
                            {activeTab === tab && <div className="absolute bottom-[-14px] left-0 right-0 h-[3px] bg-[#1E50FF] rounded-full" />}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading Providers...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                    {filteredProviders.slice(0, visibleCount).map((p, i) => (
                        <div key={i} className="bg-gradient-to-b from-white to-[#BCE2FF] rounded-[24px] p-6 flex flex-col items-center text-center gap-4 shadow-sm border border-[#A2D5FF]/20 hover:shadow-md transition-all duration-300">
                            <img src={p.image} alt={p.name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-sm" />
                            <div className="flex flex-col items-center gap-2 flex-grow">
                                <p className="font-extrabold text-[#1C2C3F] text-base sm:text-[17px] leading-tight max-w-[200px]">{p.name}</p>
                                <span className="bg-[#1E50FF] text-white text-[10px] sm:text-xs font-bold px-4 py-1 rounded-full shadow-sm">{p.type}</span>
                                <div className="flex items-center gap-1 mt-1 justify-center">
                                    <div className="flex text-amber-400 text-sm leading-none"><span>★</span></div>
                                    <span className="text-xs sm:text-[13px] font-bold text-gray-500 ml-1">{p.rating}/5.0</span>
                                </div>
                                <p className="text-xs text-gray-500 font-medium max-w-[200px] leading-relaxed mt-1">{p.description}</p>
                            </div>
                            <button className="w-full py-2.5 bg-[#1E50FF] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all mt-auto">
                                Contact
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {filteredProviders.length > visibleCount && (
                <div className="flex justify-center mt-12">
                    <button onClick={() => setVisibleCount(prev => prev + 3)} className="px-10 py-2.5 bg-gradient-to-b from-white to-[#BCE2FF] text-[#1C2C3F] text-xs sm:text-sm font-bold rounded-2xl shadow-sm border border-[#A2D5FF]/30 hover:brightness-95 transition-all">
                        Show More
                    </button>
                </div>
            )}
        </section>
    );
}

export default ServiceProviders;