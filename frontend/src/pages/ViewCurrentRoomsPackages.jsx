import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer.jsx";
import { FaUsers, FaRulerCombined, FaDollarSign, FaTree, FaWifi, FaWind, FaTimes, FaChevronLeft, FaChevronRight, FaImages } from "react-icons/fa";
import ViewCurrentRoomImg from "../assets/ViewCurrentRoomImg.png";
import del from "../assets/del.png";
import edit from "../assets/edit.png";


export default function ViewCurrentRoomsPackages() {
    const [activeTab, setActiveTab] = useState('rooms');
    const packagesRef = React.useRef(null);
    const navigate = useNavigate();

    const [rooms, setRooms] = useState([]);
    const [roomsLoading, setRoomsLoading] = useState(true);
    const [roomsError, setRoomsError] = useState('');
    const [imagePopup, setImagePopup] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const handleDeleteConfirmed = async () => {
        const id = deleteConfirm;
        setDeleteConfirm(null);
        try {
            const res = await fetch(`http://localhost:5000/api/rooms/${id}`, { method: 'DELETE' });
            if (res.ok) setRooms((prev) => prev.filter((r) => r._id !== id));
        } catch {}
    };

    const [packages, setPackages] = useState([]);
    const [packagesLoading, setPackagesLoading] = useState(true);
    const [packagesError, setPackagesError] = useState('');
    const [deletePackageConfirm, setDeletePackageConfirm] = useState(null);

    const handleDeletePackageConfirmed = async () => {
        const id = deletePackageConfirm;
        setDeletePackageConfirm(null);
        try {
            const res = await fetch(`http://localhost:5000/api/packages/${id}`, { method: 'DELETE' });
            if (res.ok) setPackages((prev) => prev.filter((p) => p._id !== id));
        } catch {}
    };

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const hotelId = userData.hotels?.[0]?._id;
        const url = hotelId
            ? `http://localhost:5000/api/rooms?hotelId=${hotelId}`
            : 'http://localhost:5000/api/rooms';
        fetch(url)
            .then((res) => res.json())
            .then((data) => { setRooms(data.rooms || []); setRoomsLoading(false); })
            .catch(() => { setRoomsError('Failed to load rooms.'); setRoomsLoading(false); });
    }, []);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const hotelId = userData.hotels?.[0]?._id;
        const url = hotelId
            ? `http://localhost:5000/api/packages?hotelId=${hotelId}`
            : 'http://localhost:5000/api/packages';
        fetch(url)
            .then((res) => res.json())
            .then((data) => { setPackages(data.packages || []); setPackagesLoading(false); })
            .catch(() => { setPackagesError('Failed to load packages.'); setPackagesLoading(false); });
    }, []);

    const PackageCard = ({ item, buttons }) => {
        const BASE_URL = 'http://localhost:5000';
        const images = Array.isArray(item.images)
            ? item.images.filter(Boolean).map((img) => img.startsWith('http') ? img : `${BASE_URL}${img}`)
            : [];
        const displayImage = images[0] || ViewCurrentRoomImg;
        const hasMultiple = images.length > 1;
        const pricing = Array.isArray(item.locationAndPricing) && item.locationAndPricing[0];
        const price = pricing ? `${pricing.basePrice} $` : '—';
        const capacityStr = item.capacity
            ? `${item.capacity.adults} Adult${item.capacity.adults !== 1 ? 's' : ''}${item.capacity.children > 0 ? `, ${item.capacity.children} Child${item.capacity.children !== 1 ? 'ren' : ''}` : ''}`
            : '—';
        const amenities = Array.isArray(item.amenities) ? item.amenities.slice(0, 4) : [];
        const discount = item.discount?.discountPercent ? `${item.discount.discountPercent}% OFF` : null;
        return (
            <div className="flex flex-col rounded-2xl bg-white p-5 shadow-[0_18px_40px_rgba(31,41,55,0.12)] w-full">
                <div className="flex flex-row gap-8">
                    <div className="relative shrink-0 overflow-hidden rounded-xl w-[150px] h-[150px] cursor-pointer group"
                        onClick={() => hasMultiple && setImagePopup({ images, index: 0 })}>
                        <img src={displayImage} alt={item.packageName} className="h-full w-full object-cover" />
                        {hasMultiple && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="flex items-center gap-1 text-white text-xs font-bold">
                                    <FaImages /> {images.length} photos
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                            {discount && <span className="text-[10px] font-semibold text-rose-500 uppercase tracking-wide">{discount}</span>}
                            <h2 className="text-base font-extrabold leading-tight text-slate-900 mb-2">{item.packageName}</h2>
                        </div>
                        <div className="space-y-2 text-sm font-medium text-slate-700">
                            <div className="flex items-center gap-1.5">
                                <FaUsers className="text-slate-900" />
                                <span className="font-semibold text-slate-900">Capacity:</span>
                                <span className="text-slate-500">{capacityStr}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-400 text-[10px] text-slate-900"><FaDollarSign /></span>
                                <span className="font-semibold text-slate-900">Price:</span>
                                <span className="text-slate-500">{price}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-row flex-wrap items-center gap-5 text-xs font-medium text-slate-600">
                    {amenities.length > 0
                        ? amenities.map((a) => (
                            <span key={a} className="flex items-center gap-1">
                                {AMENITY_ICONS[a] || <FaWind className="text-slate-400" />} {a}
                            </span>
                        ))
                        : <span className="text-slate-400">No amenities listed</span>
                    }
                </div>
                <div className="mt-3 flex items-center justify-center gap-6">
                    {buttons}
                </div>
            </div>
        );
    };

    const AMENITY_ICONS = {
        'Terrace': <FaWind className="text-slate-400" />,
        'Garden View': <FaTree className="text-slate-400" />,
        'Free WiFi': <FaWifi className="text-slate-400" />,
        'Air Conditions': <FaWind className="text-slate-400" />,
    };

    const RoomCard = ({ item, buttons }) => {
        // Collect all non-empty images from the images array field
        const BASE_URL = 'http://localhost:5000';
        const images = Array.isArray(item.images)
            ? item.images.filter(Boolean).map((img) => img.startsWith('http') ? img : `${BASE_URL}${img}`)
            : item.image ? [item.image] : [];
        const displayImage = images[0] || ViewCurrentRoomImg;
        const hasMultiple = images.length > 1;

        const pricing = Array.isArray(item.locationAndPricing) && item.locationAndPricing[0];
        const price = pricing ? `${pricing.basePrice} $` : '—';
        const capacityStr = item.capacity
            ? `${item.capacity.adults} Adult${item.capacity.adults !== 1 ? 's' : ''}${item.capacity.children > 0 ? `, ${item.capacity.children} Child${item.capacity.children !== 1 ? 'ren' : ''}` : ''}`
            : '—';
        const sizeStr = item.roomSize ? `${item.roomSize} ${item.measureType || ''}`.trim() : '—';
        const amenities = Array.isArray(item.amenities) ? item.amenities.slice(0, 4) : [];

        return (
            <div className="flex flex-col rounded-2xl bg-white p-5 shadow-[0_18px_40px_rgba(31,41,55,0.12)] w-full">
                <div className="flex flex-row gap-8">
                    <div className="relative shrink-0 overflow-hidden rounded-xl w-[150px] h-[150px] cursor-pointer group"
                        onClick={() => hasMultiple && setImagePopup({ images, index: 0 })}>
                        <img src={displayImage} alt={item.roomName} className="h-full w-full object-cover" />
                        {hasMultiple && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="flex items-center gap-1 text-white text-xs font-bold">
                                    <FaImages /> {images.length} photos
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                            <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wide">{item.roomNumber}</span>
                            <h2 className="text-base font-extrabold leading-tight text-slate-900 mb-2">{item.roomName}</h2>
                        </div>
                        <div className="space-y-4 text-sm font-medium text-slate-700">
                            <div className="flex items-center gap-1.5">
                                <FaUsers className="text-slate-900" />
                                <span className="font-semibold text-slate-900">Capacity:</span>
                                <span className="text-slate-500">{capacityStr}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <FaRulerCombined className="text-slate-900" />
                                <span className="font-semibold text-slate-900">Size:</span>
                                <span className="text-slate-500">{sizeStr}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-400 text-[10px] text-slate-900"><FaDollarSign /></span>
                                <span className="font-semibold text-slate-900">Price:</span>
                                <span className="text-slate-500">{price}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-row flex-wrap items-center gap-5 text-xs font-medium text-slate-600">
                    {amenities.length > 0
                        ? amenities.map((a) => (
                            <span key={a} className="flex items-center gap-1">
                                {AMENITY_ICONS[a] || <FaWind className="text-slate-400" />} {a}
                            </span>
                        ))
                        : <span className="text-slate-400">No amenities listed</span>
                    }
                </div>
                <div className="mt-3 flex items-center justify-center gap-6">
                    {buttons}
                </div>
            </div>
        );
    };

    return (
    <div>
        <div>
            <Header/>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-2xl shadow-2xl px-8 py-7 max-w-sm w-full mx-4 flex flex-col items-center gap-5">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100">
                        <img src={del} alt="delete" className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                        <p className="text-base font-bold text-slate-900 mb-1">Delete this room?</p>
                        <p className="text-sm text-slate-500">This action is permanent and cannot be undone.</p>
                    </div>
                    <div className="flex gap-3 w-full">
                        <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">Close</button>
                        <button onClick={handleDeleteConfirmed} className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors cursor-pointer">OK</button>
                    </div>
                </div>
            </div>
        )}
        {deletePackageConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-2xl shadow-2xl px-8 py-7 max-w-sm w-full mx-4 flex flex-col items-center gap-5">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100">
                        <img src={del} alt="delete" className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                        <p className="text-base font-bold text-slate-900 mb-1">Delete this package?</p>
                        <p className="text-sm text-slate-500">This action is permanent and cannot be undone.</p>
                    </div>
                    <div className="flex gap-3 w-full">
                        <button onClick={() => setDeletePackageConfirm(null)} className="flex-1 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">Close</button>
                        <button onClick={handleDeletePackageConfirmed} className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors cursor-pointer">OK</button>
                    </div>
                </div>
            </div>
        )}
        {/* Image Popup Overlay */}
        {imagePopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setImagePopup(null)}>
                <div className="relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                    {/* Close */}
                    <button
                        onClick={() => setImagePopup(null)}
                        className="absolute -top-10 right-0 text-white hover:text-slate-300 text-2xl"
                    >
                        <FaTimes />
                    </button>
                    {/* Image */}
                    <img
                        src={imagePopup.images[imagePopup.index]}
                        alt={`Room photo ${imagePopup.index + 1}`}
                        className="max-h-[75vh] max-w-[85vw] rounded-xl object-contain shadow-2xl"
                    />
                    {/* Counter */}
                    <p className="mt-3 text-white text-sm font-semibold">
                        {imagePopup.index + 1} / {imagePopup.images.length}
                    </p>
                    {/* Prev / Next */}
                    {imagePopup.images.length > 1 && (
                        <>
                            <button
                                onClick={() => setImagePopup((p) => ({ ...p, index: (p.index - 1 + p.images.length) % p.images.length }))}
                                className="absolute left-[-56px] top-1/2 -translate-y-1/2 text-white text-3xl hover:text-slate-300"
                            >
                                <FaChevronLeft />
                            </button>
                            <button
                                onClick={() => setImagePopup((p) => ({ ...p, index: (p.index + 1) % p.images.length }))}
                                className="absolute right-[-56px] top-1/2 -translate-y-1/2 text-white text-3xl hover:text-slate-300"
                            >
                                <FaChevronRight />
                            </button>
                        </>
                    )}
                    {/* Thumbnail strip */}
                    <div className="mt-4 flex gap-2">
                        {imagePopup.images.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt={`thumb ${i + 1}`}
                                onClick={() => setImagePopup((p) => ({ ...p, index: i }))}
                                className={`h-14 w-14 rounded-lg object-cover cursor-pointer border-2 transition-all ${
                                    i === imagePopup.index ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )}
        <main className="flex flex-1 flex-col" style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Hero Section */}
            <section
                className="relative h-screen w-full flex flex-col items-center justify-center px-4 bg-cover bg-center"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1)), url(${ViewCurrentRoomImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="flex max-w-3xl flex-col items-start gap-9 w-full ml-[90px] mb-[50px]">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Add Rooms of Accommodations
                    </h1>
                    <p className="text-base md:text-2xl text-slate-800 font-medium">
                        Fill in the Details to Create a New Room for <span className="font-bold">Your</span> Hotel!
                    </p>
                    <div className="relative w-full max-w-md shadow-md rounded-full">
                        <input
                            type="text"
                            placeholder="Explore Room"
                            className="w-full px-6 py-3.5 bg-white rounded-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none pr-12"
                        />
                        <svg className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8" strokeWidth="2"/><path strokeLinecap="round" strokeWidth="2" d="M21 21l-4.35-4.35"/></svg>
                    </div>
                </div>
            </section>

            {/* Room Types Section */}
            <div className="w-full flex flex-col">
            <section
                style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #A0DBFF 100%)' }}
                className="w-full p-5 pb-20 md:p-10 md:pb-24"
            >
                <div className="w-full mx-auto rounded-[28px] border border-white/70 bg-gradient-to-b from-white/95 via-[#f7fbff]/95 to-[#a9dbff]/95 p-6 shadow-[0_30px_70px_rgba(20,40,60,0.14)] backdrop-blur-sm md:p-10">
                    <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex w-full rounded-2xl bg-white/75 p-1.5 shadow-[0_10px_30px_rgba(31,41,55,0.08)] backdrop-blur-md sm:w-auto">
                            <button
                                onClick={() => setActiveTab('rooms')}
                                className={`flex-1 rounded-xl px-6 py-3 text-lg font-semibold transition-all sm:flex-initial ${
                                    activeTab === 'rooms'
                                        ? 'bg-[#dedede] text-slate-900 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Room Types
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('packages');
                                    packagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }}
                                className={`flex-1 rounded-xl px-6 py-3 text-sm font-semibold transition-all sm:flex-initial ${
                                    activeTab === 'packages'
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Special Packages
                            </button>
                        </div>
                        <button className="inline-flex items-center justify-center rounded-xl bg-[#1988ff] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(25,136,255,0.35)] transition-transform hover:-translate-y-0.5" onClick={() => navigate("/add-room-package")}>
                            + Add Room Type
                        </button>
                    </div>
                    <div className="rounded-[24px] border border-white/70 bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-md md:p-5">
                        {roomsLoading && <p className="text-center text-slate-500 py-8">Loading rooms...</p>}
                        {roomsError && <p className="text-center text-rose-500 py-8">{roomsError}</p>}
                        <div className="grid gap-4 lg:grid-cols-2">
                            {rooms.map((room) => (
                                <RoomCard key={room._id} item={room} buttons={
                                    <>
                                        <button className="w-32 rounded-md px-3 py-1 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer" style={{ backgroundColor: '#128D30' }} onClick={() => navigate(`/edit-room/${room._id}`)}><img src={edit} alt="" className="h-3.5 w-3.5" />Edit</button>
                                        <button className="w-32 rounded-md px-3 py-1 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer" style={{ backgroundColor: '#B71A1A' }} onClick={() => setDeleteConfirm(room._id)}><img src={del} alt="" className="h-3.5 w-3.5" />Delete</button>
                                    </>
                                }/>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Special Packages Section */}
            <section
                ref={packagesRef}
                style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #A0DBFF 100%)' }}
                className="w-full min-h-screen p-5 md:p-10"
            >
                <div className="w-full mx-auto rounded-[28px] border border-white/70 bg-gradient-to-b from-white/95 via-[#f7fbff]/95 to-[#a9dbff]/95 p-6 shadow-[0_30px_70px_rgba(20,40,60,0.14)] backdrop-blur-sm md:p-10">
                    <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex w-full rounded-2xl bg-white/75 p-1.5 shadow-[0_10px_30px_rgba(31,41,55,0.08)] backdrop-blur-md sm:w-auto">
                            <button className="flex-1 rounded-xl px-6 py-3 text-sx font-semibold bg-[#dedede] text-slate-900 shadow-sm sm:flex-initial">
                                Special Packages
                            </button>
                        </div>
                        <button className="inline-flex items-center justify-center rounded-xl bg-[#1988ff] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(25,136,255,0.35)] transition-transform hover:-translate-y-0.5" onClick={() => navigate("/add-special-package")}>
                            + Add Special Package
                        </button>
                    </div>
                    <div className="rounded-[24px] border border-white/70 bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-md md:p-5">
                        {packagesLoading && <p className="text-center text-slate-500 py-8">Loading packages...</p>}
                        {packagesError && <p className="text-center text-rose-500 py-8">{packagesError}</p>}
                        <div className="grid gap-4 lg:grid-cols-2">
                            {packages.map((pkg) => (
                                <PackageCard key={pkg._id} item={pkg} buttons={
                                    <>
                                        <button className="w-32 rounded-md px-3 py-1 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer" style={{ backgroundColor: '#128D30' }} onClick={() => navigate(`/edit-package/${pkg._id}`)}><img src={edit} alt="" className="h-3.5 w-3.5" />Edit</button>
                                        <button className="w-32 rounded-md px-3 py-1 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer" style={{ backgroundColor: '#B71A1A' }} onClick={() => setDeletePackageConfirm(pkg._id)}><img src={del} alt="" className="h-3.5 w-3.5" />Delete</button>
                                    </>
                                }/>
                            ))}
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button type="button" onClick={() =>  navigate("/dashboard")} className="text-lg font-medium text-slate-900">{'< Back'}</button>
                    </div>
                </div>
            </section>
            </div>
        
        </main>
        <Footer/>
    </div>
    );
}
