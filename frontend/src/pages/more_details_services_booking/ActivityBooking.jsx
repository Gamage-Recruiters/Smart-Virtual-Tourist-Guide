import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ServiceDetailsCard from "../../components/booking&reservation/bookingSummary/ServiceDetailsCard";
import ActivityAvailabilityCard from "../../components/booking&reservation/serviceAvailability/ActivityAvailabilityCard";
import { FaArrowLeft } from 'react-icons/fa';

const ActivityBooking = () => {
    const location = useLocation();
    const activity = location.state?.activity;

    // Fallback if no activity was passed via state
    const displayActivity = activity || {
        image: "https://images.unsplash.com/photo-1549366021-9f761d040a94",
        name: "Yala Safari Adventure",
        title: "Yala Safari Adventure", // Map title to name
        location: "Yala National Park",
        rating: 4.9,
        reviews: 315,
        description: "Full-day safari experience with experienced guides and luxury jeep transport.",
        price: 50
    };

    // ServiceDetailsCard expects 'name', but Activities_Card gives 'title'. Let's normalize it.
    const serviceData = {
        image: displayActivity.image,
        name: displayActivity.title || displayActivity.name,
        location: displayActivity.location,
        rating: displayActivity.rating,
        reviews: displayActivity.reviews,
        description: displayActivity.category ? `Category: ${displayActivity.category}. ${displayActivity.duration} duration.` : displayActivity.description
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-grow max-w-[1200px] mx-auto w-full px-6 py-8 mt-20">
                {/* Back Button */}
                <Link to="/activities" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm mb-6 transition-colors">
                    <FaArrowLeft className="mr-2" /> Back to Activities
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Book Your Activity</h1>
                    <p className="text-gray-500">Check availability and secure your spot for {serviceData.name}.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <ServiceDetailsCard service={serviceData} />
                        
                        {/* Additional Information Section */}
                        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                            <h3 className="font-bold text-lg mb-4 text-gray-800">What to Expect</h3>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                                <li>Instant confirmation upon booking</li>
                                <li>Mobile or printed voucher accepted</li>
                                {displayActivity.hasFreeCancellation && (
                                    <li className="text-green-600 font-semibold">Free cancellation available</li>
                                )}
                                <li>{displayActivity.duration || 'Flexible duration'}</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Booking availability */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <ActivityAvailabilityCard activity={displayActivity} />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ActivityBooking;
