import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingProgressBar from "../../components/booking&reservation/bookingSummary/BookingProgressBar";
import ServiceDetailsCard from "../../components/booking&reservation/bookingSummary/ServiceDetailsCard";
import BookingDetailsCard from "../../components/booking&reservation/bookingSummary/BookingDetailsCard";
import PriceSummaryCard from "../../components/booking&reservation/bookingSummary/PriceSummaryCard";
import { submitBooking, generatePayHereHash } from "../../api/bookingApi";

const BookingPage = () => {

    const [currentStep, setCurrentStep] = useState(1);

    const location = useLocation();

    const rawService = location.state?.service || {};
    const service = {
        ...rawService,
        name: rawService.name || rawService.title || rawService.label || 'Activity',
    };

    const serviceType = location.state?.serviceType || service.type || '';

    const bookingDetails = location.state?.bookingDetails || [];

    const pricing = location.state?.pricing || {
        currency: "USD",
        items: [],
    };

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [bookingResult, setBookingResult] = useState(null);
    const navigate = useNavigate();

    // Calculate total from pricing items
    const totalAmount = pricing.items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    /**
     * PayHere Checkout Flow:
     * 1. Generate hash from backend
     * 2. Open PayHere popup
     * 3. On success → create booking in DB → show confirmation
     */
    const handlePayHereCheckout = async () => {
        setIsSubmitting(true);
        setSubmitError("");

        try {
            // Step A: Generate a unique order ID
            const orderId = `SVTG-VH-${Date.now()}`;

            // Step B: Get hash from backend
            const hashData = await generatePayHereHash({
                orderId,
                amount: totalAmount,
                currency: pricing.currency || 'LKR',
            });

            // Step C: Build PayHere payment object
            const payment = {
                sandbox: true,    // ← SANDBOX MODE for testing
                merchant_id: hashData.merchant_id,
                return_url: undefined,
                cancel_url: undefined,
                notify_url: 'http://localhost:5000/api/payments/notify',
                order_id: orderId,
                items: service.name || 'Vehicle Rental',
                amount: totalAmount.toFixed(2),
                currency: pricing.currency || 'LKR',
                hash: hashData.hash,
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: 'N/A',
                city: 'Colombo',
                country: 'Sri Lanka',
            };

            // Step D: Setup PayHere callbacks
            window.payhere.onCompleted = async function (completedOrderId) {
                console.log("Payment completed. OrderID:", completedOrderId);

                try {
                    // Create confirmed booking in DB
                    const bookingPayload = {
                        service,
                        bookingDetails,
                        pricing,
                        customer: {
                            firstName: formData.firstName,
                            lastName: formData.lastName,
                            email: formData.email,
                            phone: formData.phone,
                        },
                        paymentMethod: "payhere",
                        paymentDetails: {
                            payhereOrderId: completedOrderId,
                        },
                        serviceType: location.state?.serviceType || 'vehicle',
                    };

                    const response = await submitBooking(bookingPayload);
                    setBookingResult(response.booking || null);
                    setCurrentStep(3);
                } catch (err) {
                    setSubmitError("Payment succeeded but booking creation failed: " + err.message);
                }

                setIsSubmitting(false);
            };

            window.payhere.onDismissed = function () {
                console.log("Payment dismissed by user");
                setIsSubmitting(false);
                setSubmitError("Payment was cancelled. Please try again.");
            };

            window.payhere.onError = function (error) {
                console.error("PayHere error:", error);
                setIsSubmitting(false);
                setSubmitError("Payment error: " + error);
            };

            // Step E: Open PayHere popup
            window.payhere.startPayment(payment);

        } catch (error) {
            setSubmitError(error.message || "Payment initiation failed.");
            setIsSubmitting(false);
        }
    };

    const handleNext = () => {

        if (currentStep === 1) {
            if (!validateStep1()) return;
        }

        // Step 2 → trigger PayHere checkout instead of card form submission
        if (currentStep === 2) {
            handlePayHereCheckout();
            return;
        }

        if (currentStep < 3) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const validateStep1 = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = "Invalid email address";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">



            <div className="grid grid-cols-12 gap-6">

                {/* Left Sidebar */}
                <div className="col-span-3 space-y-6">
                    <ServiceDetailsCard
                        service={service}
                    />

                    <BookingDetailsCard
                        details={bookingDetails}
                    />

                    <PriceSummaryCard
                        currency={pricing.currency}
                        items={pricing.items}
                    />

                </div>

                {/* Main Content */}
                <div className="col-span-9 bg-white rounded-xl shadow p-8">

                    {/* Progress Bar */}
                    <BookingProgressBar currentStep={currentStep} />

                    {/* STEP 1 */}
                    {currentStep === 1 && (
                        <>
                            <h1 className="text-3xl font-bold mb-2">
                                Your Details
                            </h1>

                            <p className="text-gray-500 mb-8">
                                Please enter your details to continue
                            </p>

                            <div className="space-y-6">

                                <div className="grid grid-cols-2 gap-6">

                                    <div>
                                        <label className="block mb-2 font-medium">
                                            First Name *
                                        </label>

                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    firstName: e.target.value,
                                                })
                                            }
                                            className={`w-full border rounded-lg p-3 ${errors.firstName ? "border-red-500" : ""
                                                }`}
                                            placeholder="Enter first name"
                                        />

                                        {errors.firstName && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.firstName}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium">
                                            Last Name *
                                        </label>

                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    lastName: e.target.value,
                                                })
                                            }
                                            className={`w-full border rounded-lg p-3 ${errors.lastName ? "border-red-500" : ""
                                                }`}
                                            placeholder="Enter last name"
                                        />
                                        {errors.lastName && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.lastName}
                                            </p>
                                        )}

                                    </div>

                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Email Address *
                                    </label>

                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                        className={`w-full border rounded-lg p-3 ${errors.email ? "border-red-500" : ""
                                            }`}
                                        placeholder="example@email.com"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Phone Number *
                                    </label>

                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                phone: e.target.value,
                                            })
                                        }
                                        className={`w-full border rounded-lg p-3 ${errors.phone ? "border-red-500" : ""
                                            }`}
                                        placeholder="+94 77 123 4567"
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                            </div>
                        </>
                    )}

                    {/* STEP 2 — Review & Pay */}
                    {currentStep === 2 && (
                        <>
                            <h1 className="text-3xl font-bold mb-2">
                                Review & Pay
                            </h1>

                            <p className="text-gray-500 mb-8">
                                Review your booking and proceed to payment
                            </p>

                            {/* Booking Summary */}
                            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6">
                                <h2 className="font-semibold text-lg mb-3">Booking Summary</h2>

                                <div className="grid gap-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Service</span>
                                        <span className="font-medium">{service.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Customer</span>
                                        <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Email</span>
                                        <span className="font-medium">{formData.email}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Phone</span>
                                        <span className="font-medium">{formData.phone}</span>
                                    </div>
                                </div>

                                {/* Booking Details */}
                                {bookingDetails.length > 0 && (
                                    <div className="border-t pt-3 mb-4">
                                        <h3 className="font-medium text-sm text-gray-600 mb-2">Reservation Details</h3>
                                        <div className="grid gap-2">
                                            {bookingDetails.map((item, i) => (
                                                <div key={i} className="flex justify-between text-sm">
                                                    <span className="text-gray-500">{item.label}</span>
                                                    <span className="font-medium">{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Price Breakdown */}
                                <div className="border-t pt-3 space-y-2">
                                    {pricing.items.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-gray-500">{item.label}</span>
                                            <span className="font-medium">{pricing.currency} {Number(item.amount).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between font-bold text-lg border-t pt-3 mt-2">
                                        <span>Total</span>
                                        <span className="text-blue-600">
                                            {pricing.currency} {totalAmount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* PayHere Badge */}
                            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <div className="text-3xl">🔒</div>
                                <div>
                                    <p className="font-semibold text-blue-800">Secure Payment via PayHere</p>
                                    <p className="text-blue-600 text-sm">Your payment is processed securely by PayHere. We never see your card details.</p>
                                </div>
                            </div>
                        </>
                    )}

                    {/* STEP 3 */}
                    {currentStep === 3 && (
                        <div className="py-16">

                            <div className="text-7xl mb-5 text-center">
                                ✅
                            </div>

                            <h1 className="text-3xl font-bold mb-4 text-center">
                                Booking Confirmed
                            </h1>

                            <p className="text-gray-500 text-lg text-center mb-8">
                                Your reservation has been successfully created.
                            </p>

                            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mx-auto max-w-2xl">
                                <div className="mb-4 text-sm text-gray-500">
                                    Booking ID: <span className="font-semibold text-gray-900">{bookingResult?._id || bookingResult?.id || 'N/A'}</span>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <h2 className="font-semibold text-lg mb-2">Service</h2>
                                        <p className="text-gray-700">{service.name || 'Unknown service'}</p>
                                        {service.location && <p className="text-gray-500">{service.location}</p>}
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-lg mb-2">Customer</h2>
                                        <p className="text-gray-700">{formData.firstName} {formData.lastName}</p>
                                        <p className="text-gray-500">{formData.email}</p>
                                        <p className="text-gray-500">{formData.phone}</p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h2 className="font-semibold text-lg mb-3">Booking Details</h2>
                                    <div className="grid gap-2">
                                        {bookingDetails.map((item, index) => (
                                            <div key={index} className="flex justify-between text-sm text-gray-700">
                                                <span>{item.label}</span>
                                                <span className="font-medium">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h2 className="font-semibold text-lg mb-3">Price Summary</h2>
                                    <div className="space-y-2">
                                        {pricing.items.map((item, index) => (
                                            <div key={index} className="flex justify-between text-sm text-gray-700">
                                                <span>{item.label}</span>
                                                <span className="font-medium">{pricing.currency} {Number(item.amount).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex justify-between border-t pt-3 font-semibold text-gray-900">
                                        <span>Total</span>
                                        <span>{pricing.currency} {totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* PayHere Payment Badge */}
                                <div className="mt-6 pt-4 border-t">
                                    <div className="flex items-center gap-2 text-sm text-green-700">
                                        <span>✅</span>
                                        <span>Paid securely via PayHere</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* Navigation Buttons */}

                    <div className="flex flex-col gap-4 mt-10 border-t pt-6">
                        {submitError && (
                            <div className="text-red-600 text-sm">
                                {submitError}
                            </div>
                        )}

                        <div className="flex justify-between">
                            <button
                                onClick={handleBack}
                                disabled={currentStep === 1 || isSubmitting}
                                className={`px-6 py-3 rounded-lg font-medium transition ${currentStep === 1 || isSubmitting
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "border border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                ← Back
                            </button>

                            {currentStep < 3 ? (
                                <button
                                    onClick={handleNext}
                                    disabled={isSubmitting}
                                    className={`px-8 py-3 rounded-lg text-white transition ${isSubmitting
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                        }`}
                                >
                                    {currentStep === 2 ? (isSubmitting ? 'Processing...' : '💳 Pay with PayHere') : 'Next →'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/my-bookings', { state: { bookingId: bookingResult?._id || bookingResult?.id } })}
                                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                                >
                                    Go To My Bookings
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BookingPage;