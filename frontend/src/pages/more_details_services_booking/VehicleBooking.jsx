import React from 'react'
import ServiceDetailsCard from "../../components/booking&reservation/bookingSummary/ServiceDetailsCard";
import VehicleAvailabilityCard from "../../components/booking&reservation/serviceAvailability/VehicleRentalAvailabilityCard"


const VehicleBooking = () => {

    return (
        <div className="bg-gray-100 min-h-screen p-6">

            <ServiceDetailsCard //hard coded------------------
                service={{
                    image:
                        "https://images.unsplash.com/photo-1550355291-bbee04a92027",
                    name: "Toyota Prius Hybrid",
                    location: "Negombo, Sri Lanka",
                    rating: 4.7,
                    reviews: 96,
                    description:
                        "Fuel-efficient hybrid vehicle with automatic transmission and air conditioning."
                }} />

            <VehicleAvailabilityCard />

        </div>
    )


};

export default VehicleBooking;
