import React from "react";

const ServiceDetailsCard = ({ service }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="font-bold text-lg mb-4">
        Service Details
      </h2>

      <img
        src={service.image}
        alt={service.name}
        className="rounded-lg mb-4 h-48 w-full object-cover"
      />

      <h3 className="font-semibold text-lg">
        {service.name}
      </h3>

      <p className="text-gray-500">
        {service.location}
      </p>

      {service.rating && (
        <div className="mt-2 flex items-center gap-2">
          ⭐ {service.rating}

          <span className="text-blue-500">
            ({service.reviews} reviews)
          </span>
        </div>
      )}

      {service.description && (
        <p className="mt-3 text-sm text-gray-600">
          {service.description}
        </p>
      )}
    </div>
  );
};

export default ServiceDetailsCard;