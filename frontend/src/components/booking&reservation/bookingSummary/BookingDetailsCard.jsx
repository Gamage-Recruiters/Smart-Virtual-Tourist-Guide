import React from "react";

const BookingDetailsCard = ({
  title = "Booking Details",
  details = [],
  
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between mb-4">
        <h2 className="font-bold text-lg">
          {title}
        </h2>

        
      </div>

      <div className="space-y-3">
        {details.map((item, index) => (
          <div
            key={index}
            className="flex justify-between"
          >
            <span className="text-gray-600">
              {item.label}
            </span>

            <span className="font-medium text-right">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingDetailsCard;