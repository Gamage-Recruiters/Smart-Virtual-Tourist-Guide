import React from 'react'
import ServiceDetailsCard from "../../components/booking&reservation/bookingSummary/ServiceDetailsCard";
import GuideAvailabilityCard from "../../components/booking&reservation/serviceAvailability/GuideAvailabilityCard"

const GuideBooking = () => {

    return (
        <div className="bg-gray-100 min-h-screen p-6">

            <ServiceDetailsCard //hard coded------------------
                service={{
                    image:
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
                    name: "Nadeesha Silva",
                    location: "Kandy, Sri Lanka",
                    rating: 4.8,
                    reviews: 142,
                    description:
                        "Licensed cultural and heritage guide specializing in Kandy and Central Province tours."
                }} />

            <GuideAvailabilityCard />

        </div>
    )


};

export default GuideBooking;
