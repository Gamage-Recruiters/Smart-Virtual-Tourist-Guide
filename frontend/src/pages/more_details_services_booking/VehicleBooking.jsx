import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ServiceDetailsCard from "../../components/booking&reservation/bookingSummary/ServiceDetailsCard";
import VehicleAvailabilityCard from "../../components/booking&reservation/serviceAvailability/VehicleRentalAvailabilityCard";
import { FaArrowLeft } from 'react-icons/fa';

const VehicleBooking = () => {
    const location = useLocation();
    const vehicle = location.state?.vehicle;

    // Fallback if no vehicle was passed via state
    const displayVehicle = vehicle || {
        image: "https://images.unsplash.com/photo-1550355291-bbee04a92027",
        name: "Toyota Prius Hybrid",
        location: "Negombo, Sri Lanka",
        rating: 4.7,
        reviews: 96,
        description: "Fuel-efficient hybrid vehicle with automatic transmission and air conditioning.",
        price: '5,000'
    };

    const serviceData = {
        image: displayVehicle.image,
        name: displayVehicle.name,
        location: displayVehicle.location || "Island-wide",
        rating: displayVehicle.rating || 4.5,
        reviews: displayVehicle.reviews || 120,
        description: displayVehicle.description || `${displayVehicle.type} vehicle with ${displayVehicle.seats}.`
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-grow max-w-[1200px] mx-auto w-full px-6 py-8 mt-20">
                {/* Back Button */}
                <Link to="/vehicles" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm mb-6 transition-colors">
                    <FaArrowLeft className="mr-2" /> Back to Vehicles
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Book Your Vehicle</h1>
                    <p className="text-gray-500">Select dates and reserve {serviceData.name} for your trip.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <ServiceDetailsCard service={serviceData} />
                        
                        {/* Additional Information Section */}
                        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                            <h3 className="font-bold text-lg mb-4 text-gray-800">Rental Requirements</h3>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                                <li>Valid driving license required at pickup</li>
                                <li>Refundable security deposit may apply</li>
                                <li className="text-green-600 font-semibold">24/7 Roadside Assistance included</li>
                                <li>Insurance covered in total price</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Booking availability */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <VehicleAvailabilityCard vehicle={displayVehicle} />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default VehicleBooking;
