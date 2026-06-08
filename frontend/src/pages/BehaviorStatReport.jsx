import React, { useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";

// Recharts imports
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';

import PDF_PNG from "../assets/pdf.png";

const BehaviorStatReport = () => {

  // A. For Famous Foods Chart 
  const foodChartData = [
    { label: "Sri Lanka", value: 500000, colorHex: "#4A0E4E" },
    { label: "Italy", value: 390000, colorHex: "#800080" },
    { label: "Western", value: 290000, colorHex: "#9A0EE0" },
    { label: "Indian", value: 350000, colorHex: "#C04DF1" },
    { label: "Chinese", value: 440000, colorHex: "#E09EFA" },
    { label: "Healthy", value: 170000, colorHex: "#F0C4FF" }
  ];

  // B. For Travel Methods Pie Chart 
  const travelChartData = [
    { name: "Private vehicle", value: 70, color: "#3CAEA3" },
    { name: "Bus", value: 20, color: "#E05A47" },
    { name: "Tuk Tuk", value: 10, color: "#FFC154" }
  ];

  // C. For Famous Foods Table 
  const foodTableData = [
    { month: "January", sriLanka: 5000, italian: 4500, western: 4000, indian: 3500, chinese: 3000, healthy: 2500 },
    { month: "February", sriLanka: 5000, italian: 4500, western: 4000, indian: 3500, chinese: 3000, healthy: 2500 },
    { month: "March", sriLanka: 5000, italian: 4500, western: 4000, indian: 3500, chinese: 3000, healthy: 2500 },
    { month: "April", sriLanka: 5000, italian: 4500, western: 4000, indian: 3500, chinese: 3000, healthy: 2500 },
    { month: "May", sriLanka: 5000, italian: 4500, western: 4000, indian: 3500, chinese: 3000, healthy: 2500 },
    { month: "June", sriLanka: 5000, italian: 4500, western: 4000, indian: 3500, chinese: 3000, healthy: 2500 },
    { month: "July", sriLanka: 5000, italian: 4500, western: 4000, indian: 3500, chinese: 3000, healthy: 2500 },
    { month: "August", sriLanka: 5000, italian: 4500, western: 4000, indian: 3500, chinese: 3000, healthy: 2500 },
    { month: "September", sriLanka: 5000, italian: 4500, western: 4000, indian: 3500, chinese: 3000, healthy: 2500 },
    { month: "October", sriLanka: 5000, italian: 4500, western: 4000, indian: 3500, chinese: 3000, healthy: 2500 },
    { month: "November", sriLanka: 5000, italian: 4500, western: 4000, indian: 3500, chinese: 3000, healthy: 2500 },
    { month: "December", sriLanka: 5000, italian: 4500, western: 4000, indian: 3500, chinese: 3000, healthy: 2500 }
  ];

  // D. For Travel Methods Table
  const travelTableData = [
    { month: "January", privateVehicle: 5000, bus: 4500, tukTuk: 4000 },
    { month: "February", privateVehicle: 5000, bus: 4500, tukTuk: 4000 },
    { month: "March", privateVehicle: 5000, bus: 4500, tukTuk: 4000 },
    { month: "April", privateVehicle: 5000, bus: 4500, tukTuk: 4000 },
    { month: "May", privateVehicle: 5000, bus: 4500, tukTuk: 4000 },
    { month: "June", privateVehicle: 5000, bus: 4500, tukTuk: 4000 },
    { month: "July", privateVehicle: 5000, bus: 4500, tukTuk: 4000 },
    { month: "August", privateVehicle: 5000, bus: 4500, tukTuk: 4000 },
    { month: "September", privateVehicle: 5000, bus: 4500, tukTuk: 4000 },
    { month: "October", privateVehicle: 5000, bus: 4500, tukTuk: 4000 },
    { month: "November", privateVehicle: 5000, bus: 4500, tukTuk: 4000 },
    { month: "December", privateVehicle: 5000, bus: 4500, tukTuk: 4000 }
  ];


  // Table 1 Totals
  const totalSriLanka = foodTableData.reduce((acc, r) => acc + r.sriLanka, 0);
  const totalItalian = foodTableData.reduce((acc, r) => acc + r.italian, 0);
  const totalWestern = foodTableData.reduce((acc, r) => acc + r.western, 0);
  const totalIndian = foodTableData.reduce((acc, r) => acc + r.indian, 0);
  const totalChinese = foodTableData.reduce((acc, r) => acc + r.chinese, 0);
  const totalHealthy = foodTableData.reduce((acc, r) => acc + r.healthy, 0);

  // Table 2 Totals
  const totalPrivateVehicle = travelTableData.reduce((acc, r) => acc + r.privateVehicle, 0);
  const totalBus = travelTableData.reduce((acc, r) => acc + r.bus, 0);
  const totalTukTuk = travelTableData.reduce((acc, r) => acc + r.tukTuk, 0);

  // Number Format Helper
  const formatNum = (val) => new Intl.NumberFormat('en-US').format(val);

  const monthColors = [
    "bg-[#1F5395] text-white",      // Jan
    "bg-[#2D72AA] text-white",      // Feb
    "bg-[#3E91BE] text-white",      // Mar
    "bg-[#4FAFCF] text-gray-900",   // Apr
    "bg-[#6EC9DF] text-gray-900",   // May
    "bg-[#8EE2EC] text-gray-900",   // Jun
    "bg-[#B2EDF3] text-gray-900",   // Jul
    "bg-[#2D72AA] text-white",      // Aug
    "bg-[#3E91BE] text-white",      // Sept
    "bg-[#4FAFCF] text-gray-900",   // Oct
    "bg-[#6EC9DF] text-gray-900",   // Nov
    "bg-white text-gray-900"        // Dec
  ];

  return (
    <div className="min-h-screen bg-[#EAF4FC]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* 1. Header Section */}
      <Header />

      <main className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-10 flex flex-col items-center gap-12">

        {/* Famouse Foods Section */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight text-center w-full mt-6">
          Most Perches Famous foods count
        </h2>

        {/* Famous Foods Bar Chart Card */}
        <div className="w-full max-w-[900px] bg-white rounded-3xl p-4 sm:p-10 shadow-sm border border-gray-100 relative">
          
          <h4 className="text-center font-bold text-gray-700 text-sm sm:text-base mb-8">
            total Summary of tourist arrival
          </h4>

          <div className="absolute top-6 right-0 sm:right-10 bg-[#B9E3FB]/60 rounded-xl p-3 text-[10px] sm:text-xs font-semibold text-gray-700 leading-relaxed max-w-[190px] border border-[#A2D5FF]/30 shadow-sm hidden sm:block">
            <p>X - Food categories</p>
            <p>Y - Total Revenue in the year</p>
          </div>

          <div className="relative w-full h-[285px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={foodChartData} 
  
                margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
              >

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D1D5DB" />
                
                <XAxis 
                  dataKey="label" 
                  height={65} 
                  tick={{ fill: '#374151', fontSize: 11, fontWeight: 'bold' }} 
                  axisLine={{ stroke: '#1f2937', strokeWidth: 2 }} 
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                />
                
                <YAxis 
                  width={55}
                  tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 'bold' }} 
                  axisLine={{ stroke: '#1f2937', strokeWidth: 2 }} 
                  tickLine={false}
                />
                
                <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }} />

                <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={45}>
                  {foodChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.colorHex} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

  
        <div className="w-full max-w-[1100px] flex justify-end mb-4 pr-15 transform transition-transform duration-300 xl:translate-x-[110px] 2xl:translate-x-[220px]">
          <button className="flex items-center gap-2 bg-[#1E50FF] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-all">
            <img src={PDF_PNG} alt="PDF" className="w-5 h-5 object-contain" />
            <span>Download PDF</span>
          </button>
        </div>

        <div className="w-full max-w-[1100px] overflow-x-auto rounded-2xl border border-gray-300 shadow-sm bg-white mb-10">
          <table className="w-full text-xs sm:text-sm text-gray-800 border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-[#59C1D9] text-gray-900 font-extrabold text-center border-b border-gray-300">
                <th className="px-4 py-4 border-r border-gray-300 w-52">Month</th>
                <th className="px-4 py-4 border-r border-gray-300">Sri Laken foods</th>
                <th className="px-4 py-4 border-r border-gray-300">Italian Food</th>
                <th className="px-4 py-4 border-r border-gray-300">Western Fast foods</th>
                <th className="px-4 py-4 border-r border-gray-300">Indian Food</th>
                <th className="px-4 py-4 border-r border-gray-300">Chinese Food</th>
                <th className="px-4 py-4">Healthy / Vegan Food</th>
              </tr>
            </thead>
            <tbody>
              {foodTableData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-300 text-center font-semibold hover:bg-slate-50/50 transition-colors">
                  <td className={`px-4 py-3 border-r border-gray-300 font-bold ${monthColors[idx]}`}>{row.month}</td>
                  <td className="px-4 py-3 border-r border-gray-300 font-medium text-gray-600">{formatNum(row.sriLanka)}</td>
                  <td className="px-4 py-3 border-r border-gray-300 font-medium text-gray-600">{formatNum(row.italian)}</td>
                  <td className="px-4 py-3 border-r border-gray-300 font-medium text-gray-600">{formatNum(row.western)}</td>
                  <td className="px-4 py-3 border-r border-gray-300 font-medium text-gray-600">{formatNum(row.indian)}</td>
                  <td className="px-4 py-3 border-r border-gray-300 font-medium text-gray-600">{formatNum(row.chinese)}</td>
                  <td className="px-4 py-3 font-medium text-gray-600">{formatNum(row.healthy)}</td>
                </tr>
              ))}
              
              <tr className="bg-[#E5E5E5] text-center font-extrabold text-gray-900">
                <td className="px-4 py-4 border-r border-gray-300 font-black">Total year count</td>
                <td className="px-4 py-4 border-r border-gray-300 font-black">{formatNum(totalSriLanka)}</td>
                <td className="px-4 py-4 border-r border-gray-300 font-black">{formatNum(totalItalian)}</td>
                <td className="px-4 py-4 border-r border-gray-300 font-black">{formatNum(totalWestern)}</td>
                <td className="px-4 py-4 border-r border-gray-300 font-black">{formatNum(totalIndian)}</td>
                <td className="px-4 py-4 border-r border-gray-300 font-black">{formatNum(totalChinese)}</td>
                <td className="px-4 py-4 font-black">{formatNum(totalHealthy)}</td>
              </tr>
            </tbody>
          </table>
        </div>


        {/* Most used Travel methods count Section */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight text-center w-full mt-10">
          Most used Travel methods count
        </h2>

        <div className="w-full max-w-[900px] bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 flex flex-col">
          
          <h4 className="text-center font-bold text-gray-700 text-sm sm:text-base mb-8">
            Summary of travel methods use By tourists
          </h4>

          <div className="flex flex-col md:flex-row items-center justify-around gap-8 w-full">

            <div className="w-[240px] h-[240px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={travelChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}

                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs sm:text-sm font-black select-none">
                          {`${(percent * 100).toFixed(0)} %`}
                        </text>
                      );
                    }}
                    outerRadius={110}
                    dataKey="value"
                  >
                    {travelChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-4">
              {travelChartData.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-4 bg-white rounded-xl px-5 py-3 shadow-md border border-gray-100 min-w-[210px]"
                >
                 
                  <div className="h-2 w-10 rounded-full" style={{ backgroundColor: item.color }} />
               
                  <span className="text-xs sm:text-sm font-bold text-gray-700 select-none">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Intermediate PDF Button for Report 2 */}
        <div className="w-full max-w-[1100px] flex justify-end mb-4 pr-15 transform transition-transform duration-300 xl:translate-x-[110px] 2xl:translate-x-[220px]">
          <button className="flex items-center gap-2 bg-[#1E50FF] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-all">
            <img src={PDF_PNG} alt="PDF" className="w-5 h-5 object-contain" />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Travel Methods Data Table */}
        <div className="w-full max-w-[1100px] overflow-x-auto rounded-2xl border border-gray-300 shadow-sm bg-white mb-10">
          <table className="w-full text-xs sm:text-sm text-gray-800 border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#59C1D9] text-gray-900 font-extrabold text-center border-b border-gray-300">
                <th className="px-4 py-4 border-r border-gray-300 w-52">Month</th>
                <th className="px-4 py-4 border-r border-gray-300">Private Vehicle</th>
                <th className="px-4 py-4 border-r border-gray-300">Bus</th>
                <th className="px-4 py-4">Tuk tuk</th>
              </tr>
            </thead>
            <tbody>
              {travelTableData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-300 text-center font-semibold hover:bg-slate-50/50 transition-colors">
                  <td className={`px-4 py-3 border-r border-gray-300 font-bold ${monthColors[idx]}`}>{row.month}</td>
                  <td className="px-4 py-3 border-r border-gray-300 font-medium text-gray-600">{formatNum(row.privateVehicle)}</td>
                  <td className="px-4 py-3 border-r border-gray-300 font-medium text-gray-600">{formatNum(row.bus)}</td>
                  <td className="px-4 py-3 font-medium text-gray-600">{formatNum(row.tukTuk)}</td>
                </tr>
              ))}
              
              <tr className="bg-[#E5E5E5] text-center font-extrabold text-gray-900">
                <td className="px-4 py-4 border-r border-gray-300 font-black">Total year count</td>
                <td className="px-4 py-4 border-r border-gray-300 font-black">{formatNum(totalPrivateVehicle)}</td>
                <td className="px-4 py-4 border-r border-gray-300 font-black">{formatNum(totalBus)}</td>
                <td className="px-4 py-4 font-black">{formatNum(totalTukTuk)}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default BehaviorStatReport;