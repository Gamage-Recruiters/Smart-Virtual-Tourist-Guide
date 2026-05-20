import React from 'react';

const AdminDashboard = () => {
  // Mock data for frontend-first approach
  const dashboardStats = {
    totalUsers: '10k',
    userTrend: '+12.5%',
    travelAgencies: '45',
    agencyTrend: '+4.2%',
    registeredDrivers: '598',
    driverTrend: '-1.5%',
    hotelPartners: '358',
    hotelTrend: '+8.4%'
  };

  return (
    <div className="min-h-screen p-8 font-sans text-[#111111]">
      <h1 className="text-2xl font-bold mb-6 text-[#111111]">Admin Dashboard</h1>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Users Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Total Users</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{dashboardStats.totalUsers}</h2>
            <div className="text-xs font-semibold text-green-500 mt-1 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              {dashboardStats.userTrend}
            </div>
          </div>
        </div>

        {/* Travel Agencies Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Travel Agencies</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{dashboardStats.travelAgencies}</h2>
            <div className="text-xs font-semibold text-green-500 mt-1 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              {dashboardStats.agencyTrend}
            </div>
          </div>
        </div>

        {/* Registered Drivers Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Registered Drivers</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{dashboardStats.registeredDrivers}</h2>
            <div className="text-xs font-semibold text-red-500 mt-1 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"></path></svg>
              {dashboardStats.driverTrend}
            </div>
          </div>
        </div>

        {/* Hotel Partners Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Hotel Partners</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3 0h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{dashboardStats.hotelPartners}</h2>
            <div className="text-xs font-semibold text-green-500 mt-1 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              {dashboardStats.hotelTrend}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;