import React, { useEffect, useState } from "react";
import { Send } from "lucide-react";
import Header from "../Header";
import bImage from "../../assets/B.png";
import Footer from "../Footer";
import { IoCaretBackOutline } from "react-icons/io5";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function Submit_Bids() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [bidAmount, setBidAmount] = useState("");
  const [otherBids, setOtherBids] = useState([]);
  const [loading, setLoading] = useState(false);

  const driverName = location.state?.driverName || "Kamal";

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
  }, [tripId]);

  const handleSubmitBid = async () => {
    if (!bidAmount) {
      alert("Please enter bid amount");
      return;
    }

    if (!tripId) {
      alert("Trip ID not found. Please open this page with a trip ID.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripId: tripId,
          driverName: driverName,
          bidAmount: Number(bidAmount),
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Bid submitted successfully!");
        setBidAmount("");
        fetchBids();
      } else {
        alert(result.message || "Bid submit failed");
      }
    } catch (error) {
      console.error("Submit bid error:", error);
      alert("Something went wrong. Check backend server.");
    } finally {
      setLoading(false);
    }
  };

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

        <div className="flex-1 flex items-center justify-center w-full px-4 py-10 mt-80">
          <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 md:p-10">
            
            {/* Submit Bid Section */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4 text-slate-700">
                <Send size={16} className="rotate-12 text-blue-600" />
                <h3 className="font-bold text-sm">Submit bids</h3>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center">
                <input
                  type="number"
                  placeholder="0.00"
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

            {/* Other Driver Bids Section */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-8 text-slate-700">
                <Send size={14} className="rotate-12 text-blue-600" />
                <h3 className="font-bold text-sm">Other driver bits</h3>
              </div>

              <div className="space-y-4">
                {otherBids.length === 0 ? (
                  [1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between gap-6"
                    >
                      <span className="text-slate-700 font-bold text-xs min-w-[100px]">
                        Driver Name
                      </span>

                      <input
                        type="text"
                        disabled
                        placeholder="0.00"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-400 text-sm font-medium cursor-not-allowed"
                      />
                    </div>
                  ))
                ) : (
                  otherBids.map((bid) => (
                    <div
                      key={bid._id}
                      className="flex items-center justify-between gap-6"
                    >
                      <span className="text-slate-700 font-bold text-xs min-w-[100px]">
                        {bid.driverName}
                      </span>

                      <input
                        type="text"
                        disabled
                        value={bid.bidAmount}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-500 text-sm font-medium cursor-not-allowed"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-14 flex justify-center">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full max-w-md bg-[#0B7CFF] hover:bg-[#006BE6] py-4 text-white rounded-xl flex items-center justify-center gap-4 transition-all shadow-xl shadow-blue-200"
              >
                <span className="font-bold text-sm">Back</span>
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