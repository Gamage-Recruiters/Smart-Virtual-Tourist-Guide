import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaStar, FaCalendarAlt } from 'react-icons/fa';

const HotelAvailabilityCard = ({ hotel, selectedRoom }) => {
  const navigate = useNavigate();

  const [hotelData, setHotelData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "1 Guest",
  });

  const currency = hotel?.currency || 'LKR';
  const basePricePerNight = selectedRoom ? selectedRoom.price : (hotel?.numericPrice || 20000);
  const rating = hotel?.userRating || hotel?.rating || 4.8;
  const reviews = hotel?.reviews || 120;

  const calculateNights = () => {
    if (hotelData.checkIn && hotelData.checkOut) {
      const start = new Date(hotelData.checkIn);
      const end = new Date(hotelData.checkOut);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 2;
    }
    return 2;
  };

  const nights = calculateNights();
  
  const roomPrice = nights * basePricePerNight;
  const serviceFee = Math.round(roomPrice * 0.05); // 5% service fee
  const taxes = Math.round(roomPrice * 0.03); // 3% taxes
  const total = roomPrice + serviceFee + taxes;

  const [checking, setChecking] = useState(false);

  const handleAvailabilityCheck = async () => {
    if (!hotelData.checkIn || !hotelData.checkOut) {
      toast.error("Please fill in check-in and check-out dates.");
      return;
    }

    const start = new Date(hotelData.checkIn);
    const end = new Date(hotelData.checkOut);

    if (start >= end) {
      toast.error("Check-out date must be after check-in date.");
      return;
    }

    const targetHotelId = hotel?.hotelId || hotel?._id || hotel?.ownerId || hotel?.id;
    const targetRoomId = selectedRoom?._id || selectedRoom?.id;

    // Validate against selectedRoom model dates & status client-side
    if (selectedRoom) {
      if (selectedRoom.roomStatus && selectedRoom.roomStatus !== 'Available') {
        toast.error(`Selected room is currently ${selectedRoom.roomStatus}. Please choose another room.`);
        return;
      }

      const isOverlapping = (periods) => {
        if (!Array.isArray(periods)) return false;
        return periods.some(period => {
          const pStart = new Date(period.startDate);
          const pEnd = new Date(period.endDate);
          return start < pEnd && end > pStart;
        });
      };

      if (isOverlapping(selectedRoom.blockedDates)) {
        toast.error("Selected dates overlap with blocked dates for this room.");
        return;
      }

      if (isOverlapping(selectedRoom.maintenanceDates)) {
        toast.error("Selected dates overlap with scheduled maintenance for this room.");
        return;
      }

      if (isOverlapping(selectedRoom.bookingDates)) {
        toast.error("Selected dates overlap with an existing booking for this room.");
        return;
      }
    }

    // Verify against backend Room model API
    if (targetRoomId && !selectedRoom?.isPackage) {
      setChecking(true);
      try {
        const res = await fetch('http://localhost:5000/api/hotels/rooms/check-availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId: targetRoomId,
            checkIn: hotelData.checkIn,
            checkOut: hotelData.checkOut
          })
        });

        const data = await res.json();
        if (data.success && !data.available) {
          toast.error(data.reason || "Room is not available for the selected dates.");
          setChecking(false);
          return;
        }
      } catch (err) {
        console.error("Availability check API error:", err);
      } finally {
        setChecking(false);
      }
    }

    toast.success("Room is available! Proceeding to checkout...", { icon: '✨' });

    const roomNumVal = selectedRoom?.roomNumber || selectedRoom?.roomNo || 'R1';
    const roomNameVal = selectedRoom?.roomName || selectedRoom?.name || 'Standard Room';
    const roomTypeVal = selectedRoom?.roomType || 'Deluxe Double Room';

    navigate("/booking-page", {
      state: {
        service: {
          serviceId: targetHotelId,
          hotelId: targetHotelId,
          roomId: targetRoomId,
          roomNumber: roomNumVal,
          roomNo: roomNumVal,
          roomName: roomNameVal,
          roomType: roomTypeVal,
          image: hotel?.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945",
          name: hotel?.name || "Ocean Breeze Resort",
          location: hotel?.location || "Bentota, Sri Lanka",
          rating: rating,
          reviews: reviews,
          description: hotel?.description || "Experience luxury hotel stay.",
        },
        hotelId: targetHotelId,
        roomId: targetRoomId,
        roomNumber: roomNumVal,
        roomNo: roomNumVal,
        roomName: roomNameVal,
        roomType: roomTypeVal,
        bookingDetails: [
          { label: "Room Name", value: roomNameVal },
          { label: "Room Type", value: roomTypeVal },
          { label: "Room Number", value: roomNumVal },
          { label: "Room ID", value: String(targetRoomId || 'N/A') },
          { label: "Check-in", value: hotelData.checkIn },
          { label: "Check-out", value: hotelData.checkOut },
          { label: "Guests", value: hotelData.guests },
        ],
        pricing: {
          currency: currency,
          items: [
            { label: `${currency} ${basePricePerNight.toLocaleString()} x ${nights} nights`, amount: roomPrice },
            { label: "Service fee", amount: serviceFee },
            { label: "Taxes", amount: taxes },
          ],
        },
        serviceType: "hotel",
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      
      {/* Header (Price & Rating) */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-2xl font-extrabold text-gray-900">{currency} {basePricePerNight.toLocaleString()}</span>
          <span className="text-xs text-gray-500 font-medium ml-1">per night</span>
        </div>
        <div className="flex items-center mt-2 text-xs font-semibold text-gray-700">
          <FaStar className="text-yellow-400 mr-1 w-3 h-3" />
          {rating} <span className="text-gray-400 ml-1 font-normal underline cursor-pointer">({reviews} reviews)</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Date Pickers */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Check-in</label>
          <div className="relative">
            <input
              type="date"
              value={hotelData.checkIn}
              onChange={(e) => setHotelData({ ...hotelData, checkIn: e.target.value })}
              className="w-full border border-gray-200 p-3 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              placeholder="mm/dd/yyyy"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Check-out</label>
          <div className="relative">
            <input
              type="date"
              value={hotelData.checkOut}
              onChange={(e) => setHotelData({ ...hotelData, checkOut: e.target.value })}
              className="w-full border border-gray-200 p-3 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              placeholder="mm/dd/yyyy"
            />
          </div>
        </div>

        {/* Guests Dropdown */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Guests</label>
          <select
            value={hotelData.guests}
            onChange={(e) => setHotelData({ ...hotelData, guests: e.target.value })}
            className="w-full border border-gray-200 p-3 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="1 Guest">1 Guest</option>
            <option value="2 Guests">2 Guests</option>
            <option value="3 Guests">3 Guests</option>
            <option value="4 Guests">4 Guests</option>
          </select>
        </div>

        <button
          onClick={handleAvailabilityCheck}
          disabled={checking}
          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-gray-400 text-white py-3.5 rounded-xl font-bold text-sm transition-colors shadow-sm mt-2"
        >
          {checking ? "Checking availability..." : "Check availability"}
        </button>

        {/* Total Price Display */}
        <div className="pt-4 mt-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{currency} {basePricePerNight.toLocaleString()} x {nights} nights</span>
                <span className="font-semibold text-gray-700">{currency} {roomPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 underline cursor-pointer decoration-gray-300">Service fee (5%)</span>
                <span className="font-semibold text-gray-700">{currency} {serviceFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 underline cursor-pointer decoration-gray-300">Taxes (3%)</span>
                <span className="font-semibold text-gray-700">{currency} {taxes.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <span className="text-gray-900 font-extrabold text-base">Total</span>
                <span className="text-base font-extrabold text-gray-900">
                    {currency} {total.toLocaleString()}
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HotelAvailabilityCard;