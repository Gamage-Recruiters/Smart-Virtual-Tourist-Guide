const BookingProgressBar = ({ currentStep }) => {
  const steps = [
    {
      id: 1,
      title: "Your Details",
      subtitle: "Tell us about yourself",
    },
    {
      id: 2,
      title: "Payment",
      subtitle: "Review and pay",
    },
    {
      id: 3,
      title: "Confirm",
      subtitle: "Booking confirmation",
    },
  ];

  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className="flex items-center flex-1"
        >
          {/* Step */}
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all duration-300
                ${
                  currentStep >= step.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }
              `}
            >
              {step.id}
            </div>

            <p
              className={`mt-3 font-semibold
                ${
                  currentStep >= step.id
                    ? "text-blue-600"
                    : "text-gray-500"
                }
              `}
            >
              {step.title}
            </p>

            <p className="text-xs text-gray-400">
              {step.subtitle}
            </p>
          </div>

          {/* Line */}
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300
                ${
                  currentStep > step.id
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default BookingProgressBar;