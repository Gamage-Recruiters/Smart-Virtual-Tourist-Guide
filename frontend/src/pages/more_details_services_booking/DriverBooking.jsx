import React from 'react'
import ServiceDetailsCard from "../../components/booking&reservation/bookingSummary/ServiceDetailsCard";
import DriverAvailabilityCard from "../../components/booking&reservation/serviceAvailability/DriverAvailabilityCard"

const DriverBooking = () => {
    return (
        <div className="bg-gray-100 min-h-screen p-6 flex justify-center items-start pt-10">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
                <ServiceDetailsCard //hard coded------------------
                    service={{
                        image:
                            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
                        name: "Kasun Perera",
                        location: "Colombo, Sri Lanka",
                        rating: 4.9,
                        reviews: 187,
                        description:
                            "Professional tourist driver with 8+ years of experience and fluent English."
                    }} 
                />

                <DriverAvailabilityCard />
            </div>
        </div>
    )



};

export default DriverBooking;
