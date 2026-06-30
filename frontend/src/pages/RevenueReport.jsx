import React from 'react';
import { useState, useEffect } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";


import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LineChart,
  Line
} from 'recharts';

import PDF_PNG from "../assets/pdf.png";
import { downloadReportPDF } from "../services/pdfService";

const RevenueReport = () => {

  const [showAlert, setShowAlert] = useState(false);

  const queryParams = new URLSearchParams(window.location.search);
  const exportMode = queryParams.get('export') === 'true';

  useEffect(() => {
    if (exportMode) {
      document.title = "Revenue_Stat_Report";
    }
  }, [exportMode]);

  const handleDownloadPDF = async () => {
    try {
      const currentUrl = `${window.location.origin}${window.location.pathname}?export=true`;

      // Fetch PDF blob via service layer
      const result = await downloadReportPDF(currentUrl);

      if (!result.success) {
        alert("PDF download failed.");
        return;
      }

      // Create a temporary local URL for the fetched Blob
      const fileUrl = window.URL.createObjectURL(result.blob);

      // Create a temporary hidden anchor to trigger save dialog
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', 'Revenue_Stat_Report.pdf'); // Output filename
      document.body.appendChild(link);
      link.click();

      // Clean up temporary DOM elements
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(fileUrl);

      // Show the success alert only after the download completes successfully
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3500); // Hide alert after 3.5 seconds

    } catch (error) {
      console.error("PDF download failed:", error);
      alert("PDF download failed.");
    }
  };

  const dbBarChartData = [
    { label: "Event", value: 500000, colorHex: "#2EC4B6" },
    { label: "Hotel", value: 390000, colorHex: "#72EFDD" },
    { label: "Transport", value: 290000, colorHex: "#D8F3DC" }
  ];

  const dbLineChartData = [
    { label: "Jan", value: 1000 },
    { label: "Feb", value: 1500 },
    { label: "Mar", value: 3000 },
    { label: "Apr", value: 4000 },
    { label: "May", value: 3000 },
    { label: "Jun", value: 6000 },
    { label: "Jul", value: 3500 },
    { label: "Ags", value: 2100 },
    { label: "Sep", value: 1100 },
    { label: "Oct", value: 5500 },
    { label: "Nov", value: 4500 },
    { label: "Dec", value: 5100 }
  ];

  const tableData = [
    { month: "January", event: 150000, hotel: 150000, transport: 150000 },
    { month: "February", event: 500000, hotel: 500000, transport: 500000 },
    { month: "March", event: 250000, hotel: 250000, transport: 250000 },
    { month: "April", event: 150000, hotel: 150000, transport: 150000 },
    { month: "May", event: 500000, hotel: 500000, transport: 500000 },
    { month: "June", event: 250000, hotel: 250000, transport: 250000 },
    { month: "July", event: 150000, hotel: 150000, transport: 150000 },
    { month: "August", event: 500000, hotel: 500000, transport: 500000 },
    { month: "September", event: 250000, hotel: 250000, transport: 250000 },
    { month: "October", event: 150000, hotel: 150000, transport: 150000 },
    { month: "November", event: 500000, hotel: 500000, transport: 500000 },
    { month: "December", event: 250000, hotel: 250000, transport: 250000 }
  ];


  const totalEvent = tableData.reduce((acc, row) => acc + row.event, 0);
  const totalHotel = tableData.reduce((acc, row) => acc + row.hotel, 0);
  const totalTransport = tableData.reduce((acc, row) => acc + row.transport, 0);

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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }

        @media print {
            @page {
                margin: 0; 
            }
            html, body, #root, .min-h-screen {
                height: auto !important;
                min-height: 0 !important;
                background-color: #EAF4FC !important; 
            }
            body {
                padding: 15mm 20mm; 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                background-color: #EAF4FC !important; 
            }

            header, footer {
                display: none !important;
            }

            .grid {
                display: flex !important;
                flex-direction: column !important;
                gap: 20px !important;
                width: 100% !important;
                max-width: 100% !important;
            }
            
            .grid > div {
                width: 100% !important;
                max-width: 100% !important;
                break-inside: avoid !important;
                page-break-inside: avoid !important;
            }

            .overflow-x-auto {
                page-break-before: always !important; 
                break-before: page !important;        
                overflow: visible !important;
                max-width: 100% !important;
                width: 100% !important;

                position: relative !important;
                top: 15mm !important; 
            }

            table {
                min-width: 100% !important;
                width: 100% !important;
                table-layout: fixed !important;
                font-size: 11px !important; 
            }
            th, td {
                padding: 6px 4px !important;
                word-wrap: break-word !important;
            }

            thead tr th:first-child {
                border-top-left-radius: 16px !important;
            }
            thead tr th:last-child {
                border-top-right-radius: 16px !important;
            }
            tbody tr:last-child td:first-child {
                border-bottom-left-radius: 16px !important;
            }
            tbody tr:last-child td:last-child {
                border-bottom-right-radius: 16px !important;
            }

            tr {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
            }
        }
      `}</style>


      <div className="print:hidden">
        <Header />
      </div>

      <main className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-10 flex flex-col items-center gap-10">

        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight text-center w-full">
          Revenue Stat Table
        </h2>


        <div className="w-full max-w-[1300px] grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

          {/* LEFT CHART - Recharts Bar Chart (Summary of the total Revenue) */}
          <div className="bg-white rounded-3xl pt-6 sm:pt-10 pb-[30px] pl-[30px] pr-35 shadow-sm border border-gray-100 relative flex flex-col justify-between">
            <h4 className="text-center font-bold text-gray-700 text-sm sm:text-base mb-8">
              Summary of the total Revenue
            </h4>

            <div className="absolute top-10 right-2 bg-sky-100/60 rounded-xl p-3 text-[10px] sm:text-xs font-semibold text-gray-700 leading-relaxed max-w-[150px] border border-sky-200/30 shadow-sm hidden sm:block">
              <p>X - Revenue Category</p>
              <p>Y - Total Revenue</p>
            </div>

            {/* Plot Area - Recharts Bar Chart */}
            <div className="relative w-full h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dbBarChartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />

                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#374151', fontSize: 11, fontWeight: 'bold' }}
                    axisLine={{ stroke: '#1f2937', strokeWidth: 2 }}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                  />

                  <YAxis
                    tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 'bold' }}
                    axisLine={{ stroke: '#1f2937', strokeWidth: 2 }}
                    tickLine={false}
                  />

                  <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }} />

                  {/* isAnimationActive={false} to disable animation */}
                  <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={45} isAnimationActive={false}>
                    {dbBarChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.colorHex} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RIGHT CHART - Recharts Line Chart */}
          <div className="bg-gradient-to-b from-[#BEE3FC] to-[#F4F9FC]/40 rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-none">
                Revenue Trends of 2025
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-2 mb-8">
                Revenue trends last year
              </p>
            </div>

            <div className="relative w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dbLineChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D1D5DB" />

                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold' }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tickFormatter={(val) => `$${val}`}
                    tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold' }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#F87171"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#F87171', strokeWidth: 1.5, stroke: '#FFFFFF' }}
                    activeDot={{ r: 6 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>

        <div className="w-full max-w-[1100px] flex justify-end mb-4 mr-12 pr-1 transform transition-transform duration-300 xl:translate-x-[110px] 2xl:translate-x-[220px] print:hidden">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-[#1E50FF] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-all">
            <img src={PDF_PNG} alt="PDF" className="w-5 h-5 object-contain" />
            <span>Download PDF</span>
          </button>
        </div>

        <div className="w-full max-w-[1100px] overflow-x-auto rounded-2xl border border-gray-300 shadow-sm bg-white mb-10">
          <table className="w-full text-xs sm:text-sm text-gray-800 border-collapse min-w-[700px]">

            <thead>
              <tr className="bg-[#59C1D9] text-gray-900 font-extrabold text-center border-b border-gray-300">
                <th className="px-4 py-4 border-r border-gray-300 w-52">Month</th>
                <th className="px-4 py-4 border-r border-gray-300">Event revenue</th>
                <th className="px-4 py-4 border-r border-gray-300">Hotel revenue</th>
                <th className="px-4 py-4">Transport revenue</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {tableData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-300 text-center font-semibold hover:bg-slate-50/50 transition-colors">

                  <td className={`px-4 py-3 border-r border-gray-300 font-bold ${monthColors[idx]}`}>
                    {row.month}
                  </td>

                  <td className="px-4 py-3 border-r border-gray-300 font-medium text-gray-600">{formatNum(row.event)}</td>
                  <td className="px-4 py-3 border-r border-gray-300 font-medium text-gray-600">{formatNum(row.hotel)}</td>
                  <td className="px-4 py-3 font-medium text-gray-600">{formatNum(row.transport)}</td>
                </tr>
              ))}

              <tr className="bg-[#E5E5E5] text-center font-extrabold text-gray-900">
                <td className="px-4 py-4 border-r border-gray-300 font-black">Total revenue</td>
                <td className="px-4 py-4 border-r border-gray-300 font-black">{formatNum(totalEvent)}</td>
                <td className="px-4 py-4 border-r border-gray-300 font-black">{formatNum(totalHotel)}</td>
                <td className="px-4 py-4 font-black">{formatNum(totalTransport)}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </main>

      <div className="print:hidden">
        <Footer />
      </div>

      {/* PDF Downloaded Success Alert */}
      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all duration-300">
          <div className="bg-white rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl border border-gray-100 max-w-[340px] transform scale-100 transition-transform">

            {/* Green Checkmark Circle */}
            <div className="w-16 h-16 bg-[#00C853] rounded-full flex items-center justify-center mb-6 shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3.5"
                stroke="white"
                className="w-8 h-8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>

            {/* Alert Text */}
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 select-none">
              PDF has been downloaded
            </h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueReport;