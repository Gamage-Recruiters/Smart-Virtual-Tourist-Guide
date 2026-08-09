import React, { useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import HotelAvailabilityCard from "../../components/booking&reservation/serviceAvailability/HotelAvailabilityCard";
import { 
  FaArrowLeft, FaMapMarkerAlt, FaStar, FaWifi, 
  FaSwimmingPool, FaDumbbell, FaSpa, FaUtensils, 
  FaParking, FaCheckCircle, FaTimesCircle, FaShieldAlt, FaMedkit, FaPhoneAlt
} from 'react-icons/fa';

const HotelBooking = () => {
    const location = useLocation();
    const hotel = location.state?.hotel;
    
    const [selectedRoom, setSelectedRoom] = useState(null);
    const availabilityCardRef = useRef(null);

    const handleSelectRoom = (room) => {
        setSelectedRoom(room);
        availabilityCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        toast(`Selected ${room.name}. Please select your booking dates to continue.`, { icon: '📅' });
    };

    // Fallback if no hotel was passed via state
    const displayHotel = hotel || {
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        name: "Ocean Breeze Resort",
        location: "Bentota, Southern Province, Sri Lanka",
        rating: 4.8,
        reviews: 234,
        description: "Experience luxury at Ocean Breeze Resort, a stunning beachfront property located on the pristine shores of Bentota. Our resort offers world-class amenities, exceptional service, and breathtaking ocean views that will make your Sri Lankan getaway unforgettable.",
        price: '150' // Changed to dollar figure from screenshot
    };

    return (
        <div className="bg-[#EBF1FF] min-h-screen flex flex-col font-sans">
            <Header />
            
            <main className="flex-grow max-w-[1200px] mx-auto w-full px-4 sm:px-6 py-8 mt-20">
                {/* Inner white card container */}
                <div className="bg-white rounded-[2rem] p-6 lg:p-10 shadow-sm relative overflow-hidden">
                    
                    {/* Back Button */}
                    <Link to="/hotels" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm mb-6 transition-colors">
                        <FaArrowLeft className="mr-2" /> Back to Hotels
                    </Link>

                    {/* Image Gallery */}
                    <div className="mb-8">
                        <div className="w-full h-[400px] rounded-2xl overflow-hidden mb-4">
                            <img src={displayHotel.image} alt={displayHotel.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-[200px] rounded-2xl overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9" alt="Hotel Interior" className="w-full h-full object-cover" />
                            </div>
                            <div className="h-[200px] rounded-2xl overflow-hidden relative group cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4" alt="Hotel Pool" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                </div>
                            </div>
                        </div>
                        <button className="mt-4 flex items-center text-sm font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            View all 24 photos
                        </button>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Left Column */}
                        <div className="lg:col-span-2">
                            
                            {/* Header Info */}
                            <div className="mb-6">
                                <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{displayHotel.name}</h1>
                                <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4">
                                    <div className="flex items-center">
                                        <FaMapMarkerAlt className="text-blue-500 mr-1.5" />
                                        {displayHotel.location}
                                    </div>
                                    <div className="flex items-center">
                                        <FaStar className="text-yellow-400 mr-1.5" />
                                        <span className="font-bold text-gray-800">{displayHotel.rating}</span> 
                                        <span className="ml-1">({displayHotel.reviews} reviews)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-sm leading-relaxed mb-8">
                                {displayHotel.description}
                            </p>

                            {/* Amenities & Policies Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-4">Amenities</h3>
                                    <ul className="space-y-3 text-sm text-gray-600">
                                        <li className="flex items-center"><FaWifi className="mr-3 text-gray-400 w-4 h-4"/> Free Wi-Fi</li>
                                        <li className="flex items-center"><FaSwimmingPool className="mr-3 text-gray-400 w-4 h-4"/> Infinity Pool</li>
                                        <li className="flex items-center"><FaDumbbell className="mr-3 text-gray-400 w-4 h-4"/> Fitness Center</li>
                                        <li className="flex items-center"><FaSpa className="mr-3 text-gray-400 w-4 h-4"/> Spa & Wellness</li>
                                        <li className="flex items-center"><FaUtensils className="mr-3 text-gray-400 w-4 h-4"/> 3 Restaurants</li>
                                        <li className="flex items-center"><FaParking className="mr-3 text-gray-400 w-4 h-4"/> Free Parking</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-4">Policies</h3>
                                    <ul className="space-y-4 text-sm text-gray-600">
                                        <li className="flex items-start">
                                            <FaCheckCircle className="mr-3 text-blue-500 w-4 h-4 mt-0.5 shrink-0"/> 
                                            <div>
                                                <span className="block font-semibold">Check-in: 2:00 PM</span>
                                                <span className="block text-gray-500">Check-out: 11:00 AM</span>
                                            </div>
                                        </li>
                                        <li className="flex items-center"><FaCheckCircle className="mr-3 text-blue-500 w-4 h-4"/> Non-smoking rooms available</li>
                                        <li className="flex items-center"><FaCheckCircle className="mr-3 text-blue-500 w-4 h-4"/> Pet-friendly</li>
                                        <li className="flex items-center"><FaTimesCircle className="mr-3 text-red-500 w-4 h-4"/> No cancellation fee up to 48 h</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Available Rooms */}
                            <div className="mb-10">
                                <h3 className="font-bold text-xl text-gray-900 mb-6">Available Rooms</h3>
                                <div className="space-y-4">
                                    {/* Room 1 */}
                                    <div className={`rounded-2xl p-4 flex flex-col sm:flex-row gap-4 border transition-all ${selectedRoom?.name === 'Ocean View Suite' ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500' : 'bg-[#F8FAFC] border-gray-100'}`}>
                                        <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427" alt="Ocean View Suite" className="w-full sm:w-40 h-32 object-cover rounded-xl shrink-0" />
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-gray-900">Ocean View Suite</h4>
                                                    <div className="text-right">
                                                        <span className="font-black text-lg text-gray-900">$180</span>
                                                        <span className="block text-[10px] text-gray-500">per night</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 mb-2">King bed • Ocean view • 50 m²</p>
                                                <div className="flex flex-wrap gap-2 text-[10px] text-gray-500 font-medium">
                                                    <span className="bg-white px-2 py-1 rounded border border-gray-200">Free Wi-Fi</span>
                                                    <span className="bg-white px-2 py-1 rounded border border-gray-200">Balcony</span>
                                                    <span className="bg-white px-2 py-1 rounded border border-gray-200">Mini Bar</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-end mt-4">
                                                <span className="text-xs font-bold text-green-600">Only 2 rooms left</span>
                                                <button onClick={() => handleSelectRoom({ name: 'Ocean View Suite', price: 180 })} className={`${selectedRoom?.name === 'Ocean View Suite' ? 'bg-green-600 hover:bg-green-700 shadow-sm' : 'bg-blue-600 hover:bg-blue-700'} text-white text-xs font-bold px-6 py-2.5 rounded-lg transition`}>
                                                    {selectedRoom?.name === 'Ocean View Suite' ? 'Selected ✓' : 'Select Room'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Room 2 */}
                                    <div className={`rounded-2xl p-4 flex flex-col sm:flex-row gap-4 border transition-all ${selectedRoom?.name === 'Deluxe Garden Room' ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500' : 'bg-[#F8FAFC] border-gray-100'}`}>
                                        <img src="https://images.unsplash.com/photo-1598928506311-c55dd1b67272" alt="Deluxe Garden Room" className="w-full sm:w-40 h-32 object-cover rounded-xl shrink-0" />
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-gray-900">Deluxe Garden Room</h4>
                                                    <div className="text-right">
                                                        <span className="font-black text-lg text-gray-900">$120</span>
                                                        <span className="block text-[10px] text-gray-500">per night</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 mb-2">Twin beds • Garden view • 35 m²</p>
                                                <div className="flex flex-wrap gap-2 text-[10px] text-gray-500 font-medium">
                                                    <span className="bg-white px-2 py-1 rounded border border-gray-200">Free Wi-Fi</span>
                                                    <span className="bg-white px-2 py-1 rounded border border-gray-200">Air Conditioning</span>
                                                    <span className="bg-white px-2 py-1 rounded border border-gray-200">Safe</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-end mt-4">
                                                <span className="text-xs font-bold text-green-600">5 rooms available</span>
                                                <button onClick={() => handleSelectRoom({ name: 'Deluxe Garden Room', price: 120 })} className={`${selectedRoom?.name === 'Deluxe Garden Room' ? 'bg-green-600 hover:bg-green-700 shadow-sm' : 'bg-blue-600 hover:bg-blue-700'} text-white text-xs font-bold px-6 py-2.5 rounded-lg transition`}>
                                                    {selectedRoom?.name === 'Deluxe Garden Room' ? 'Selected ✓' : 'Select Room'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Guest Reviews */}
                            <div>
                                <div className="flex justify-between items-baseline mb-6">
                                    <h3 className="font-bold text-xl text-gray-900">Guest Reviews</h3>
                                    <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">View all reviews</a>
                                </div>
                                <div className="space-y-6">
                                    {/* Review 1 */}
                                    <div className="border-b border-gray-100 pb-6">
                                        <div className="flex items-center mb-2">
                                            <div className="w-8 h-8 bg-blue-100 text-blue-600 font-bold rounded-full flex items-center justify-center mr-3 text-sm">H</div>
                                            <div>
                                                <div className="font-bold text-sm text-gray-900">Harithularitham</div>
                                                <div className="flex items-center text-[10px] text-gray-500">
                                                    <div className="flex text-yellow-400 mr-2">
                                                        <FaStar/><FaStar/><FaStar/><FaStar/><FaStar/>
                                                    </div>
                                                    2 days ago
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-600 pl-11">
                                            Amazing resort with exceptional service. The ocean view from our suite was breathtaking, and the staff went above and beyond to make our stay memorable. Highly recommended!
                                        </p>
                                    </div>
                                    {/* Review 2 */}
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <div className="w-8 h-8 bg-green-100 text-green-600 font-bold rounded-full flex items-center justify-center mr-3 text-sm">R</div>
                                            <div>
                                                <div className="font-bold text-sm text-gray-900">Ravindu prabhat</div>
                                                <div className="flex items-center text-[10px] text-gray-500">
                                                    <div className="flex text-yellow-400 mr-2">
                                                        <FaStar/><FaStar/><FaStar/><FaStar/><FaStar className="text-gray-300"/>
                                                    </div>
                                                    1 week ago
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-600 pl-11">
                                            Beautiful location and great amenities. The pool area is stunning and the food at the restaurant was delicious. Only minor issue was the Wi-Fi speed in some areas.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Right Column (Sidebar) */}
                        <div className="lg:col-span-1" ref={availabilityCardRef}>
                            <div className="sticky top-24 space-y-6">
                                <HotelAvailabilityCard hotel={displayHotel} selectedRoom={selectedRoom} />
                                
                                {/* Safety Features */}
                                <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                        <FaShieldAlt className="text-blue-500 mr-2" /> Safety Features
                                    </h4>
                                    <ul className="space-y-3 text-sm text-gray-600">
                                        <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2 w-3.5 h-3.5"/> 24/7 Security</li>
                                        <li className="flex items-center"><FaMedkit className="text-blue-500 mr-2 w-3.5 h-3.5"/> Medical Assistance</li>
                                        <li className="flex items-center"><FaPhoneAlt className="text-red-500 mr-2 w-3.5 h-3.5"/> Emergency Contacts</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HotelBooking;
