import React from "react";

const ServiceDetailsCard = ({ service }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="font-bold text-lg mb-4">
        Service Details
      </h2>

      <img
        src={service.image}
        alt={service.title}
        className="rounded-lg mb-4 h-48 w-full object-cover"
      />

      <h3 className="font-semibold text-lg">
        Title: {service.title}
      </h3>
      <h3 className="font-semibold text-lg">
        Category: {service.category}
      </h3>

      <p className="text-gray-500">
        Location: {service.location}
      </p>

      {service.rating && (
        <div className="mt-2 flex items-center gap-2">
          ⭐ {service.rating}

          <span className="text-blue-500">
            ({service.reviews} reviews)
          </span>
        </div>
      )}

      {service.duration && (
        <p className="mt-3 text-sm text-gray-600">
         Duration: {service.duration}
        </p>
      )}
    </div>
  );
};

export default ServiceDetailsCard;