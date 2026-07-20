import { useEffect, useState, useCallback } from 'react';

// ── Date formatter (Step 2: nicer format matching Figma) ──────────────────
// e.g. "June 17, 2026 - Tuesday"
const formatDate = (dateStr, dayNum) => {
    if (!dateStr) return `Day ${dayNum}`;
    const d = new Date(dateStr);
    const datePart = d.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    const dayPart = d.toLocaleDateString('en-US', { weekday: 'long' });
    return `${datePart} - ${dayPart}`;
};

const TripItinerary = ({ itineraryId }) => {

    const [itineraryData, setItineraryData] = useState([]);
    const [loading, setLoading]             = useState(false);
    const [error, setError]                 = useState(null);

    // ── Fetch itinerary from AI Itinerary Engine API ──────────────────────
    const loadItinerary = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:5000/api/itinerary/${itineraryId}`, {
                method:  'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            // Step 1: Check HTTP status (404, 500, etc.)
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || `Server error: ${response.status}`);
            }

            const data = await response.json();

            // Step 2: Check backend logical status
            if (data.status === 'error') {
                throw new Error(data.message || 'Failed to load itinerary.');
            }

            // Step 3: Check data shape
            if (!data.itinerary || !data.itinerary.daily_plan) {
                throw new Error('Itinerary data is missing or incomplete.');
            }

            // Step 4: Check empty plan
            if (data.itinerary.daily_plan.length === 0) {
                setItineraryData([]);
                return;
            }

            // Step 5: Map to UI format
            const mapped = data.itinerary.daily_plan.map((day) => ({
                day:      day.day,
                date:     formatDate(day.date, day.day),
                location: day.location || 'Sri Lanka',
                items:    day.activities
                            ? day.activities.map((a) => `${a.name}${a.time ? ` • ${a.time}` : ''}`)
                            : [],
                images:   day.images || [],
            }));

            setItineraryData(mapped);

        } catch (err) {
            // Show actual backend error message if available, otherwise generic
            setError(err.message || 'Failed to load itinerary. Please try again.');
            console.error('Error loading itinerary:', err);
        } finally {
            setLoading(false);
        }
    }, [itineraryId]);

    useEffect(() => {
        if (itineraryId) {
            loadItinerary();
        }
    }, [itineraryId, loadItinerary]);

    // ── Shared section wrapper ─────────────────────────────────────────────
    const SectionWrapper = ({ children }) => (
        <section className="bg-white rounded-t-[32px] sm:rounded-t-[48px] rounded-b-none pt-6 px-6 pb-0 sm:pt-10 sm:px-10 md:pt-16 md:px-16 lg:pt-20 lg:px-20 w-full mb-0 !mt-0">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-12">
                Trip Itinerary Overview
            </h3>
            {children}
        </section>
    );

    // ── Loading state ──────────────────────────────────────────────────────
    if (loading) {
        return (
            <SectionWrapper>
                <p className="text-gray-500">Loading itinerary...</p>
            </SectionWrapper>
        );
    }

    // ── Error state (with retry button) ───────────────────────────────────
    if (error) {
        return (
            <SectionWrapper>
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={loadItinerary}
                    className="px-4 py-2 bg-[#111111] text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                    Try Again
                </button>
            </SectionWrapper>
        );
    }

    // ── Empty state ────────────────────────────────────────────────────────
    if (itineraryData.length === 0) {
        return (
            <SectionWrapper>
                <p className="text-gray-400">No itinerary planned yet.</p>
            </SectionWrapper>
        );
    }

    // ── Main render ────────────────────────────────────────────────────────
    return (
        <section className="bg-white rounded-t-[32px] sm:rounded-t-[48px] rounded-b-none pt-6 px-6 pb-0 sm:pt-10 sm:px-10 md:pt-16 md:px-16 lg:pt-20 lg:px-20 w-full mb-0 !mt-0">

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-12">
                Trip Itinerary Overview
            </h3>

            <div className="relative pl-12 sm:pl-16 space-y-16 pb-2">
                <div className="absolute left-[24px] sm:left-[32px] top-5 bottom-[-55px] w-[1.5px] bg-gray-300" />

                {itineraryData.map((dayData) => (
                    <div key={dayData.day} className="relative">
                        <div className="absolute -left-10 sm:-left-12 top-1 w-8 h-8 rounded-full bg-[#E5E5E5] text-gray-600 text-xs sm:text-sm font-bold flex items-center justify-center border-4 border-white z-10">
                            {dayData.day}
                        </div>

                        <div>
                            <p className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl leading-tight">
                                {dayData.date}
                            </p>

                            <div className="flex items-center gap-1.5 mt-2 mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2.5"
                                    stroke="currentColor"
                                    className="w-4 h-4 text-gray-500"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                                <span className="font-bold text-gray-800 text-sm sm:text-base md:text-lg">
                                    {dayData.location}
                                </span>
                            </div>

                            <ul className="space-y-2.5">
                                {dayData.items.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                                        <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* 4-image row matching Figma layout */}
                            {dayData.images && dayData.images.length > 0 && (
                                <div className="flex gap-3 mt-6">
                                    {dayData.images.map((imgSrc, imgIndex) => (
                                        <img
                                            key={imgIndex}
                                            src={imgSrc}
                                            alt={`${dayData.location} photo ${imgIndex + 1}`}
                                            loading="lazy"
                                            className="w-20 sm:w-24 md:w-28 lg:w-32 h-28 sm:h-34 md:h-40 lg:h-46 rounded-[16px] object-cover shadow-sm hover:scale-105 transition-transform duration-300"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TripItinerary;