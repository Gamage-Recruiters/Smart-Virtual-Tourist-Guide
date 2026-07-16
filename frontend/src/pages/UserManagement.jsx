import apiClient from '../services/api';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiCheckCircle, FiClock, FiUserX, FiSearch, FiShield, FiMoreVertical, FiMail, FiPhone, FiMapPin, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const UserManagement = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState("");

  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await apiClient.get('/admin/users');
        
        if (result && result.success) {
          setUsersList(result.users);
        } else {
          setError(result?.message || 'Failed to fetch users');
        }
      } catch (err) {
        setError('Cannot connect to the server.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const totalUsers = usersList.length;
  const activeUsers = usersList.filter(user => user.status === 'Active').length;
  const suspendedUsers = usersList.filter(user => user.status === 'Suspended').length;
  const pendingUsers = usersList.filter(user => user.status === 'Pending').length; 

  const userStats = [
    { id: 1, title: 'Total Users', count: totalUsers, icon: <FiUsers size={24} /> },
    { id: 2, title: 'Active', count: activeUsers, icon: <FiCheckCircle size={24} /> },
    { id: 3, title: 'Pending', count: pendingUsers, icon: <FiClock size={24} /> },
    { id: 4, title: 'Suspended', count: suspendedUsers, icon: <FiUserX size={24} /> },
  ];

  const renderStatusBadge = (status) => {
    switch(status) {
      case 'Active': return <span className="bg-[#D1FAE5] text-[#065F46] px-4 py-1 rounded-full text-[12px] font-semibold w-24 text-center inline-block">Active</span>;
      case 'Pending': return <span className="bg-[#FEF3C7] text-[#D97706] px-4 py-1 rounded-full text-[12px] font-semibold w-24 text-center inline-block">Pending</span>;
      case 'Suspended': return <span className="bg-[#FCA5A5] text-[#991B1B] px-4 py-1 rounded-full text-[12px] font-semibold w-24 text-center inline-block">Suspended</span>;
      default: return <span className="bg-gray-100 text-gray-600 px-4 py-1 rounded-full text-[12px] font-semibold w-24 text-center inline-block">Unknown</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatRole = (role) => {
    if (!role) return 'Unknown Role';
    return role
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Status Update Handler
  const handleStatusChange = async (userId, userName, newStatus) => {
    const actionWord = newStatus === 'Suspended' ? 'suspend' : 'activate';
    
    if (window.confirm(`Are you sure you want to ${actionWord} ${userName}'s account?`)) {
      const toastId = toast.loading('Updating status...'); 
      try {
        const result = await apiClient.put(`/admin/users/${userId}/status`, { status: newStatus });
        if (result && result.success) {
          setUsersList(prev => prev.map(user => user._id === userId ? { ...user, status: newStatus } : user));
          toast.success(`${userName}'s account has been ${newStatus.toLowerCase()}.`, { id: toastId }); 
        } else {
          toast.error(result.message || 'Failed to update status.', { id: toastId }); 
        }
      } catch (error) {
        toast.error('Cannot connect to the server.', { id: toastId });
      }
    }
  };

 // Delete User Handler
  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to permanently delete the account for ${userName}? This action cannot be undone.`)) {
      const toastId = toast.loading('Deleting user...');
      try {
        const result = await apiClient.delete(`/admin/users/${userId}`);
        if (result && result.success) {
          setUsersList(prev => prev.filter(user => user._id !== userId));
          toast.success(`${userName} has been permanently deleted.`, { id: toastId });
        } else {
          toast.error(result.message || 'Failed to delete user.', { id: toastId });
        }
      } catch (error) {
        toast.error('Failed to connect to the server.', { id: toastId });
      }
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(prevId => prevId === id ? null : id);
  };

  const filteredUsers = usersList.filter(user => {
    const name = user.fullName || user.name || user.username || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.role?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);



  return (
    <div className="w-full pb-12 font-inter">
    <Toaster position="top-right" reverseOrder={false} />
      
      <div 
        className="relative w-full h-[350px] bg-cover bg-center flex items-center mb-8"
        style={{ backgroundImage: `url('https://th.bing.com/th/id/R.dade39779e7549015f83af8f8782e6e8?rik=IHFleItx%2by2chw&riu=http%3a%2f%2fwww.pearlceylon.com%2fimages%2fdestination%2fsigiriya%2fsigiriya-by-air.jpg&ehk=qBvBwGXJvH%2fks4lehtxalJjDvmSDg8BAUkxTRWpI%2bWo%3d&risl=&pid=ImgRaw&r=0')` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto w-full text-white drop-shadow-md">
          <h1 className="text-[40px] font-bold mb-2 text-white">User Management</h1>
          <p className="text-[16px] font-medium text-white/90">Monitor and manage all user accounts.</p>
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
                 <h2 className={`text-[32px] font-bold ${data.title === 'Total Users' ? 'text-[#1877F2]' : data.title === 'Active' ? 'text-[#065F46]' : data.title === 'Pending' ? 'text-[#D97706]' : 'text-[#EF4444]'}`}>
                   {loading ? '...' : data.count}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or role..." 
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-full leading-5 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1877F2] sm:text-sm transition-colors"
            />
          </div>
          <Link to="/add-admin" className="w-full md:w-auto">
            <button className="flex items-center justify-center gap-2 bg-[#1877F2] text-white px-6 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors w-full shadow-sm">
              <FiShield /> Add New Admin
            </button>
          </Link>
        </div>

        <div className="bg-[#D3E8FA] rounded-[12px] p-8 shadow-sm overflow-x-auto mb-8">
          <h3 className="text-[24px] font-bold text-[#111111] mb-6">All Users</h3>
          
          {loading ? (
            <div className="text-center py-10 text-gray-500 font-medium bg-white/50 rounded-lg">Loading user data...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500 font-medium bg-white/50 rounded-lg">{error}</div>
          ) : currentUsers.length === 0 ? (
            <div className="text-center py-10 text-gray-500 font-medium bg-white/50 rounded-lg">
              {searchTerm ? "No users match your search criteria." : "No users found in the database."}
            </div>
          ) : (
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
                {currentUsers.map((user) => {
                  const displayName = user.fullName || user.name || user.username || 'Unknown User';
                  const displayPhone = user.phoneNumber || user.phone || 'N/A';
                  const isDropdownOpen = openDropdownId === user._id;
                  
                  return (
                    <tr key={user._id} className="border-b border-blue-100 hover:bg-blue-50/30 transition-colors bg-white/50">
                      <td className="py-4 pl-2">
                        <div className="flex flex-col">
                          <span className="font-medium text-[#111111]">{displayName}</span>
                          <span className="text-[12px] text-gray-500 flex items-center gap-1 mt-1">
                            <FiMapPin size={10} /> {user.location || 'Location not set'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-[#111111] font-medium">{formatRole(user.role)}</td>
                      <td className="py-4">{renderStatusBadge(user.status)}</td>
                      <td className="py-4 text-[#111111]">{formatDate(user.createdAt || user.joinedDate)}</td>
                      <td className="py-4">
                        <div className="flex flex-col text-[12px] text-gray-600 gap-1">
                          <span className="flex items-center gap-2"><FiMail /> {user.email}</span>
                          <span className="flex items-center gap-2"><FiPhone /> {displayPhone}</span>
                        </div>
                      </td>
                      <td className="py-4 text-center relative">
                        <button 
                          onClick={() => toggleDropdown(user._id)}
                          className="text-gray-500 hover:text-[#1877F2] p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                        >
                          <FiMoreVertical size={20} />
                        </button>
                        
                        {isDropdownOpen && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-[8px] shadow-lg py-2 z-50 border border-gray-100 top-full">
                            
                            {user.status !== 'Active' && (
                              <button 
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  handleStatusChange(user._id, displayName, 'Active');
                                }}
                                className="block w-full text-left px-4 py-2 text-[13px] font-bold text-green-600 hover:bg-green-50 transition-colors"
                              >
                                Activate Account
                              </button>
                            )}

                            {user.status !== 'Suspended' && (
                              <button 
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  handleStatusChange(user._id, displayName, 'Suspended');
                                }}
                                className="block w-full text-left px-4 py-2 text-[13px] font-bold text-orange-600 hover:bg-orange-50 transition-colors"
                              >
                                Suspend Account
                              </button>
                            )}

                            <div className="border-t border-gray-100 my-1"></div>

                            <button 
                              onClick={() => {
                                setOpenDropdownId(null);
                                handleDeleteUser(user._id, displayName);
                              }}
                              className="block w-full text-left px-4 py-2 text-[13px] font-bold text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Delete Account
                            </button>

                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filteredUsers.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pb-8">
             <button 
               onClick={() => paginate(currentPage - 1)}
               disabled={currentPage === 1}
               className={`w-10 h-10 flex items-center justify-center rounded-[8px] border border-gray-200 transition-colors ${currentPage === 1 ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
             >
               <FiChevronLeft size={20} />
             </button>
             
             {[...Array(totalPages)].map((_, index) => (
               <button 
                 key={index + 1}
                 onClick={() => paginate(index + 1)}
                 className={`w-10 h-10 flex items-center justify-center rounded-[8px] font-medium shadow-sm transition-colors ${currentPage === index + 1 ? 'bg-[#A855F7] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
               >
                 {index + 1}
               </button>
             ))}

             <button 
               onClick={() => paginate(currentPage + 1)}
               disabled={currentPage === totalPages}
               className={`w-10 h-10 flex items-center justify-center rounded-[8px] border border-gray-200 transition-colors ${currentPage === totalPages ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
             >
               <FiChevronRight size={20} />
             </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserManagement;