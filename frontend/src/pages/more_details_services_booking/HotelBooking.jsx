import React, { useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import HotelAvailabilityCard from "../../components/booking&reservation/serviceAvailability/HotelAvailabilityCard";
import { 
  FaArrowLeft, FaMapMarkerAlt, FaStar, FaWifi, 
  FaSwimmingPool, FaDumbbell, FaSpa, FaUtensils, 
  FaParking, FaCheckCircle, FaTimesCircle, FaShieldAlt, FaMedkit, FaPhoneAlt,
  FaGift, FaTag
} from 'react-icons/fa';

const HotelBooking = () => {
    const location = useLocation();
    const hotel = location.state?.hotel;
    
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [packages, setPackages] = useState([]);
    const [loadingPackages, setLoadingPackages] = useState(true);
    const availabilityCardRef = useRef(null);

    const handleSelectRoom = (room) => {
        setSelectedRoom(room);
        availabilityCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        toast(`Selected ${room.name}. Please select your booking dates to continue.`, { icon: '📅' });
    };

    const handleSelectPackage = (pkg) => {
        const rawPrice = pkg.locationAndPricing?.[0]?.basePrice || 25000;
        const discountPct = pkg.discount?.discountPercent || 0;
        const discountAmt = pkg.discount?.discountAmountPerNight || 0;
        let finalPrice = rawPrice;
        if (discountPct > 0) {
            finalPrice = rawPrice * (1 - discountPct / 100);
        } else if (discountAmt > 0) {
            finalPrice = Math.max(0, rawPrice - discountAmt);
        }
        
        setSelectedRoom({
            id: pkg._id,
            name: `${pkg.packageName} (Special Package)`,
            price: finalPrice,
            isPackage: true,
            ...pkg
        });
        availabilityCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        toast(`Selected package: ${pkg.packageName}. Please select your booking dates to continue.`, { icon: '🎁' });
    };

    // Hotel details fallback
    const displayHotel = {
        _id: hotel?.hotelId || hotel?._id || hotel?.ownerId,
        hotelId: hotel?.hotelId || hotel?._id,
        ownerId: hotel?.ownerId || hotel?._id,
        image: hotel?.image || (hotel?.images && hotel?.images[0]) || "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        images: hotel?.images && hotel?.images.length > 0 ? hotel.images : ["https://images.unsplash.com/photo-1566073771259-6a8506099945", "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9", "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"],
        name: hotel?.name || hotel?.hotelName || "Ocean Breeze Resort",
        location: hotel?.location || hotel?.hotelAddress || "Bentota, Southern Province, Sri Lanka",
        rating: hotel?.userRating || hotel?.starRating || 4.8,
        reviews: hotel?.reviews || 120,
        description: hotel?.description || "Experience luxury at this premier hotel property, offering top-tier amenities, comfortable rooms, and unforgettable hospitality.",
        numericPrice: hotel?.numericPrice || 20000,
        currency: 'LKR'
    };

    // Fetch dynamic rooms & packages from backend using hotelId / ownerId
    React.useEffect(() => {
        const hotelOwnerId = hotel?._id || hotel?.ownerId;

        const fetchHotelRooms = async () => {
            setLoadingRooms(true);
            try {
                const url = hotelOwnerId 
                    ? `http://localhost:5000/api/hotels/rooms?hotelId=${hotelOwnerId}`
                    : 'http://localhost:5000/api/hotels/rooms';
                const res = await fetch(url);
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    setRooms(data.data);
                    if (data.data.length > 0) {
                        const firstRoom = data.data[0];
                        const basePrice = firstRoom.locationAndPricing?.[0]?.basePrice || 20000;
                        setSelectedRoom((prev) => prev || { id: firstRoom._id, name: firstRoom.roomName, price: basePrice, ...firstRoom });
                    }
                } else {
                    setRooms([]);
                }
            } catch (err) {
                console.error("Error fetching rooms for hotel:", err);
                setRooms([]);
            } finally {
                setLoadingRooms(false);
            }
        };

        const fetchHotelPackages = async () => {
            setLoadingPackages(true);
            try {
                const url = hotelOwnerId 
                    ? `http://localhost:5000/api/hotels/packages?hotelId=${hotelOwnerId}`
                    : 'http://localhost:5000/api/hotels/packages';
                const res = await fetch(url);
                const data = await res.json();
                if (data.success) {
                    setPackages(data.data);
                } else {
                    setPackages([]);
                }
            } catch (err) {
                console.error("Error fetching packages for hotel:", err);
                setPackages([]);
            } finally {
                setLoadingPackages(false);
            }
        };

        fetchHotelRooms();
        fetchHotelPackages();
    }, [hotel]);

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
                                <img src={displayHotel.images[1] || displayHotel.image} alt="Hotel Interior" className="w-full h-full object-cover" />
                            </div>
                            <div className="h-[200px] rounded-2xl overflow-hidden relative group cursor-pointer">
                                <img src={displayHotel.images[2] || displayHotel.image} alt="Hotel View" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                </div>
                            </div>
                        </div>
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
                                        <li className="flex items-center"><FaUtensils className="mr-3 text-gray-400 w-4 h-4"/> Dining & Restaurant</li>
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
                                        <li className="flex items-center"><FaCheckCircle className="mr-3 text-blue-500 w-4 h-4"/> Pet-friendly options</li>
                                        <li className="flex items-center"><FaTimesCircle className="mr-3 text-red-500 w-4 h-4"/> Flexible cancellation up to 48h</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Available Rooms */}
                            <div className="mb-10">
                                <h3 className="font-bold text-xl text-gray-900 mb-6">Available Rooms</h3>
                                {loadingRooms ? (
                                    <div className="text-sm text-gray-500 py-4 font-medium animate-pulse">Loading rooms...</div>
                                ) : rooms.length === 0 ? (
                                    <div className="text-sm text-gray-500 py-4 bg-gray-50 rounded-xl p-4 text-center">
                                        No rooms currently listed for this hotel.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {rooms.map((room) => {
                                            const basePrice = room.locationAndPricing?.[0]?.basePrice || 20000;
                                            const roomImage = (room.images && room.images.length > 0) ? room.images[0] : displayHotel.image;
                                            const isSelected = selectedRoom?.id === room._id || selectedRoom?.name === room.roomName;

                                            return (
                                                <div 
                                                    key={room._id} 
                                                    className={`rounded-2xl p-4 flex flex-col sm:flex-row gap-4 border transition-all ${isSelected ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500' : 'bg-[#F8FAFC] border-gray-100'}`}
                                                >
                                                    <img src={roomImage} alt={room.roomName} className="w-full sm:w-40 h-32 object-cover rounded-xl shrink-0" />
                                                    <div className="flex-1 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex justify-between items-start mb-1">
                                                                <div>
                                                                    <h4 className="font-bold text-gray-900 text-base">{room.roomName}</h4>
                                                                    <span className="text-xs text-blue-600 font-semibold">{room.roomType}</span>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="font-black text-lg text-gray-900">LKR {basePrice.toLocaleString()}</span>
                                                                    <span className="block text-[10px] text-gray-500">per night</span>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mb-2">
                                                                {room.capacity?.adults || 2} Adults{room.capacity?.children ? `, ${room.capacity.children} Children` : ''} • {room.roomSize} {room.measureType || 'sqm'}
                                                            </p>
                                                            <div className="flex flex-wrap gap-2 text-[10px] text-gray-500 font-medium">
                                                                {(room.amenities || []).map((amenity, idx) => (
                                                                    <span key={idx} className="bg-white px-2 py-1 rounded border border-gray-200 capitalize">
                                                                        {amenity}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between items-end mt-4">
                                                            <span className="text-xs font-bold text-green-600">
                                                                {room.roomStatus === 'Available' ? 'Available' : room.roomStatus}
                                                            </span>
                                                            <button 
                                                                onClick={() => handleSelectRoom({ id: room._id, name: room.roomName, price: basePrice, ...room })} 
                                                                className={`${isSelected ? 'bg-green-600 hover:bg-green-700 shadow-sm' : 'bg-blue-600 hover:bg-blue-700'} text-white text-xs font-bold px-6 py-2.5 rounded-lg transition`}
                                                            >
                                                                {isSelected ? 'Selected ✓' : 'Select Room'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Special Package Section */}
                            <div className="mb-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm">
                                            <FaGift className="w-4 h-4" />
                                        </div>
                                        <h3 className="font-bold text-xl text-gray-900">Special Packages</h3>
                                    </div>
                                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                                        Exclusive Deals
                                    </span>
                                </div>

                                {loadingPackages ? (
                                    <div className="text-sm text-gray-500 py-4 font-medium animate-pulse">Loading special packages...</div>
                                ) : packages.length === 0 ? (
                                    <div className="text-sm text-gray-500 py-6 bg-amber-50/50 border border-amber-100 rounded-xl p-4 text-center">
                                        No special packages currently available for this hotel.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {packages.map((pkg) => {
                                            const basePrice = pkg.locationAndPricing?.[0]?.basePrice || 25000;
                                            const discountPct = pkg.discount?.discountPercent;
                                            const discountAmt = pkg.discount?.discountAmountPerNight;
                                            let discountedPrice = basePrice;
                                            if (discountPct > 0) {
                                                discountedPrice = basePrice * (1 - discountPct / 100);
                                            } else if (discountAmt > 0) {
                                                discountedPrice = Math.max(0, basePrice - discountAmt);
                                            }

                                            const pkgImage = (pkg.images && pkg.images.length > 0) ? pkg.images[0] : displayHotel.image;
                                            const isSelected = selectedRoom?.id === pkg._id || selectedRoom?.name?.includes(pkg.packageName);

                                            return (
                                                <div 
                                                    key={pkg._id} 
                                                    className={`rounded-2xl p-5 border transition-all relative overflow-hidden ${isSelected ? 'bg-amber-50/60 border-amber-500 shadow-md ring-1 ring-amber-500' : 'bg-gradient-to-r from-[#FFFDF9] to-[#FDFBF7] border-amber-100 hover:border-amber-300 hover:shadow-sm'}`}
                                                >
                                                    {/* Badge if discount exists */}
                                                    {(discountPct > 0 || discountAmt > 0) && (
                                                        <div className="absolute top-0 right-0 bg-gradient-to-l from-red-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
                                                            <FaTag className="w-2.5 h-2.5" />
                                                            {discountPct > 0 ? `${discountPct}% OFF` : `LKR ${discountAmt} OFF`}
                                                        </div>
                                                    )}

                                                    <div className="flex flex-col sm:flex-row gap-5">
                                                        <div className="relative w-full sm:w-44 h-36 shrink-0 rounded-xl overflow-hidden">
                                                            <img src={pkgImage} alt={pkg.packageName} className="w-full h-full object-cover" />
                                                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-medium">
                                                                Package Deal
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 flex flex-col justify-between">
                                                            <div>
                                                                <div className="flex justify-between items-start mb-1 pr-16 sm:pr-0">
                                                                    <div>
                                                                        <h4 className="font-extrabold text-gray-900 text-lg">{pkg.packageName}</h4>
                                                                        <div className="flex items-center gap-2 mt-0.5">
                                                                            <span className="text-xs text-amber-700 font-semibold bg-amber-100/70 px-2 py-0.5 rounded">
                                                                                {pkg.roomType}
                                                                            </span>
                                                                            {pkg.roomSize && (
                                                                                <span className="text-xs text-gray-500">
                                                                                    • {pkg.roomSize} {pkg.measureType || 'sqm'}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        {discountedPrice < basePrice ? (
                                                                            <div>
                                                                                <span className="text-xs text-gray-400 line-through mr-1">LKR {basePrice.toLocaleString()}</span>
                                                                                <span className="font-black text-xl text-amber-600">LKR {discountedPrice.toLocaleString()}</span>
                                                                            </div>
                                                                        ) : (
                                                                            <span className="font-black text-xl text-gray-900">LKR {basePrice.toLocaleString()}</span>
                                                                        )}
                                                                        <span className="block text-[10px] text-gray-500">per night</span>
                                                                    </div>
                                                                </div>

                                                                <p className="text-xs text-gray-600 line-clamp-2 my-2">
                                                                    {pkg.description}
                                                                </p>

                                                                <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-500 font-medium">
                                                                    <span className="bg-white px-2 py-1 rounded border border-amber-200 text-amber-900 font-semibold">
                                                                        👥 {pkg.capacity?.adults || 2} Adults{pkg.capacity?.children ? `, ${pkg.capacity.children} Children` : ''}
                                                                    </span>
                                                                    {(pkg.amenities || []).map((amenity, idx) => (
                                                                        <span key={idx} className="bg-white px-2 py-1 rounded border border-gray-200 capitalize">
                                                                            {amenity}
                                                                        </span>
                                                                    ))}
                                                                    {pkg.discount?.promoCode && (
                                                                        <span className="bg-amber-100 text-amber-800 font-bold px-2 py-1 rounded border border-amber-300">
                                                                            Code: {pkg.discount.promoCode}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex justify-between items-end mt-4 pt-2 border-t border-amber-100/60">
                                                                <div className="text-[11px] text-amber-800 font-medium">
                                                                    {pkg.discount?.validTo && (
                                                                        <span>Valid until: {pkg.discount.validTo}</span>
                                                                    )}
                                                                </div>
                                                                <button 
                                                                    onClick={() => handleSelectPackage(pkg)} 
                                                                    className={`${isSelected ? 'bg-green-600 hover:bg-green-700 shadow-sm' : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'} text-white text-xs font-bold px-6 py-2.5 rounded-lg transition shadow-xs`}
                                                                >
                                                                    {isSelected ? 'Selected ✓' : 'Select Package'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
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
