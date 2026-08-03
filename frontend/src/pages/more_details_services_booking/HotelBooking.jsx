import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ServiceDetailsCard from "../../components/booking&reservation/bookingSummary/ServiceDetailsCard";
import HotelAvailabilityCard from "../../components/booking&reservation/serviceAvailability/HotelAvailabilityCard";
import { FaArrowLeft } from 'react-icons/fa';

const HotelBooking = () => {
    const location = useLocation();
    const hotel = location.state?.hotel;

    // Fallback if no hotel was passed via state
    const displayHotel = hotel || {
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        name: "Cinnamon Grand Colombo",
        location: "Colombo, Sri Lanka",
        rating: 4.8,
        reviews: 230,
        description: "Luxury 5-star hotel with ocean view.",
        price: '30,000'
    };

    const serviceData = {
        image: displayHotel.image,
        name: displayHotel.name,
        location: displayHotel.location || "Sri Lanka",
        rating: displayHotel.rating || displayHotel.userRating || 4.5,
        reviews: displayHotel.reviews || 100,
        description: displayHotel.description || "A wonderful place to stay with great amenities."
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-grow max-w-[1200px] mx-auto w-full px-6 py-8 mt-20">
                {/* Back Button */}
                <Link to="/hotels" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm mb-6 transition-colors">
                    <FaArrowLeft className="mr-2" /> Back to Hotels
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Book Your Stay</h1>
                    <p className="text-gray-500">Select dates and reserve your room at {serviceData.name}.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <ServiceDetailsCard service={serviceData} />
                        
                        {/* Additional Information Section */}
                        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                            <h3 className="font-bold text-lg mb-4 text-gray-800">Hotel Policies</h3>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                                <li>Check-in time starts at 2:00 PM</li>
                                <li>Check-out time is 12:00 PM (Noon)</li>
                                <li className="text-green-600 font-semibold">Free cancellation up to 48 hours before check-in</li>
                                <li>Pets are not allowed</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Booking availability */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <HotelAvailabilityCard hotel={displayHotel} />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HotelBooking;
