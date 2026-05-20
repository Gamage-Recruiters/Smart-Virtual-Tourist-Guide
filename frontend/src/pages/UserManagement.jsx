import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/users');
        if (response.data) {
          setUsers(response.data.data || response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Inline styles for professional look
  const containerStyle = {
    padding: '30px',
    backgroundColor: '#f4f7fe',
    minHeight: '100vh',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.02)'
  };

  const thStyle = {
    backgroundColor: '#f4f7fe',
    color: '#a3aed1',
    textTransform: 'uppercase',
    fontSize: '12px',
    fontWeight: '600',
    padding: '15px 20px',
    textAlign: 'left',
    borderBottom: '1px solid #e0e0e0'
  };

  const tdStyle = {
    padding: '15px 20px',
    borderBottom: '1px solid #f4f7fe',
    color: '#2b3674',
    fontSize: '14px',
    fontWeight: '500'
  };

  const getStatusStyle = (status) => {
    const baseStyle = {
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      display: 'inline-block'
    };
    
    if (status === 'Active') return { ...baseStyle, backgroundColor: '#ffe9a6', color: '#ffb800' };
    if (status === 'Pending') return { ...baseStyle, backgroundColor: '#e5e0ff', color: '#634cff' };
    return { ...baseStyle, backgroundColor: '#ffe2e2', color: '#ee5d50' };
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '24px', color: '#2b3674', fontWeight: '700', marginBottom: '5px' }}>User Management</h1>
      <p style={{ color: '#a3aed1', fontSize: '14px', marginBottom: '25px' }}>Monitor and manage all user accounts</p>
      
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Joined Date</th>
            <th style={thStyle}>Contact</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id || index}>
              <td style={tdStyle}>
                <div style={{ fontWeight: '600', color: '#2b3674' }}>{user.name}</div>
                <div style={{ fontSize: '12px', color: '#a3aed1' }}>{user.location || 'Sri Lanka'}</div>
              </td>
              <td style={tdStyle}>{user.role}</td>
              <td style={tdStyle}>
                <span style={getStatusStyle(user.status || 'Pending')}>
                  {user.status || 'Pending'}
                </span>
              </td>
              <td style={tdStyle}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026-05-15'}</td>
              <td style={tdStyle}>
                <div style={{ fontSize: '13px' }}>{user.email}</div>
                <div style={{ fontSize: '12px', color: '#a3aed1' }}>{user.phone || 'N/A'}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;