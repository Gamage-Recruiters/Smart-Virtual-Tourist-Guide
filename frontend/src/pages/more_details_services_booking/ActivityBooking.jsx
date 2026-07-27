import React from 'react'
import ServiceDetailsCard from "../../components/booking&reservation/bookingSummary/ServiceDetailsCard";
import ActivityAvailabilityCard from "../../components/booking&reservation/serviceAvailability/ActivityAvailabilityCard"


const ActivityBooking = () => {
    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <ServiceDetailsCard //hard coded------------------
                service={{
                    image:
                        "https://images.unsplash.com/photo-1549366021-9f761d040a94",
                    name: "Yala Safari Adventure",
                    location: "Yala National Park",
                    rating: 4.9,
                    reviews: 315,
                    description:
                        "Full-day safari experience with experienced guides and luxury jeep transport."
                
                }} />

            <ActivityAvailabilityCard />

        </div>
    )

};
export default ActivityBooking;


