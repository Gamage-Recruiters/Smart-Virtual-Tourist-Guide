import React from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/admin/StatCard';
import RevenueChart from '../components/admin/RevenueChart';
import BookingChart from '../components/admin/BookingChart';
import PackagePerformanceChart from '../components/admin/PackagePerformanceChart';
import BookingPieChart from '../components/admin/BookingPieChart';
import RecentActivity from '../components/admin/RecentActivity';
import { FiUsers, FiBriefcase, FiTruck, FiHome } from 'react-icons/fi';
import HeroBg from "../assets/hero-bg.png";

const AdminDashboard = () => {
  const dashboardData = [
    { id: 1, title: 'Total Users', count: '10k', percentage: '12.5', isPositive: true, icon: <FiUsers size={24} /> },
    { id: 2, title: 'Travel Agencies', count: '45', percentage: '4.2', isPositive: true, icon: <FiBriefcase size={24} /> },
    { id: 3, title: 'Registered Drivers', count: '598', percentage: '1.5', isPositive: false, icon: <FiTruck size={24} /> },
    { id: 4, title: 'Hotel Partners', count: '358', percentage: '8.4', isPositive: true, icon: <FiHome size={24} /> },
  ];

  return (
    <div className="w-full pb-12">
      
      {/* Dashboard Specific Hero Section */}
      <div 
        className="relative w-full h-[400px] bg-cover bg-center flex items-center mb-8"
        style={{ backgroundImage: `url(${HeroBg})` }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <h1 className="text-[40px] md:text-[56px] font-bold text-[#111111] leading-tight mb-4 drop-shadow-sm">
            Welcome To Your <br /> Admin Dashboard
          </h1>
          <p className="text-[16px] md:text-[20px] text-[#111111] font-medium max-w-2xl drop-shadow-sm">
            Manage your travel platform, track performance, and deliver unforgettable journeys across Sri Lanka.
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="font-inter px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-[28px] font-bold text-[#111111]">Admin Dashboard</h2>
          <span className="text-[12px] text-gray-500 mb-2">Last updated: Just now</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardData.map((data) => (
            <StatCard 
              key={data.id}
              title={data.title}
              count={data.count}
              percentage={data.percentage}
              isPositive={data.isPositive}
              icon={data.icon}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <Link to="/user-management" className="block w-full">
             <button className="bg-white border border-gray-200 text-[#111111] font-medium py-3 px-6 rounded-full shadow-sm hover:bg-gray-50 transition-colors w-full">
               User Management
             </button>
           </Link>
           <Link to="/approve-listings" className="block w-full">
             <button className="bg-white border border-gray-200 text-[#111111] font-medium py-3 px-6 rounded-full shadow-sm hover:bg-gray-50 transition-colors w-full">
               Approve Listings
             </button>
           </Link>
           <Link to="/manage-ads" className="block w-full">
             <button className="bg-white border border-gray-200 text-[#111111] font-medium py-3 px-6 rounded-full shadow-sm hover:bg-gray-50 transition-colors w-full">
               Manage Ads
             </button>
           </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-[12px] shadow-sm min-h-[400px] border border-gray-100 flex flex-col">
             <h3 className="text-[16px] font-semibold text-[#111111] mb-6">Monthly Revenue Trend</h3>
             <div className="flex-grow">
               <RevenueChart />
             </div>
          </div>
          <div className="bg-white p-6 rounded-[12px] shadow-sm min-h-[400px] border border-gray-100 flex flex-col">
             <h3 className="text-[16px] font-semibold text-[#111111] mb-6">Monthly Booking</h3>
             <div className="flex-grow">
               <BookingChart />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 mb-6">
          <div className="bg-white p-6 rounded-[12px] shadow-sm min-h-[400px] border border-gray-100 flex flex-col">
             <h3 className="text-[16px] font-semibold text-[#111111] mb-6">Package Performance</h3>
             <div className="flex-grow">
               <PackagePerformanceChart />
             </div>
          </div>
          <div className="bg-white p-6 rounded-[12px] shadow-sm min-h-[400px] border border-gray-100 flex flex-col">
             <h3 className="text-[16px] font-semibold text-[#111111] mb-6">Monthly Booking</h3>
             <div className="flex-grow">
               <BookingPieChart />
             </div>
          </div>
        </div>

        <RecentActivity />

      </div>
    </div>
  );
};

export default AdminDashboard;