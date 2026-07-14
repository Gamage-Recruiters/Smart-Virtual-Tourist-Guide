import React, { useState, useEffect } from 'react';
import { fetchItinerary } from '../services/itineraryService';

const TripItinerary = ({ touristId, tripId }) => {

    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadItinerary  = async () => {
            try {
                const result = await fetchItinerary(touristId, tripId);
                if (result.success) {
                    setItinerary(result.data.itinerary);
                } else {
                    setError(result.message);
                }
            } catch (err) {
                setError("An error occurred while retrieving data.");
            } finally {
                setLoading(false);
            }
        };

        if (touristId && tripId) {
            loadItinerary ();
        }
    }, [touristId, tripId]);


    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const optionsDay = { weekday: 'long' };

        const datePart = d.toLocaleDateString('en-US', optionsDate);
        const dayPart = d.toLocaleDateString('en-US', optionsDay);
        return `${datePart} - ${dayPart}`;
    };

    if (loading) return <div className="text-center py-10 font-bold">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500 font-bold">Error: {error}</div>;
    if (!itinerary) return <div className="text-center py-10">Data not found.</div>;


    return (
        <section className="bg-white rounded-t-[32px] sm:rounded-t-[48px] rounded-b-none pt-6 px-6 pb-0 sm:pt-10 sm:px-10 md:pt-16 md:px-16 lg:pt-20 lg:px-20 w-full mb-0 !mt-0">

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-12">
                Trip Itinerary Overview
            </h3>

            <div className="relative pl-12 sm:pl-16 space-y-16 pb-2">
                <div className="absolute left-[24px] sm:left-[32px] top-5 bottom-[-55px] w-[1.5px] bg-gray-300" />

                {itinerary.daily_plan.map((dayData) => (
                    <div key={dayData._id || dayData.day} className="relative">
                        <div className="absolute -left-10 sm:-left-12 top-1 w-8 h-8 rounded-full bg-[#E5E5E5] text-gray-600 text-xs sm:text-sm font-bold flex items-center justify-center border-4 border-white z-10">
                            {dayData.day}
                        </div>

                        <div>
    
                            <p className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl leading-tight">
                                {formatDate(dayData.date)}
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
                                {dayData.activities.map((activity) => (
                                    <li key={activity._id} className="flex items-start gap-2 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                                        <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
                                        <span>
                                            {activity.name} {activity.time ? `• ${activity.time}` : ''}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex gap-3 mt-6 flex-wrap">
                                {dayData.images.map((imgSrc, imgIndex) => (
                                    <img
                                        key={imgIndex}
                                        src={imgSrc}
                                        alt=""
                                        className="w-20 sm:w-24 md:w-28 lg:w-32 h-28 sm:h-34 md:h-40 lg:h-46 rounded-[16px] object-cover shadow-sm hover:scale-105 transition-transform duration-300"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};


export default TripItinerary;