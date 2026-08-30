import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

function CommunityDashboard() {
  const [stats, setStats] = useState(null);
  const [regionalStats, setRegionalStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [dashRes, regRes] = await Promise.all([
          axios.get('http://localhost:5000/api/community-stats/dashboard'),
          axios.get('http://localhost:5000/api/community-stats/regional')
        ]);
        setStats(dashRes.data);
        if (regRes.data) {
          setRegionalStats(regRes.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    fetchStats();
  }, []);

  const data = (stats && Object.keys(stats).length > 0) ? stats : {
    totalSme: 0,
    activeUsers: 0,
    economicImpact: {
      tourismRevenuePercent: 0,
      localBusinessProfitPercent: 0,
      jobCreationPercent: 0,
    },
    feedback: {
      fullySatisfiedPercent: 0,
      acceptedPercent: 0,
      negativePercent: 0,
    }
  };

  // Helper colors for the bar chart
  const barColors = ['#4c1d95', '#9d174d', '#db2777', '#f472b6', '#fbcfe8', '#dce775', '#81c784', '#4db6ac', '#1976d2'];

  return (
    <div className="bg-[#eaf4fc] min-h-screen font-sans pt-20">
      <Header />
      
      {/* Hero Section */}
      <div className="relative w-full h-[400px]">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2073&ixlib=rb-4.0.3" 
          alt="Beach waves" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center pt-20">
          <h1 className="text-white text-5xl md:text-7xl font-serif text-center drop-shadow-lg" style={{ fontFamily: 'Georgia, serif' }}>
            Welcome to the<br/>Community Dashboard
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 flex flex-col gap-10">
        
        {/* Participation Statistics */}
        <section>
          <div className="bg-[#66c2d7] py-2 px-6 rounded-md flex justify-between items-center text-white mb-6">
            <h2 className="font-bold text-lg">small or medium businesses Participation statistics</h2>
            <Link to="/sme-participation-stats" className="border border-white px-4 py-1 rounded text-sm hover:bg-white hover:text-[#66c2d7] transition-colors">
              More Info
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-[#d9f0fc] rounded-lg shadow-sm p-6 flex items-center gap-6 w-80">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600 text-3xl">
                📋
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{data.totalSme.toLocaleString()}</div>
                <div className="text-sm text-gray-600 leading-tight">Total small businesses<br/>+ vehicle owners</div>
              </div>
            </div>
            
            <div className="bg-[#d9f0fc] rounded-lg shadow-sm p-6 flex items-center gap-6 w-80">
              <div className="bg-green-100 p-3 rounded-full text-green-600 text-3xl">
                👤
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{data.activeUsers.toLocaleString()}</div>
                <div className="text-sm text-gray-600 leading-tight">Active users<br/>this month</div>
              </div>
            </div>
          </div>
        </section>

        {/* Economic Impact Statistics */}
        <section>
          <div className="bg-[#66c2d7] py-2 px-6 rounded-md flex justify-between items-center text-white mb-6">
            <h2 className="font-bold text-lg">Community Economic Impact statistics</h2>
            <Link to="/community-economic-impact" className="border border-white px-4 py-1 rounded text-sm hover:bg-white hover:text-[#66c2d7] transition-colors">
              More Info
            </Link>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-6 justify-center">
            {/* Donut Chart Card */}
            <div className="bg-white rounded-xl shadow-md p-6 w-full md:w-1/2 flex flex-col items-center">
              <h3 className="text-gray-700 font-medium mb-8 text-sm">Community Economic Impact (Millions)</h3>
              <div className="flex items-center gap-8 w-full justify-center">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e5e7eb" strokeWidth="20" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - data.economicImpact.jobCreationPercent/100)} />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - (data.economicImpact.localBusinessProfitPercent + data.economicImpact.jobCreationPercent)/100)} />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - data.economicImpact.tourismRevenuePercent/100)} />
                  </svg>
                  {/* Fake percentages overlaying the donut */}
                  {data.economicImpact.tourismRevenuePercent > 0 && (
                    <div className="absolute inset-0 text-[10px] text-white font-bold flex">
                      <span className="absolute top-1/4 left-1/4">{data.economicImpact.jobCreationPercent}%</span>
                      <span className="absolute bottom-1/4 left-1/2 -translate-x-1/2 text-black">{data.economicImpact.tourismRevenuePercent}%</span>
                      <span className="absolute top-1/3 right-1/4">{data.economicImpact.localBusinessProfitPercent}%</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-4 text-xs font-medium text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1 bg-[#10b981] rounded-full"></div> Tourism Revenue
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1 bg-[#ef4444] rounded-full"></div> Local business profit
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1 bg-[#f59e0b] rounded-full"></div> Job creation
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Chart Card */}
            <div className="bg-white rounded-xl shadow-md p-6 w-full md:w-1/2">
              <h3 className="text-gray-700 font-medium mb-6 text-sm text-center">Tourism Impact by Region</h3>
              <div className="flex gap-4">
                <div className="flex-1 flex items-end h-40 gap-2 border-b border-l border-gray-200 pb-1 pl-2 relative">
                  {/* Y Axis labels */}
                  <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between text-[8px] text-gray-400">
                    <span>100</span>
                    <span>80</span>
                    <span>60</span>
                    <span>40</span>
                    <span>20</span>
                    <span>0</span>
                  </div>
                  {/* Bars Dynamically Rendered */}
                  {regionalStats.length > 0 ? regionalStats.slice(0, 5).map((reg, idx) => {
                    // Extract numeric revenue for height calculation (assuming format "450 Million" -> 450)
                    const revStr = reg.revenueLKR || reg.revenue || '0';
                    const revNum = parseInt(revStr.replace(/\D/g, ''), 10) || 0;
                    const heightPercent = Math.min(100, Math.max(10, (revNum / 500) * 100));
                    
                    return (
                      <div key={idx} className="flex-1 rounded-t-sm group relative" style={{ backgroundColor: barColors[idx % barColors.length], height: `${heightPercent}%` }}>
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] -rotate-45 origin-top-left text-gray-500">{reg.region}</span>
                      </div>
                    );
                  }) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">No data available</div>
                  )}
                </div>
                {/* Legend */}
                <div className="w-28 flex flex-col gap-2 text-[10px] text-gray-600 bg-gray-50 p-2 rounded h-fit">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-sm bg-gray-400"></div> Direct
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-sm bg-gray-300"></div> Indirect/Induced
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Statistics */}
        <section>
          <div className="bg-[#66c2d7] py-2 px-6 rounded-md flex justify-between items-center text-white mb-6">
            <h2 className="font-bold text-lg">Community Feedback & Support</h2>
            <Link to="/tourist-feedback" className="border border-white px-4 py-1 rounded text-sm hover:bg-white hover:text-[#66c2d7] transition-colors">
              More Info
            </Link>
          </div>
          
          <div className="flex justify-center">
            <div className="bg-white rounded-xl shadow-md p-6 w-full md:w-1/2 flex flex-col items-center">
              <h3 className="text-gray-700 font-medium mb-8 text-sm">Tourist Feedback on Local Services</h3>
              <div className="flex items-center gap-8 w-full justify-center">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e5e7eb" strokeWidth="20" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - data.feedback.fullySatisfiedPercent/100)} />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f472b6" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - (data.feedback.fullySatisfiedPercent + data.feedback.acceptedPercent)/100)} />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - (data.feedback.fullySatisfiedPercent + data.feedback.acceptedPercent + data.feedback.negativePercent)/100)} />
                  </svg>
                  {/* Fake percentages overlaying the donut */}
                  {data.feedback.fullySatisfiedPercent > 0 && (
                    <div className="absolute inset-0 text-[10px] text-white font-bold flex">
                      <span className="absolute bottom-1/3 left-1/3 text-black">{data.feedback.fullySatisfiedPercent}%</span>
                      <span className="absolute top-1/4 right-1/4">{data.feedback.acceptedPercent}%</span>
                      <span className="absolute bottom-1/4 right-1/3">{data.feedback.negativePercent}%</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-4 text-xs font-medium text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1 bg-[#10b981] rounded-full"></div> Fully Satisfied
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1 bg-[#f472b6] rounded-full"></div> Accepted
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1 bg-[#8b5cf6] rounded-full"></div> Negative
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


      </div>
      
      {/* Footer Wrapper with some margin to detach from main content like image */}
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}

export default CommunityDashboard;
