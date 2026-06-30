import React, { useState } from 'react';
import { 
  FaSearch, FaBuilding, FaPlus, FaCloudUploadAlt, FaMapMarkerAlt, 
  FaBold, FaItalic, FaUnderline, FaCode, FaListUl, FaListOl, 
  FaRegCommentDots, FaEraser 
} from 'react-icons/fa';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function AddRoomPage() {
  const [roomTypeOpen, setRoomTypeOpen] = useState(false);
  
  // 1. Unified Form State Object structured exactly like your Mongoose Schema
  const [formData, setFormData] = useState({
    roomName: '',
    roomType: 'Standard Room',
    roomSize: 55,
    adultsCapacity: 2,
    childrenCapacity: 0,
    description: 'Experience luxury and comfort in our spacious room configurations.',
    contactName: 'Miss. Thilini Harshani Jayasundara',
    contactNumber: '778978346',
    email: 'thiliniharshani2002@gmail.com',
    aboutLocation: 'Situated in a prime coastal location in Sri Lanka, offering breathtaking ocean views.',
    basePrice: 150,
    paymentMethods: 'Online',
    amenities: ['Terrace', 'Air Conditions', 'Breakfast Included', 'Tea Coffee Maker']
  });

  // API Submission Lifecycle Status States
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const amenitiesList = [
    { id: 'terrace', label: 'Terrace' },
    { id: 'gardenView', label: 'Garden View' },
    { id: 'wifi', label: 'Free WiFi' },
    { id: 'ac', label: 'Air Conditions' },
    { id: 'breakfast', label: 'Breakfast Included' },
    { id: 'pool', label: 'Swimming Pool' },
    { id: 'roomService', label: 'Room Service' },
    { id: 'parking', label: 'Free Parking' },
    { id: 'coffee', label: 'Tea Coffee Maker' },
  ];

  // 2. State Input Change Mutator Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (label) => {
    setFormData((prev) => {
      const current = [...prev.amenities];
      const index = current.indexOf(label);
      if (index > -1) {
        current.splice(index, 1); // Remove if checked off
      } else {
        current.push(label); // Add if selected
      }
      return { ...prev, amenities: current };
    });
  };

  // 3. Submit Handler connecting to the Backend Route
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    // Transform flat state variables into the nested database schema layout
    const submissionPayload = {
      roomName: formData.roomName,
      roomType: formData.roomType,
      roomSize: Number(formData.roomSize),
      roomCapacity: {
        adults: Number(formData.adultsCapacity),
        children: Number(formData.childrenCapacity)
      },
      amenities: formData.amenities,
      description: formData.description,
      contactInfo: {
        contactName: formData.contactName,
        contactNumber: formData.contactNumber,
        email: formData.email
      },
      aboutLocation: formData.aboutLocation,
      pricingInfo: {
        basePrice: Number(formData.basePrice),
        paymentMethods: formData.paymentMethods
      }
    };

    try {
      // Modify target URL string path if your server port differs from 5000
      const response = await fetch('http://localhost:5000/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Validation error encountered updating database rows.');
      }

      setSuccessMessage('🎉 Room added to database successfully!');
      // Reset text identifiers safely
      setFormData((prev) => ({ ...prev, roomName: '' }));
    } catch (err) {
      setErrorMessage(err.message || 'Failed connecting to database API cluster nodes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-linear-to-b from-white to-[#A0DBFF] min-h-screen">
      <Header />
      
      {/* 1. HERO BANNER SECTION */}
      <section 
        className="relative h-112.5 w-full flex flex-col items-center justify-center text-center px-4 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600')` 
        }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Add Rooms of Accomodations
        </h1>
        <p className="text-base md:text-lg text-slate-800 font-medium mb-8">
          Fill in the Details to Create a New Room for <span className="font-bold">Your</span> Hotel!
        </p>
        
        <div className="relative w-full max-w-md shadow-md rounded-full">
          <input 
            type="text" 
            placeholder="Explore Room" 
            className="w-full px-6 py-3.5 bg-white rounded-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none pr-12"
          />
          <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
        </div>
      </section>

      {/* 2. MAIN INPUT DASHBOARD CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 -mt-12 relative z-10 pb-16">
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-6 md:p-10">
          
          {/* Header Indicator */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6 mb-8">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <FaBuilding className="text-xl text-slate-700" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Room Details</h2>
          </div>

          {/* Feedback banners notification nodes */}
          {successMessage && <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold">{successMessage}</div>}
          {errorMessage && <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-semibold">{errorMessage}</div>}

          {/* Form Split Layout */}
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8" onSubmit={handleSubmit}>
            
            {/* ================= LEFT COLUMN ================= */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Room Name *</label>
                <input 
                  type="text" 
                  name="roomName"
                  required
                  value={formData.roomName}
                  onChange={handleChange}
                  placeholder="e.g., Deluxe Double Room 401"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-md text-sm text-slate-800 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              {/* Room Type Custom Dropdown Selector */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-700 mb-2">Room Type</label>
                <button
                  type="button"
                  onClick={() => setRoomTypeOpen(!roomTypeOpen)}
                  className="w-full text-left flex justify-between items-center px-4 py-2.5 border border-slate-300 rounded-md text-sm text-slate-600 bg-white"
                >
                  <span>{formData.roomType}</span>
                  <span className="text-xs">▼</span>
                </button>
                {roomTypeOpen && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-20 overflow-hidden">
                    {['Standard Room', 'Deluxe Room', 'Family Suite', 'Conference Room', 'Event Space'].map((type) => (
                      <div
                        key={type}
                        onClick={() => { setFormData(prev => ({...prev, roomType: type})); setRoomTypeOpen(false); }}
                        className={`px-4 py-2 text-sm cursor-pointer transition-colors ${formData.roomType === type ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Room Size and Capacities setup row matrices */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Room Size (sqm)</label>
                  <input type="number" name="roomSize" value={formData.roomSize} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-md text-sm text-slate-600 bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Adults Limit</label>
                  <input type="number" name="adultsCapacity" value={formData.adultsCapacity} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-md text-sm text-slate-600 bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Children Limit</label>
                  <input type="number" name="childrenCapacity" value={formData.childrenCapacity} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-md text-sm text-slate-600 bg-white focus:outline-none" />
                </div>
              </div>

              {/* Amenities List Checklist */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-slate-700">Select Amenities</label>
                </div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 max-h-40 overflow-y-auto pr-2">
                  {amenitiesList.map((amenity) => (
                    <label key={amenity.id} className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={formData.amenities.includes(amenity.label)}
                        onChange={() => handleAmenityToggle(amenity.label)}
                        className="w-3.5 h-3.5 accent-[#007bff] border-slate-300 rounded"
                      />
                      {amenity.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Description Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Description</label>
                <div className="border border-slate-300 rounded-md overflow-hidden">
                  <div className="flex items-center gap-4 px-3 py-2 bg-slate-50 border-b border-slate-200 text-slate-500 text-xs">
                    <FaBold className="cursor-pointer" /> <FaItalic className="cursor-pointer" /> <FaUnderline className="cursor-pointer" />
                  </div>
                  <textarea 
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-3 text-xs text-slate-600 leading-relaxed focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Contact Information Sub-block */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
                  <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-[10px]">📇</span>
                  Contact Information
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Contact Name *</label>
                  <input type="text" name="contactName" required value={formData.contactName} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-xs text-slate-700 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Contact Number *</label>
                  <input type="text" name="contactNumber" required value={formData.contactNumber} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-xs text-slate-700 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Contact Email *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-xs text-slate-700 focus:outline-none" />
                </div>
              </div>

            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Uploaded Room Images</label>
                <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=600" alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Drag and Drop placeholder blocks layout */}
              <div className="bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-xl p-6 text-center hover:bg-blue-50 transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <FaCloudUploadAlt className="text-3xl text-blue-500 mb-2" />
                  <p className="text-xs font-bold text-slate-700 mb-1">Image uploads processed automatically</p>
                </div>
              </div>

              {/* Location & Pricing Content Wrapper Box */}
              <div className="border border-slate-300 rounded-xl p-5 bg-white space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
                  <FaMapMarkerAlt className="text-blue-500 text-sm" /> Location & Pricing
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">About the Location</label>
                  <textarea rows={3} name="aboutLocation" value={formData.aboutLocation} onChange={handleChange} className="w-full p-2.5 bg-white border border-slate-200 rounded text-xs text-slate-600 leading-relaxed focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Base Price (per night) *</label>
                  <input type="number" name="basePrice" required value={formData.basePrice} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Preferred Payment Fallback Method</label>
                  <select name="paymentMethods" value={formData.paymentMethods} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded bg-white text-xs text-slate-600 focus:outline-none">
                    <option value="Online">Online</option>
                    <option value="Card">Card</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                {/* Submit action execution button row layout matrix */}
                <div className="pt-4 flex items-center justify-end">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#007bff] hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md cursor-pointer disabled:bg-slate-400"
                  >
                    {loading ? 'Processing Database Transaction...' : 'Publish Room Configuration'}
                  </button>
                </div>
              </div>

            </div>
          </form>

        </div>
      </main>
      <Footer />
    </div>
  );
}