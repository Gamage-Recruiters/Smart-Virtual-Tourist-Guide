import React from 'react'
import { useLocation, Navigate, Link } from 'react-router-dom';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ServiceDetailsCard from "../../components/booking&reservation/bookingSummary/ServiceDetailsCard";
import RestaurantAvailabilityCard from "../../components/booking&reservation/serviceAvailability/RestaurantAvailabilityCard"
import { FaArrowLeft } from 'react-icons/fa';

const RestaurantBooking = () => {
    const location = useLocation();
    const restaurant = location.state?.restaurant;

    // Redirect back to restaurants list if no data is passed
    if (!restaurant) {
        return <Navigate to="/restaurants" replace />;
    }

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-grow max-w-[1200px] mx-auto w-full px-6 py-8 mt-20">
                {/* Back Button */}
                <Link to="/restaurants" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm mb-6 transition-colors">
                    <FaArrowLeft className="mr-2" /> Back to Restaurants
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Reserve a Table</h1>
                    <p className="text-gray-500">Select your details and reserve a table at {restaurant.name}.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <ServiceDetailsCard
                            service={{
                                image: restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
                                name: restaurant.name,
                                location: restaurant.location,
                                rating: restaurant.userRating,
                                reviews: restaurant.reviews,
                                description: `Experience the best ${restaurant.cuisine} at ${restaurant.name}, a premium ${restaurant.priceLevel} restaurant.`
                            }} 
                        />
                        
                        {/* Additional Information Section */}
                        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                            <h3 className="font-bold text-lg mb-4 text-gray-800">Restaurant Policies</h3>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                                <li>Reservations are held for 15 minutes past the booking time</li>
                                <li>Smart casual dress code applies</li>
                                <li className="text-green-600 font-semibold">Free cancellation up to 2 hours before reservation time</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Booking availability */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <RestaurantAvailabilityCard />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default RestaurantBooking;
