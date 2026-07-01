import React, { useState, useEffect } from 'react';
import { fetchIncidentCount } from '../services/incidentService';

const HealthSafetyLog = ({ touristId }) => {

    const [incidentCount, setIncidentCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCount = async () => {
            if (!touristId) return;

            try {

                const result = await fetchIncidentCount(touristId);
                if (result.success) {
                    setIncidentCount(result.count); 
                }
            } catch (error) {
                console.error("Failed to load incident count:", error);
            } finally {
                setLoading(false);
            }
        };

        getCount();
    }, [touristId]);

    const medicalCheckpoints = [
        "Pre-departure health screening - March 14",
        "Travel clinic consultation - March 10"
    ];

    const vaccinations = [
        "COVID-19 - Updated March 1",
        "Hepatitis A - February 15",
        "Typhoid - February 15"
    ];

    const emergencyContacts = [
        "Heavy rain warning - March 19",
        "High heat advisory - March 17"
    ];

    return (
        <section className="bg-white rounded-t-none rounded-b-none sm:rounded-b-none pt-6 px-6 pb-0 sm:pt-10 sm:px-10 md:pt-16 md:px-16 lg:pt-20 lg:px-20 w-full mb-0 !mt-0">

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-3">
                Health & Safety Log
            </h3>

            <div className="inline-flex items-center gap-2.5 bg-gradient-to-b from-white to-[#BCE4FC] text-[#2ECC71] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-xl border border-[#A2D5FF]/30 shadow-sm mb-10">
                <span>✅</span>
                <span className="text-[#2ECC71] font-black">All Clear</span>
                <span className="text-[#27AE60] font-semibold">No incidents reported</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-12 sm:gap-x-16 lg:gap-x-24">

                <div>
                    <h4 className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl mb-4">
                        Medical checkpoints visited
                    </h4>
                    <ul className="space-y-3">
                        {medicalCheckpoints.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base md:text-lg text-gray-700 font-medium">
                                <span className="flex-shrink-0 mt-0.5">✅</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl mb-4">
                        Vaccinations verified
                    </h4>
                    <ul className="space-y-3">
                        {vaccinations.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base md:text-lg text-gray-700 font-medium">
                                <span className="flex-shrink-0 mt-0.5">✅</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl mb-4">
                        Emergency contacts used
                    </h4>
                    <ul className="space-y-3">
                        {emergencyContacts.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base md:text-lg text-gray-700 font-medium">
                                <span className="flex-shrink-0 mt-0.5">⛔</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl mb-4">
                        Insurance
                    </h4>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium leading-relaxed pl-1">
                        <span>{loading ? "Loading..." : `${incidentCount} incidents`}</span> 
                    </p>
                </div>

            </div>
        </section>
    );
}

export default HealthSafetyLog;