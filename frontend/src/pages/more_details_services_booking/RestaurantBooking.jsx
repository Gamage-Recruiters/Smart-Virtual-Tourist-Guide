import React from 'react'
import ServiceDetailsCard from "../../components/booking&reservation/bookingSummary/ServiceDetailsCard";
import RestaurantAvailabilityCard from "../../components/booking&reservation/serviceAvailability/RestaurantAvailabilityCard"

const RestaurantBooking = () => {

    return (
        <div className="bg-gray-100 min-h-screen p-6">

            <ServiceDetailsCard //hard coded------------------
                service={{
                    image:
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
                    name: "Ministry of Crab",
                    location: "Dutch Hospital, Colombo",
                    rating: 4.9,
                    reviews: 1250,
                    description:
                        "Award-winning seafood restaurant famous for Sri Lankan crab dishes."
                }} />

            <RestaurantAvailabilityCard />

        </div>
    )


};

export default RestaurantBooking;
