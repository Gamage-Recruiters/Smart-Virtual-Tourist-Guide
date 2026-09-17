import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import ServiceDetailsCard from "../../components/booking&reservation/bookingSummary/ServiceDetailsCard";
import DriverAvailabilityCard from "../../components/booking&reservation/serviceAvailability/DriverAvailabilityCard";
import { FaArrowLeft } from 'react-icons/fa';

const DriverBooking = () => {
    const location = useLocation();
    const driver = location.state?.driver;

    // Fallback if no driver was passed via router state
    const displayDriver = driver || {
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        name: "Kasun Perera",
        location: "Colombo, Sri Lanka",
        rating: 4.9,
        reviews: 187,
        description: "Professional tourist driver with 8+ years of experience and fluent English.",
        price: 15000
    };

    const serviceData = {
        image: displayDriver.image,
        name: displayDriver.name || displayDriver.title || "Professional Driver",
        location: displayDriver.location || "Colombo, Sri Lanka",
        rating: displayDriver.rating || 4.9,
        reviews: displayDriver.reviews || 187,
        description: displayDriver.description || "Professional tourist driver with extensive local knowledge and fluent English."
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <main className="flex-grow max-w-[1200px] mx-auto w-full px-6 py-8">
                {/* Back Button */}
                <Link to="/dashboard-Tourist/marketplace" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm mb-6 transition-colors">
                    <FaArrowLeft className="mr-2" /> Back to Marketplace
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Book Your Driver</h1>
                    <p className="text-gray-500">Check availability and reserve a professional driver for your journey.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <ServiceDetailsCard service={serviceData} />
                        
                        {/* Additional Information Section */}
                        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                            <h3 className="font-bold text-lg mb-4 text-gray-800">Driver Features & Guidelines</h3>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                                <li>Experienced & licensed professional tourist driver</li>
                                <li>Clean, air-conditioned comfortable vehicle provided</li>
                                <li className="text-green-600 font-semibold">Free cancellation up to 24 hours before pickup</li>
                                <li>Fuel, insurance, and parking fees included</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Booking availability */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <DriverAvailabilityCard driver={displayDriver} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DriverBooking;
