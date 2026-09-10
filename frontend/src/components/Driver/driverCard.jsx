import { useState } from "react";
import { Star, ShieldCheck, Phone, Car, MapPin, X, CheckCircle, Calendar } from "lucide-react";

export default function DriverCard({ driver }) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookDriver = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowBookingModal(false);
      setShowProfileModal(false);
    }, 3000);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row gap-5 justify-between border border-slate-100 hover:shadow-lg transition-shadow">
        {/* Left */}
        <div className="flex gap-5">
          {/* Image */}
          <img
            src={driver.image}
            alt={driver.name}
            className="w-[140px] h-[140px] rounded-xl object-cover shadow-sm"
          />

          {/* Details */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {driver.name}
            </h2>

            <p className="text-gray-500 mt-1 font-medium">
              {driver.experience}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {driver.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-gray-600 mt-5 max-w-2xl leading-7 line-clamp-2">
              {driver.description}
            </p>

            {/* Price */}
            <div className="mt-5">
              <span className="text-4xl font-bold text-slate-900">
                ${driver.price}
              </span>

              <span className="text-gray-500 text-lg">
                /day
              </span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col justify-between items-end">
          {/* Rating */}
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
            <Star
              size={18}
              className="fill-yellow-400 text-yellow-400"
            />

            <span className="font-bold text-amber-900">
              {driver.rating}
            </span>

            <span className="text-amber-700 text-sm">
              ({driver.reviews} reviews)
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button 
              onClick={() => setShowProfileModal(true)}
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 transition px-5 py-3 rounded-xl font-semibold text-sm cursor-pointer shadow-sm"
            >
              View Profile
            </button>

            <button 
              onClick={() => setShowBookingModal(true)}
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-3 rounded-xl font-semibold text-sm cursor-pointer shadow-sm"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* DRIVER PROFILE MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 relative p-6 md:p-8">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowProfileModal(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>

            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-slate-100 pb-6">
              <div className="relative">
                <img 
                  src={driver.image} 
                  alt={driver.name} 
                  className="w-28 h-28 rounded-2xl object-cover shadow-md border-2 border-white"
                />
                <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow" title="Verified Driver">
                  <ShieldCheck size={16} />
                </span>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h3 className="text-2xl font-extrabold text-slate-900">{driver.name}</h3>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>

                <p className="text-slate-500 text-sm mt-1">{driver.experience}</p>

                <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-amber-600 font-semibold text-sm">
                    <Star size={16} className="fill-amber-400 text-amber-400" />
                    <span>{driver.rating}</span>
                    <span className="text-slate-400 font-normal">({driver.reviews} reviews)</span>
                  </div>
                  <div className="text-slate-300">|</div>
                  <div className="text-blue-600 font-bold text-lg">
                    ${driver.price} <span className="text-xs text-slate-500 font-normal">/ day</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details Sections */}
            <div className="py-6 space-y-6">
              
              {/* About Driver */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  About Driver
                </h4>
                <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {driver.description}
                </p>
              </div>

              {/* Vehicle & Services Specs */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Vehicle & Highlights
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 bg-blue-50/60 p-3.5 rounded-xl border border-blue-100/60">
                    <Car className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-xs text-slate-400">Vehicle Info</div>
                      <div className="text-sm font-semibold text-slate-800">
                        {driver.tags[0] || "Standard Vehicle"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-blue-50/60 p-3.5 rounded-xl border border-blue-100/60">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-xs text-slate-400">Contact Number</div>
                      <div className="text-sm font-semibold text-slate-800">
                        {driver.tags.find(t => t.startsWith("No:")) || "Verified Phone"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features & Amenities Tags */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Specialties & Languages
                </h4>
                <div className="flex flex-wrap gap-2">
                  {driver.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer Action Buttons */}
            <div className="flex gap-3 border-t border-slate-100 pt-5">
              <button 
                onClick={() => setShowProfileModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setShowProfileModal(false);
                  setShowBookingModal(true);
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Calendar size={16} />
                Book This Driver
              </button>
            </div>

          </div>
        </div>
      )}

      {/* BOOKING CONFIRMATION MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-100 relative">
            <button 
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            {bookingSuccess ? (
              <div className="py-6 flex flex-col items-center gap-3">
                <CheckCircle className="w-16 h-16 text-emerald-500 animate-bounce" />
                <h3 className="text-2xl font-bold text-slate-900">Booking Request Sent!</h3>
                <p className="text-sm text-slate-500">
                  Your booking request has been sent to <strong>{driver.name}</strong>. They will respond shortly.
                </p>
              </div>
            ) : (
              <div className="py-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Book {driver.name}</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Daily Rate: <strong className="text-blue-600">${driver.price} / day</strong>
                </p>

                <div className="space-y-3 mb-6 text-left">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Pickup Date</label>
                    <input type="date" className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:border-blue-500 outline-none" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Duration (Days)</label>
                    <input type="number" min="1" defaultValue="1" className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:border-blue-500 outline-none" />
                  </div>
                </div>

                <button 
                  onClick={handleBookDriver}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-md"
                >
                  Confirm Booking
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}