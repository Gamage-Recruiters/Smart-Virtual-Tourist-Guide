import React, { useState, useEffect } from 'react';
import { fetchIncidentCount, fetchVaccinations, fetchIncidents } from '../services/healthService';

const HealthSafetyLog = ({ touristId }) => {

    const [incidentCount, setIncidentCount] = useState(0);
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [incidents, setIncidents] = useState([]);

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

        const loadVaccines = async () => {
            const result = await fetchVaccinations(touristId);
            if (result.success) setVaccines(result.vaccinations);
        };

        const loadIncidents = async () => {
            const result = await fetchIncidents(touristId);
            if (result.success) setIncidents(result.data);
        };

        if (touristId) {
            loadIncidents();
            loadVaccines();
            getCount();
        }

    }, [touristId]);

    return (
        <section className="bg-white rounded-t-none rounded-b-none sm:rounded-b-none pt-6 px-6 pb-0 sm:pt-10 sm:px-10 md:pt-16 md:px-16 lg:pt-20 lg:px-20 w-full mb-0 !mt-0">

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-3">
                Health & Safety Log
            </h3>

            <div className={`inline-flex items-center gap-2.5 bg-gradient-to-b from-white to-[#BCE4FC] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-xl border shadow-sm mb-10 ${incidentCount > 0 ? 'text-red-500 border-red-200' : 'text-[#2ECC71] border-[#A2D5FF]/30'}`}>
                <span>{incidentCount > 0 ? "⚠️" : "✅"}</span>
                <span className="font-black">
                    {incidentCount > 0 ? `${incidentCount} Incidents` : "All Clear"}
                </span>
                <span className="font-semibold">
                    {incidentCount > 0 ? "reported" : "No incidents reported"}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-12 sm:gap-x-16 lg:gap-x-24">

                <div>
                    <h4 className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl mb-4">
                        Vaccinations verified
                    </h4>
                    <ul className="space-y-3">
                        {vaccines.length > 0 ? (
                            vaccines.map((v, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base md:text-lg text-gray-700 font-medium">
                                    <span className="flex-shrink-0 mt-0.5">✅</span>
                                    <span>{v.name}</span>
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-500 italic">No vaccinations verified.</li>
                        )}
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl mb-4">
                        Emergency incidents reported
                    </h4>
                    {incidents.length > 0 ? (
                        <ul className="space-y-3">
                            {incidents.map((inc, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base md:text-lg text-gray-700 font-medium">
                                    <span className="flex-shrink-0 mt-0.5">⚠️</span>
                                    <span>{inc.incidentCategory} - {inc.incidentDate}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex items-center gap-2 text-[#2ECC71] bg-green-50 px-4 py-3 rounded-xl border border-green-200">
                            <span>✅</span>
                            <span className="font-bold">No medical incidents reported during the trip</span>
                        </div>
                    )}
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