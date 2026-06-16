import React, { useState } from "react";
// import { useParams } from "react-router-dom";
import { submitTripFeedback } from "../services/feedbackService";

const RateExperience = () => {

    // const { touristId, tripId } = useParams();

    const touristId = "6a28dc49a14342989f1e4ee4";
    const tripId = "6a28dc49a14342989f1e4ee5";

    const [feedbackStarHover, setFeedbackStarHover] = useState(0);
    const [feedbackStarPick, setFeedbackStarPick] = useState(5);
    const [feedbackText, setFeedbackText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!feedbackText.trim()) {
            alert("Please provide some feedback.");
            return;
        }

        setIsSubmitting(true);

        const feedbackData = {
            touristId,
            tripId,
            overallRating: feedbackStarPick,
            feedbackText: feedbackText
        };

        try {
            const result = await submitTripFeedback(feedbackData);

            alert("Feedback submitted successfully!");
            setFeedbackText("");

        } catch (err) {
            alert("An error occurred while submitting feedback.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="bg-white rounded-t-none rounded-b-[32px] sm:rounded-b-[48px] p-6 sm:p-10 md:p-16 lg:p-20 w-full">

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-6">
                Rate Your Experience
            </h3>

            {/* Stars selection */}
            <div className="flex items-center gap-1.5 mb-8">
                {[1, 2, 3, 4, 5].map(n => (
                    <button
                        key={n}
                        onMouseEnter={() => setFeedbackStarHover(n)}
                        onMouseLeave={() => setFeedbackStarHover(0)}
                        onClick={() => setFeedbackStarPick(n)}
                        disabled={isSubmitting}
                        className="text-3xl sm:text-4xl transition-transform hover:scale-110 focus:outline-none"
                        style={{ color: (feedbackStarHover || feedbackStarPick) >= n ? "#F1C40F" : "#D1D5DB" }}
                    >
                        ★
                    </button>
                ))}
            </div>

            {/* Feedback textarea */}
            <textarea
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                disabled={isSubmitting}
                placeholder="Share your thoughts about this trip..."
                className="w-full bg-gradient-to-r from-white via-[#BEE0FD]/30 to-[#80BEFC]/80 rounded-[24px] p-6 sm:p-8 text-sm sm:text-base text-gray-800 placeholder-[#1C2C3F]/60 resize-none h-36 sm:h-40 focus:outline-none focus:ring-2 focus:ring-[#80BEFC]/50 transition-all border border-[#A2D5FF]/50 shadow-sm"
            />

            {/* Submit Button */}
            <div className="flex justify-start mt-8">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-2.5 bg-gradient-to-b from-white to-[#BCE2FF] text-[#1C2C3F] text-xs sm:text-sm font-bold rounded-2xl shadow-sm border border-[#A2D5FF]/30 hover:brightness-95 transition-all duration-300 disabled:opacity-50"
                >
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </button>
            </div>

        </section>
    );
}

export default RateExperience;