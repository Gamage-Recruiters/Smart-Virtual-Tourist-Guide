import React from "react";

const ServiceDetailsCard = ({ service }) => {
  return (
    <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
      <h2 className="font-bold text-lg text-gray-800 mb-4">
        Service Details
      </h2>

      <div className="w-full flex justify-center bg-gray-50 rounded-xl p-2 border border-gray-100 mb-4 overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          className="aspect-[4/3] w-full max-w-md object-cover object-center rounded-lg shadow-sm"
        />
      </div>

      <h3 className="font-semibold text-xl text-gray-900">
        {service.name}
      </h3>

      <p className="text-gray-500 text-sm mt-1">
        {service.location}
      </p>

      {service.rating && (
        <div className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-700">
          ⭐ {service.rating}

          <span className="text-blue-600">
            ({service.reviews} reviews)
          </span>
        </div>
      )}

      {service.description && (
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          {service.description}
        </p>
      )}
    </div>
  );
};

export default ServiceDetailsCard;