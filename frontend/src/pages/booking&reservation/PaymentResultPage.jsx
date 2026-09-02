import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmPaymentByOrderId, getBookingByOrderId } from "../../api/bookingApi";

const PaymentResultPage = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("order_id");
    const status = searchParams.get("status");
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!orderId) {
            setLoading(false);
            setError("No order ID found in payment response.");
            return;
        }

        if (status === "cancel") {
            setLoading(false);
            setError("Payment was cancelled by the user.");
            return;
        }

        const handleConfirmation = async () => {
            try {
                // Confirm payment status in database
                const response = await confirmPaymentByOrderId(orderId);
                setBooking(response.booking);
            } catch (err) {
                // Fallback: try fetching existing booking
                try {
                    const fallback = await getBookingByOrderId(orderId);
                    setBooking(fallback.booking);
                } catch (fetchErr) {
                    setError("Failed to verify payment status: " + err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        handleConfirmation();
    }, [orderId, status]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
                <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md w-full">
                    <div className="animate-spin text-4xl mb-4">⏳</div>
                    <h2 className="text-xl font-bold mb-2">Verifying Payment...</h2>
                    <p className="text-gray-500 text-sm">Please wait while we confirm your booking details.</p>
                </div>
            </div>
        );
    }

    if (error || status === "cancel") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
                <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md w-full">
                    <div className="text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">
                        {status === "cancel" ? "Payment Cancelled" : "Payment Verification Failed"}
                    </h2>
                    <p className="text-gray-600 mb-6">{error || "Something went wrong during payment processing."}</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => navigate("/my-bookings")}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            My Bookings
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
                <div className="text-6xl text-center mb-4">✅</div>
                <h1 className="text-3xl font-bold text-center mb-2">Payment Successful!</h1>
                <p className="text-gray-500 text-center mb-8">
                    Your reservation has been successfully placed and confirmed.
                </p>

                {booking && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 space-y-4">
                        <div className="flex justify-between border-b pb-3 text-sm">
                            <span className="text-gray-500">Order / Booking ID</span>
                            <span className="font-semibold text-gray-900">{booking._id || orderId}</span>
                        </div>

                        {booking.service?.name && (
                            <div className="flex justify-between border-b pb-3 text-sm">
                                <span className="text-gray-500">Service</span>
                                <span className="font-medium text-gray-800">{booking.service.name}</span>
                            </div>
                        )}

                        {booking.customer && (
                            <div className="flex justify-between border-b pb-3 text-sm">
                                <span className="text-gray-500">Customer Name</span>
                                <span className="font-medium text-gray-800">
                                    {booking.customer.firstName} {booking.customer.lastName}
                                </span>
                            </div>
                        )}

                        {booking.pricing && (
                            <div className="flex justify-between text-base font-semibold pt-1">
                                <span>Total Amount Paid</span>
                                <span className="text-green-600">
                                    {booking.pricing.currency || "USD"} {Number(booking.pricing.total || 0).toFixed(2)}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate("/my-bookings")}
                        className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition shadow"
                    >
                        Go To My Bookings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentResultPage;
