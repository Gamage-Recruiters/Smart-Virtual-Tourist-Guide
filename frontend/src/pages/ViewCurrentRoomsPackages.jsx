import React, { useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer.jsx";
import ViewCurrentRoomImg from "../assets/ViewCurrentRoomImg.png";
import { FaArrowRight, FaPlus } from "react-icons/fa";
import BgForCurrentRooms from "../assets/BgForViewCurrentRoom.png";
import RoomCard from "../components/RoomCard.jsx";
import PackageCard from '../components/PackageCard.jsx';
import { href } from "react-router-dom";

const sampleRooms = [
  {
    id: 1,
    name: 'Deluxe Double Room',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=400',
    capacity: '4 Adults',
    size: '55 Sqm',
    price: '250 $',
    amenities: { terrace: true, gardenView: true, wifi: true, ac: true }
  },
  {
    id: 2,
    name: 'Standard Double Room with Fan',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=400',
    capacity: '2 Adults',
    size: '55 Sqm',
    price: '98 $',
    amenities: { terrace: true, gardenView: true, wifi: true, ac: true }
  },
  {
    id: 3,
    name: 'Family Room with Garden View',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=400',
    capacity: '5 Adults',
    size: '55 Sqm',
    price: '189 $',
    amenities: { terrace: true, gardenView: true, wifi: true, ac: true }
  },
  {
    id: 4,
    name: 'Deluxe King Suite',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=400',
    capacity: '2 Adults & 1 Child',
    size: '55 Sqm',
    price: '119 $',
    amenities: { terrace: true, gardenView: true, wifi: true, ac: true }
  },
  {
    id: 4,
    name: 'Deluxe King Suite',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=400',
    capacity: '2 Adults & 1 Child',
    size: '55 Sqm',
    price: '119 $',
    amenities: { terrace: true, gardenView: true, wifi: true, ac: true }
  }
];

const samplePackages = [
  {
    id: 1,
    name: 'Honeymoon Packages',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=400',
    capacity: '4 Adults',
    price: '250 $',
    amenities: { terrace: true, gardenView: true, wifi: true, ac: true }
  },
  {
    id: 2,
    name: 'Standard Double Room with Fan',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=400',
    capacity: '2 Adults',
    price: '98 $',
    amenities: { terrace: true, gardenView: true, wifi: true, ac: true }
  },
  {
    id: 3,
    name: 'Family Room with Garden View',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=400',
    capacity: '5 Adults',
    price: '189 $',
    amenities: { terrace: true, gardenView: true, wifi: true, ac: true }
  },
  {
    id: 4,
    name: 'Deluxe King Suite',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=400',
    capacity: '2 Adults & 1 Child',
    price: '119 $',
    amenities: { terrace: true, gardenView: true, wifi: true, ac: true }
  },
  {
    id: 4,
    name: 'Deluxe King Suite',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=400',
    capacity: '2 Adults & 1 Child',
    price: '119 $',
    amenities: { terrace: true, gardenView: true, wifi: true, ac: true }
  }
];

export default function ViewCurrentRoomsPackages() {
    const [activeTab, setActiveTab] = useState('rooms');
    return (
    <div>
        <div>
            <Header/>
        </div>
        <main className="flex flex-1 flex-col">
            <section
                id="overview"
                className="grid gap-6 overflow-hidden border border-slate-200/80 bg-white/25 p-5 shadow-[0_28px_60px_rgba(20,40,60,0.12)] backdrop-blur md:grid-cols-[1.35fr_0.9fr] md:p-10"
                style={{
                    backgroundImage:
                        `linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.2)), linear-gradient(160deg, rgba(53,120,146,0.15), rgba(255,255,255,0.2)), url(${ViewCurrentRoomImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="flex max-w-3xl flex-col justify-center gap-5 text-slate-900">
                    <span className="text-[0.78rem] font-extrabold uppercase tracking-[0.14em] text-sky-800">Hotel owner dashboard</span>
                    <p className="font-black text-slate-950 sm:text-4xl">
                        {activeTab === 'rooms' ? 'Add Rooms of Accommodations' : 'Exclusive Special Packages'}
                    </p>
                    <p className="max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
                        {activeTab === 'rooms' 
                          ? 'Fill in the Details to Create a New Room for Your Hotel !' 
                          : 'Explore and attach seasonal dynamic discount packs to active room layouts.'}
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <button className="inline-flex h-12 items-center gap-2 rounded-xl bg-sky-800 px-5 font-extrabold text-white shadow-lg shadow-sky-900/20 transition hover:bg-sky-900" type="button">
                            Explore Rooms <FaArrowRight />
                        </button>
                        <button onClick={() => (location.href = 'add-room-package')} className="inline-flex h-12 items-center gap-2 rounded-xl border border-sky-200 bg-white/90 px-5 font-extrabold text-sky-900 transition hover:border-sky-300 hover:bg-white" type="button">
                            <FaPlus /> Add New Room
                        </button>
                    </div>
                </div>
            </section>
            <section 
                id="overview"
                className="w-full min-h-screen border border-slate-200/80 p-5 md:p-10 backdrop-blur"
                style={{
                    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.2)), linear-gradient(160deg, rgba(53,120,146,0.15), rgba(255,255,255,0.2)), url(${BgForCurrentRooms})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
                >
                {/* The white dashboard card wrapper */}
                <div className="w-full mx-auto bg-linear-to-b from-[#FFFFFF] to-[#A0DBFF] rounded-3xl shadow-[0_28px_60px_rgba(20,40,60,0.12)] p-6 md:p-10">
                    
                    {/* Header Tab & Action Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 border-b border-gray-100 pb-5">
                        <div className="flex bg-gray-100 p-1.5 rounded-xl w-full sm:w-auto">
                            <button 
                                onClick={() => setActiveTab('rooms')}
                                className={`flex-1 sm:flex-initial text-center px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                                    activeTab === 'rooms' 
                                        ? 'bg-gray-300 text-slate-900 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                Room Types
                            </button>
                            <button 
                                onClick={() => setActiveTab('packages')}
                                className={`flex-1 sm:flex-initial text-center px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                                    activeTab === 'packages' 
                                        ? 'bg-gray-300 text-slate-900 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                Special Packages
                            </button>
                        </div>
                    
                        <button className="bg-[#007bff] hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors shadow-sm self-end sm:self-center">
                            {activeTab === 'rooms' ? '+ Add Room Type' : '+ Create Package'}
                        </button>
                    </div>

                    {activeTab === 'rooms' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {sampleRooms.map((roomItem, index) => (
                                <RoomCard key={`${roomItem.id}-${index}`} room={roomItem} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {samplePackages.map((packageItem, index) => (
                                <PackageCard key={`${packageItem.id}-${index}`} room={packageItem} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
        <Footer/>
    </div>
    );
};