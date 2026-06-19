import React from "react";

const PriceSummaryCard = ({
  items = [],
  currency = "USD", }) => {
  const total = items.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="font-bold text-lg mb-4">
        Price Summary
      </h2>

      <div className="space-y-3">

        {items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between"
          >
            <span>{item.label}</span>
            <span>
              {currency} {item.amount.toFixed(2)}
            </span>
          </div>
        ))}

        <hr />

        <div className="flex justify-between font-bold text-xl">
          <span>Total</span>
          <span>
            {currency} {total.toFixed(2)}
          </span>
        </div>

        <p className="text-sm text-gray-500">
          All prices are in {currency}
        </p>

      </div>
    </div>
  );
};

export default PriceSummaryCard;