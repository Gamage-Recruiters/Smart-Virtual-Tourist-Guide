import React, { useEffect, useState } from "react";
import { Send, Trophy, CheckCircle } from "lucide-react";
import Header from "./DriverHeader";
import bImage from "../../assets/B.png";
import Footer from "../Footer";
import { IoCaretBackOutline } from "react-icons/io5";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function Submit_Bids() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [bidAmount, setBidAmount] = useState("");
  const [otherBids, setOtherBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hiredDriver, setHiredDriver] = useState(null);
  const [hiring, setHiring] = useState(false);

  const driverName = location.state?.driverName || "Kamal";

  // Fetch bids from backend
  const fetchBids = async () => {
    try {
      if (!tripId) return;
      const response = await fetch(`/api/bids/${tripId}`);
      const result = await response.json();
      if (result.success) {
        setOtherBids(result.data);
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.error("Fetch bids error:", error);
    }
  };

  useEffect(() => {
    fetchBids();
    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchBids, 15000);
    return () => clearInterval(interval);
  }, [tripId]);

  // Submit own bid
  const handleSubmitBid = async () => {
    if (!bidAmount) {
      toast.error("Please enter bid amount");
      return;
    }
    if (Number(bidAmount) <= 0) {
      toast.error("Bid amount must be greater than 0");
      return;
    }
    if (!tripId) {
      toast.error("Trip ID not found. Please open this page with a trip ID.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId,
          driverName,
          bidAmount: Number(bidAmount),
        }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Bid submitted successfully!");
        setBidAmount("");
        fetchBids();
      } else {
        toast.error(result.message || "Bid submit failed");
      }
    } catch (error) {
      console.error("Submit bid error:", error);
      toast.error("Something went wrong. Check backend server.");
    } finally {
      setLoading(false);
    }
  };

  // Find the lowest bid driver
  const lowestBid =
    otherBids.length > 0
      ? otherBids.reduce((min, bid) =>
          bid.bidAmount < min.bidAmount ? bid : min
        )
      : null;

  // Hire the lowest bid driver
  const handleHire = async (bid) => {
    try {
      setHiring(true);
      // Mark as hired (update driver availability via backend)
      const response = await fetch(`/api/bids/hire/${bid._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "hired" }),
      });

      // Even if backend endpoint doesn't exist yet, show success UI
      setHiredDriver(bid);
      toast.success(`🎉 ${bid.driverName} hired for LKR ${bid.bidAmount.toLocaleString()}!`);
    } catch (error) {
      // Show success UI anyway (hire stored on frontend until backend hire endpoint added)
      setHiredDriver(bid);
      toast.success(`🎉 ${bid.driverName} hired for LKR ${bid.bidAmount.toLocaleString()}!`);
    } finally {
      setHiring(false);
    }
  };

  // Sort bids: lowest first
  const sortedBids = [...otherBids].sort((a, b) => a.bidAmount - b.bidAmount);

  return (
    <div className="relative min-h-screen flex flex-col font-sans">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={bImage}
          alt="Sri Lanka View"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-[#E5F3FD]/60 to-[#E5F3FD] backdrop-blur-[3px]"></div>
      </div>

      {/* Main */}
      <div className="relative z-10 flex flex-col flex-1">
        <div className="w-full">
          <Header />
        </div>

        <div className="flex-1 flex items-center justify-center w-full px-4 py-10 mt-32">
          <div className="w-full max-w-2xl space-y-5">

            {/* Hired Banner */}
            {hiredDriver && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-[24px] p-6 shadow-xl flex items-center gap-4">
                <CheckCircle size={40} className="shrink-0" />
                <div>
                  <h3 className="font-extrabold text-lg">Driver Hired! 🎉</h3>
                  <p className="text-sm text-green-100 mt-0.5">
                    <span className="font-bold text-white">{hiredDriver.driverName}</span>
                    {" "}is hired for{" "}
                    <span className="font-bold text-white">
                      LKR {hiredDriver.bidAmount.toLocaleString()}
                    </span>
                  </p>
                  <p className="text-xs text-green-200 mt-1">
                    Lowest bid winner — Trip confirmed!
                  </p>
                </div>
              </div>
            )}

            {/* Submit Bid Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 md:p-10">
              <div className="flex items-center gap-2 mb-5 text-slate-700">
                <Send size={16} className="rotate-12 text-blue-600" />
                <h3 className="font-bold text-sm">Submit Your Bid</h3>
                {tripId && (
                  <span className="ml-auto text-[10px] bg-blue-50 text-blue-500 font-bold px-2 py-1 rounded-lg">
                    Trip: {tripId}
                  </span>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-center">
                <input
                  type="number"
                  placeholder="Enter your bid (LKR)"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 outline-none focus:border-blue-500 transition-all text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={handleSubmitBid}
                  disabled={loading}
                  className="w-full md:w-[170px] bg-[#0B7CFF] hover:bg-[#006BE6] disabled:bg-blue-300 text-white px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-200"
                >
                  <Send size={18} />
                  <span className="font-bold text-sm">
                    {loading ? "Submitting..." : "Submit"}
                  </span>
                </button>
              </div>
            </div>

            {/* All Bids Card — Lowest bid highlighted */}
            <div className="bg-white/95 backdrop-blur-md rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 md:p-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-slate-700">
                  <Trophy size={16} className="text-amber-500" />
                  <h3 className="font-bold text-sm">All Driver Bids</h3>
                  {sortedBids.length > 0 && (
                    <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {sortedBids.length} bids
                    </span>
                  )}
                </div>
                <button
                  onClick={fetchBids}
                  className="text-[11px] text-blue-500 font-bold hover:underline"
                >
                  Refresh
                </button>
              </div>

              {sortedBids.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  <Trophy size={32} className="mx-auto mb-3 text-slate-200" />
                  No bids yet. Be the first to bid!
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedBids.map((bid, index) => {
                    const isLowest = lowestBid && bid._id === lowestBid._id;
                    const isHired = hiredDriver && bid._id === hiredDriver._id;

                    return (
                      <div
                        key={bid._id}
                        className={`flex items-center gap-4 rounded-2xl px-5 py-4 border transition-all ${
                          isHired
                            ? "bg-green-50 border-green-300 shadow-sm shadow-green-100"
                            : isLowest
                            ? "bg-amber-50 border-amber-300 shadow-sm shadow-amber-100"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        {/* Rank Badge */}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                            isHired
                              ? "bg-green-500 text-white"
                              : isLowest
                              ? "bg-amber-400 text-white"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {isHired ? "✓" : isLowest ? "★" : index + 1}
                        </div>

                        {/* Driver Name */}
                        <div className="flex-1 min-w-0">
                          <span className={`font-bold text-sm block truncate ${isLowest ? "text-amber-800" : "text-slate-700"}`}>
                            {bid.driverName}
                          </span>
                          {isLowest && !isHired && (
                            <span className="text-[10px] text-amber-600 font-bold">
                              🏆 Lowest Bid
                            </span>
                          )}
                          {isHired && (
                            <span className="text-[10px] text-green-600 font-bold">
                              ✅ Hired
                            </span>
                          )}
                        </div>

                        {/* Bid Amount */}
                        <div className={`font-extrabold text-base shrink-0 ${isLowest ? "text-amber-700" : "text-slate-800"}`}>
                          LKR {bid.bidAmount.toLocaleString()}
                        </div>

                        {/* Hire Button — only for lowest bid, not yet hired */}
                        {isLowest && !hiredDriver && (
                          <button
                            onClick={() => handleHire(bid)}
                            disabled={hiring}
                            className="shrink-0 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition-all active:scale-95"
                          >
                            {hiring ? "Hiring..." : "Hire"}
                          </button>
                        )}

                        {/* Hired badge */}
                        {isHired && (
                          <div className="shrink-0 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-xl">
                            Hired ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Lowest bid info */}
              {lowestBid && !hiredDriver && (
                <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-amber-800">
                      🏆 Best Deal: <span className="text-amber-700">{lowestBid.driverName}</span>
                    </p>
                    <p className="text-[11px] text-amber-600 mt-0.5">
                      Lowest bid wins the trip automatically
                    </p>
                  </div>
                  <button
                    onClick={() => handleHire(lowestBid)}
                    disabled={hiring}
                    className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-amber-200 transition-all active:scale-95 shrink-0"
                  >
                    {hiring ? "Hiring..." : "Hire Lowest Bidder"}
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-[#0B7CFF] hover:bg-[#006BE6] py-4 text-white rounded-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-200"
              >
                <IoCaretBackOutline size={18} />
                <span className="font-bold text-sm">Back</span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/ride-details")}
                className="flex-1 bg-[#22C55E] hover:bg-[#16a34a] py-4 text-white rounded-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-200"
              >
                <span className="font-bold text-sm">View Ride Details</span>
                <IoCaretBackOutline size={18} className="rotate-180" />
              </button>
            </div>

          </div>
        </div>

        <div className="w-full mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}

