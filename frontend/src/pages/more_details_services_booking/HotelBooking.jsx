import React from 'react'
import ServiceDetailsCard from "../../components/booking&reservation/bookingSummary/ServiceDetailsCard";
import HotelAvailabilityCard from "../../components/booking&reservation/serviceAvailability/HotelAvailabilityCard"

const HotelBooking = () => {

    return (
        <div className="bg-gray-100 min-h-screen p-6">

            <ServiceDetailsCard //hard coded------------------
                service={{
                    image:
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
                    name: "Cinnamon Grand Colombo",
                    location: "Colombo, Sri Lanka",
                    rating: 4.8,
                    reviews: 230,
                    description:
                        "Luxury 5-star hotel with ocean view."
                }} />

                <HotelAvailabilityCard/>

        </div>
    )


};

export default HotelBooking;
