import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ServiceDetailsCard from "../../components/booking&reservation/bookingSummary/ServiceDetailsCard";
import GuideAvailabilityCard from "../../components/booking&reservation/serviceAvailability/GuideAvailabilityCard"

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const GuideBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const guide = location.state?.guide;

    if (!guide) {
        return (
            <div className="bg-gray-100 min-h-screen p-6 flex flex-col items-center justify-center">
                <p>Guide not found.</p>
                <button onClick={() => navigate('/guides')} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Go Back</button>
            </div>
        );
    }

    const serviceData = {
        image: guide.image,
        name: guide.name,
        location: "Sri Lanka",
        rating: guide.rating || 4.8,
        reviews: Math.floor(Math.random() * 200) + 50,
        description: guide.title || "Professional tourist guide"
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-grow max-w-[1200px] mx-auto w-full px-6 py-8 mt-20">
                <Link to="/guides" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm mb-6 transition-colors">
                    <FaArrowLeft className="mr-2" /> Back to Guides
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Hire Your Guide</h1>
                    <p className="text-gray-500">Check availability and secure your tour with {serviceData.name}.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <ServiceDetailsCard service={serviceData} />
                        
                        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                            <h3 className="font-bold text-lg mb-4 text-gray-800">What to Expect</h3>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                                <li>Instant confirmation upon booking</li>
                                <li>Licensed and knowledgeable guides</li>
                                <li>Deep local insights and history</li>
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <GuideAvailabilityCard guide={guide} serviceData={serviceData} />
                        </div> 
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default GuideBooking;
