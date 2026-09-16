import apiClient from '../../services/Admin/adminApi';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiCheckCircle, FiClock, FiUserX, FiSearch, FiShield, FiMoreVertical, FiMail, FiPhone, FiMapPin, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import UserManagementBg from '../../assets/Admin/usermanagement.png';

const UserManagement = () => {
  const [usersList, setUsersList] = useState([]);
  const [currentAdminId, setCurrentAdminId] = useState(null);
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
          setCurrentAdminId(result.currentAdminId);
        } else {
          setError(result?.message || 'Failed to fetch users');
        }
      } catch {
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
      case 'Active': return <span className="inline-block w-28 rounded-full bg-[#F2D86D] px-4 py-1 text-center text-[13px] font-medium text-white">Active</span>;
      case 'Pending': return <span className="inline-block w-28 rounded-full bg-[#8979FF] px-4 py-1 text-center text-[13px] font-medium text-white">Pending</span>;
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
      } catch {
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
      } catch {
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

  return (
    <div className="w-full bg-white font-inter">
    <Toaster position="top-right" reverseOrder={false} />

      <div
        className="relative flex min-h-[360px] w-full items-center bg-cover bg-center sm:min-h-[520px] lg:h-[min(54.5vw,785px)] lg:min-h-[680px]"
        style={{ backgroundImage: `url(${UserManagementBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent" />
        <div className="relative z-10 w-full px-6 sm:px-8 lg:px-[42px]">
          <h1 className="mb-3 text-[38px] font-extrabold leading-tight text-black sm:text-[40px]">User Management</h1>
          <p className="text-[18px] font-semibold text-black sm:text-[21px] lg:text-[24px]">Monitor and manage all user accounts.</p>
        </div>
      </div>

      <section className="mx-auto w-full max-w-[1440px] bg-gradient-to-b from-[#A0DBFF] to-white px-6 pb-16 pt-12 sm:px-8 lg:px-12 lg:pb-20 lg:pt-16">

        <div className="mb-10">
          <div className="mx-auto grid max-w-[1190px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-24">
            {userStats.map((data) => (
              <div key={data.id} className="flex min-h-[126px] flex-col justify-between rounded-[9px] bg-gradient-to-br from-white to-[#F4F9FF] p-5 shadow-[0_8px_22px_rgba(46,92,136,0.14)]">
                 <div className="flex items-center justify-between text-[#111111]">
                    <h3 className="text-[16px] font-medium sm:text-[18px]">{data.title}</h3>
                    <span className="[&_svg]:h-5 [&_svg]:w-5">{data.icon}</span>
                 </div>
                 <h2 className={`text-[24px] font-medium ${data.title === 'Total Users' ? 'text-[#2859C5]' : data.title === 'Active' ? 'text-[#F2D86D]' : data.title === 'Pending' ? 'text-[#8979FF]' : 'text-[#EF4444]'}`}>
                   {loading ? '...' : data.count}
                 </h2>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-10 grid max-w-[1298px] grid-cols-1 gap-3 rounded-[10px] bg-white/75 p-3 shadow-sm md:grid-cols-3 md:gap-8">
             <Link to="/admin/users" className="block w-full">
               <button className="w-full rounded-full border border-green-200 bg-[#D7FDE1] px-6 py-2.5 text-[14px] font-semibold text-[#065F46] shadow-sm transition-colors">
                 User Management
               </button>
             </Link>
             <Link to="/admin/listings" className="block w-full">
               <button className="w-full rounded-full border border-slate-300 bg-white px-6 py-2.5 text-[14px] font-semibold text-[#111111] shadow-sm transition-colors hover:bg-slate-50">
                 Approve Listings
               </button>
             </Link>
             <Link to="/admin/ads" className="block w-full">
               <button className="w-full rounded-full border border-slate-300 bg-white px-6 py-2.5 text-[14px] font-semibold text-[#111111] shadow-sm transition-colors hover:bg-slate-50">
                 Manage Ads
               </button>
             </Link>
          </div>
        </div>

        <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="relative w-full md:max-w-[1061px] md:flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search users....."
              className="block h-[46px] w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 text-[14px] leading-5 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
            />
          </div>
          <Link to="/admin/users/new" className="w-full md:w-auto">
             <button className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[7px] bg-[#0075FF] px-7 py-3 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-600 md:min-w-[216px]">
              <FiShield /> Add New Admin
            </button>
          </Link>
        </div>

        <div className="mb-10 rounded-[4px] border border-[#2E5C88]/20 bg-[#A0DBFF]/[0.07] p-5 shadow-sm sm:p-9">
          <h3 className="mb-7 text-[30px] font-medium text-[#111111] sm:text-[36px]">All Users</h3>

          {loading ? (
            <div className="text-center py-10 text-gray-500 font-medium bg-white/50 rounded-lg">Loading user data...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500 font-medium bg-white/50 rounded-lg">{error}</div>
          ) : currentUsers.length === 0 ? (
            <div className="text-center py-10 text-gray-500 font-medium bg-white/50 rounded-lg">
              {searchTerm ? "No users match your search criteria." : "No users found in the database."}
            </div>
          ) : (
            <div className="overflow-x-auto pb-2">
            <table className="min-w-[1080px] w-full border-collapse text-left">
              <thead>
                <tr className="h-[86px] border-b border-[#2E5C88]/30 text-[20px] font-medium text-[#111111]">
                  <th className="px-4">User</th>
                  <th className="px-3">Role</th>
                  <th className="px-3">Status</th>
                  <th className="px-3">Joined</th>
                  <th className="px-3">Contact</th>
                  <th className="px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => {
                  const displayName = user.fullName || user.name || user.username || 'Unknown User';
                   const displayPhone = user.phoneNumber || user.phone || 'N/A';
                   const isDropdownOpen = openDropdownId === user._id;
                   const isCurrentAdmin = currentAdminId === user._id;

                  return (
                    <tr key={user._id} className="h-[150px] border-b border-[#2E5C88]/20 transition-colors hover:bg-white/30">
                      <td className="px-4 py-7">
                        <div className="flex flex-col">
                          <span className="text-[17px] font-normal text-[#111111]">{displayName}</span>
                          <span className="mt-2 flex items-center gap-1 text-[12px] text-slate-600">
                            <FiMapPin size={10} /> {user.location || 'Location not set'}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-7 text-[17px] font-normal text-[#111111]">{formatRole(user.role)}</td>
                      <td className="px-3 py-7">{renderStatusBadge(user.status)}</td>
                      <td className="px-3 py-7 text-[16px] text-[#111111]">{formatDate(user.createdAt || user.joinedDate)}</td>
                      <td className="px-3 py-7">
                        <div className="flex flex-col gap-1 text-[12px] text-slate-700">
                          <span className="flex items-center gap-2"><FiMail /> {user.email}</span>
                          <span className="flex items-center gap-2"><FiPhone /> {displayPhone}</span>
                        </div>
                      </td>
                      <td className="relative px-3 py-7 text-center">
                        {isCurrentAdmin ? (
                          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-[12px] font-semibold text-blue-700">
                            Current account
                          </span>
                        ) : (
                          <button
                            onClick={() => toggleDropdown(user._id)}
                            className="text-gray-500 hover:text-[#1877F2] p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                            aria-label={`Manage ${displayName}`}
                          >
                            <FiMoreVertical size={20} />
                          </button>
                        )}

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
            </div>
          )}
        </div>

        {!loading && filteredUsers.length > 0 && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-end gap-2 pb-8">
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

      </section>
    </div>
  );
};

export default UserManagement;
