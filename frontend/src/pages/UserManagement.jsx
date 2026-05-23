import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiCheckCircle, FiClock, FiUserX, FiSearch, FiShield, FiMoreVertical, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const UserManagement = () => {
  const userStats = [
    { id: 1, title: 'Total Users', count: '598', percentage: '', isPositive: true, icon: <FiUsers size={24} /> },
    { id: 2, title: 'Active', count: '157', percentage: '', isPositive: true, icon: <FiCheckCircle size={24} /> },
    { id: 3, title: 'Pending', count: '157', percentage: '', isPositive: false, icon: <FiClock size={24} /> },
    { id: 4, title: 'Suspended', count: '5', percentage: '', isPositive: false, icon: <FiUserX size={24} /> },
  ];

  const usersList = [
    { id: 1, name: 'jaynga pramodya', location: 'Galle, Sri Lanka', role: 'Driver', status: 'Pending', joined: '2025-12-25', email: 'jaynga.w@email.com', phone: '+94 11 234 5678' },
    { id: 2, name: 'priya patel', location: 'kerala, India', role: 'Tourist', status: 'Active', joined: '2025-12-13', email: 'diaan.qn@email.com', phone: '+91 2 9876 5432' },
    { id: 3, name: 'Michel Chen', location: 'Manchester, UK', role: 'Hotel Owner', status: 'Suspended', joined: '2025-12-13', email: 'Michel.cn@email.com', phone: '+44 2 9876 5432' },
    { id: 4, name: 'Sachintha Lakshan', location: 'Colombo, Sri Lanka', role: 'Driver', status: 'Pending', joined: '2025-08-30', email: 'sachin.l@email.com', phone: '+94 70 7123 4567' },
    { id: 5, name: 'Evan Wright', location: 'Los Angeles, USA', role: 'Tourist', status: 'Active', joined: '2025-11-02', email: 'evan.r@email.com', phone: '+1 555-0123' },
    { id: 6, name: 'Diana Prince', location: 'Manchester, UK', role: 'Hotel Owner', status: 'Suspended', joined: '2025-12-13', email: 'diaan.qn@email.com', phone: '+44 2 9876 5432' },
    { id: 7, name: 'Alice Johnson', location: 'New York, USA', role: 'Tourist', status: 'Active', joined: '2025-08-15', email: 'alice.j@email.com', phone: '+1 555-0123' },
    { id: 8, name: 'Heshan ayodya', location: 'Galle, Sri Lanka', role: 'Driver', status: 'Pending', joined: '2025-12-25', email: 'jaynga.w@email.com', phone: '+94 11 234 5678' },
  ];

  const renderStatusBadge = (status) => {
    switch(status) {
      case 'Active':
        return <span className="bg-[#FFE066] text-[#B38F00] px-4 py-1 rounded-full text-[12px] font-semibold w-24 text-center">Active</span>;
      case 'Pending':
        return <span className="bg-[#A78BFA] text-white px-4 py-1 rounded-full text-[12px] font-semibold w-24 text-center">Pending</span>;
      case 'Suspended':
        return <span className="bg-[#FCA5A5] text-[#991B1B] px-4 py-1 rounded-full text-[12px] font-semibold w-24 text-center">Suspended</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="w-full pb-12 font-inter">
      
      {/* Updated Hero Section with Sigiriya Image */}
      <div 
        className="relative w-full h-[350px] bg-cover bg-center flex items-center mb-8"
        style={{ backgroundImage: `url('https://th.bing.com/th/id/R.dade39779e7549015f83af8f8782e6e8?rik=IHFleItx%2by2chw&riu=http%3a%2f%2fwww.pearlceylon.com%2fimages%2fdestination%2fsigiriya%2fsigiriya-by-air.jpg&ehk=qBvBwGXJvH%2fks4lehtxalJjDvmSDg8BAUkxTRWpI%2bWo%3d&risl=&pid=ImgRaw&r=0')` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <h1 className="text-[40px] font-bold text-white mb-2 drop-shadow-md">User Management</h1>
          <p className="text-[16px] font-medium text-white/90 drop-shadow-md">Monitor and manage all user accounts.</p>
        </div>
      </div>

      <div className="px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="bg-[#D3E8FA] p-8 rounded-[12px] mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userStats.map((data) => (
              <div key={data.id} className="bg-gradient-to-br from-white to-[#F4F9FF] p-6 rounded-[12px] shadow-sm flex flex-col gap-2">
                 <div className="flex justify-between items-center text-gray-500">
                    <h3 className="text-[14px] font-medium text-[#111111]">{data.title}</h3>
                    {data.icon}
                 </div>
                 <h2 className={`text-[32px] font-bold ${data.title === 'Total Users' ? 'text-[#1877F2]' : data.title === 'Active' ? 'text-[#F59E0B]' : data.title === 'Pending' ? 'text-[#8B5CF6]' : 'text-[#EF4444]'}`}>
                   {data.count}
                 </h2>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
             <Link to="/user-management" className="block w-full">
               <button className="bg-[#D1FAE5] border border-green-200 text-[#065F46] font-medium py-3 px-6 rounded-full shadow-sm transition-colors w-full">
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
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-2/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search users....." 
              className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-[8px] leading-5 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <Link to="/add-admin" className="w-full md:w-auto"> {/* මේ Link එක දැම්මා */}
            <button className="flex items-center justify-center gap-2 bg-[#1877F2] text-white px-6 py-3 rounded-[8px] font-medium hover:bg-blue-600 transition-colors w-full shadow-sm">
              <FiShield /> Add New Admin
            </button>
          </Link>
        </div>

        <div className="bg-[#D3E8FA] rounded-[12px] p-8 shadow-sm overflow-x-auto">
          <h3 className="text-[24px] font-bold text-[#111111] mb-6">All Users</h3>
          
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-blue-200 text-[16px] font-semibold text-[#111111]">
                <th className="pb-4 pl-2">User</th>
                <th className="pb-4">Role</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Joined</th>
                <th className="pb-4">Contact</th>
                <th className="pb-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user) => (
                <tr key={user.id} className="border-b border-blue-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 pl-2">
                    <div className="flex flex-col">
                      <span className="font-medium text-[#111111]">{user.name}</span>
                      <span className="text-[12px] text-gray-500 flex items-center gap-1 mt-1">
                        <FiMapPin size={10} /> {user.location}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-[#111111]">{user.role}</td>
                  <td className="py-4">
                     <div className="flex items-center">
                       {renderStatusBadge(user.status)}
                     </div>
                  </td>
                  <td className="py-4 text-[#111111]">{user.joined}</td>
                  <td className="py-4">
                    <div className="flex flex-col text-[12px] text-gray-600 gap-1">
                      <span className="flex items-center gap-2"><FiMail /> {user.email}</span>
                      <span className="flex items-center gap-2"><FiPhone /> {user.phone}</span>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <FiMoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;