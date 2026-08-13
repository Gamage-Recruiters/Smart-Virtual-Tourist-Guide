import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ServiceDetailsCard from "../../components/booking&reservation/bookingSummary/ServiceDetailsCard";
import DriverAvailabilityCard from "../../components/booking&reservation/serviceAvailability/DriverAvailabilityCard"

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const DriverBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const driver = location.state?.driver;

    if (!driver) {
        return (
            <div className="bg-gray-100 min-h-screen p-6 flex flex-col items-center justify-center">
                <p>Driver not found.</p>
                <button onClick={() => navigate('/drivers')} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Go Back</button>
            </div>
        );
    }

    const serviceData = {
        image: driver.image,
        name: driver.driverName || driver.name,
        location: "Sri Lanka",
        rating: driver.rating || 4.9,
        reviews: Math.floor(Math.random() * 200) + 50,
        description: driver.title || "Professional driver"
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-grow max-w-[1200px] mx-auto w-full px-6 py-8 mt-20">
                <Link to="/drivers" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm mb-6 transition-colors">
                    <FaArrowLeft className="mr-2" /> Back to Drivers
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Book Your Driver</h1>
                    <p className="text-gray-500">Check availability and secure your trip with {serviceData.name}.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <ServiceDetailsCard service={serviceData} />
                        
                        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                            <h3 className="font-bold text-lg mb-4 text-gray-800">What to Expect</h3>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                                <li>Instant confirmation upon booking</li>
                                <li>Experienced and verified drivers</li>
                                <li>Comfortable and safe journey</li>
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <DriverAvailabilityCard driver={driver} serviceData={serviceData} />
                        </div> 
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DriverBooking;
