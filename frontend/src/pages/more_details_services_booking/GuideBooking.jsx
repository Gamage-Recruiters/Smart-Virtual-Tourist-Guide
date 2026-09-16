import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import ServiceDetailsCard from "../../components/booking&reservation/bookingSummary/ServiceDetailsCard";
import GuideAvailabilityCard from "../../components/booking&reservation/serviceAvailability/GuideAvailabilityCard";
import { FaArrowLeft } from 'react-icons/fa';

const GuideBooking = () => {
    const location = useLocation();
    const guide = location.state?.guide;

    // Fallback if no guide was passed via router state
    const displayGuide = guide || {
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        name: "Nadeesha Silva",
        location: "Kandy, Sri Lanka",
        rating: 4.8,
        reviews: 142,
        description: "Licensed cultural and heritage guide specializing in Kandy and Central Province tours.",
        price: 15000
    };

    const serviceData = {
        image: displayGuide.image,
        name: displayGuide.name || displayGuide.title || "Licensed Tour Guide",
        location: displayGuide.location || "Kandy, Sri Lanka",
        rating: displayGuide.rating || 4.8,
        reviews: displayGuide.reviews || 142,
        description: displayGuide.description || "Licensed cultural and heritage guide specializing in Sri Lanka tours."
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <main className="flex-grow max-w-[1200px] mx-auto w-full px-6 py-8">
                {/* Back Button */}
                <Link to="/dashboard-Tourist/marketplace" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm mb-6 transition-colors">
                    <FaArrowLeft className="mr-2" /> Back to Marketplace
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Book Your Tour Guide</h1>
                    <p className="text-gray-500">Check availability and hire an expert local guide for your journey.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <ServiceDetailsCard service={serviceData} />
                        
                        {/* Additional Information Section */}
                        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                            <h3 className="font-bold text-lg mb-4 text-gray-800">Guide Features & Information</h3>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                                <li>Certified & licensed tourist guide</li>
                                <li>Fluent in English & local languages</li>
                                <li className="text-green-600 font-semibold">Free cancellation up to 24 hours before tour</li>
                                <li>Customizable itinerary available upon request</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Booking availability */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <GuideAvailabilityCard guide={displayGuide} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GuideBooking;
