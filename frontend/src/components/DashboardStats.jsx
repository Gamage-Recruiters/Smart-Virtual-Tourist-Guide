import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    travelAgencies: 0,
    registeredDrivers: 0,
    hotelPartners: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/stats');
        
        // Log the response to check the data structure in the browser console
        console.log("Backend Data: ", response.data);

        // Update state based on the response
        if (response.data) {
          setStats(response.data.data || response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  // Common inline styles to keep the code clean
  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    padding: '20px',
    flex: 1,
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.03)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  };

  const titleStyle = {
    fontSize: '14px',
    color: '#a3aed1',
    fontWeight: '600',
    margin: 0
  };

  const iconStyle = {
    backgroundColor: '#f4f7fe',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4318ff',
    fontSize: '18px'
  };

  const valueStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2b3674',
    margin: 0
  };

  const trendUpStyle = {
    fontSize: '12px',
    fontWeight: '700',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#05cd99' // Green color for positive trend
  };

  const trendDownStyle = {
    fontSize: '12px',
    fontWeight: '700',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#ee5d50' // Red color for negative trend
  };

  return (
    <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-between' }}>
      
      {/* Total Users */}
      <div style={cardStyle}>
        <div style={headerStyle}>
          <p style={titleStyle}>Total Users</p>
          <div style={iconStyle}>👥</div>
        </div>
        <h2 style={valueStyle}>{stats.totalUsers || 0}</h2>
        <div style={trendUpStyle}>
          <span>↑</span> 12.5%
        </div>
      </div>

      {/* Travel Agencies */}
      <div style={cardStyle}>
        <div style={headerStyle}>
          <p style={titleStyle}>Travel Agencies</p>
          <div style={iconStyle}>🏢</div>
        </div>
        <h2 style={valueStyle}>{stats.travelAgencies || 0}</h2>
        <div style={trendUpStyle}>
          <span>↑</span> 4.2%
        </div>
      </div>

      {/* Registered Drivers */}
      <div style={cardStyle}>
        <div style={headerStyle}>
          <p style={titleStyle}>Registered Drivers</p>
          <div style={iconStyle}>🚗</div>
        </div>
        <h2 style={valueStyle}>{stats.registeredDrivers || 0}</h2>
        <div style={trendDownStyle}>
          <span>↓</span> 1.5%
        </div>
      </div>

      {/* Hotel Partners */}
      <div style={cardStyle}>
        <div style={headerStyle}>
          <p style={titleStyle}>Hotel Partners</p>
          <div style={iconStyle}>🏨</div>
        </div>
        <h2 style={valueStyle}>{stats.hotelPartners || 0}</h2>
        <div style={trendUpStyle}>
          <span>↑</span> 8.4%
        </div>
      </div>

    </div>
  );
};

export default DashboardStats;