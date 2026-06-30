import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";

import { downloadReportPDF } from "../services/pdfService";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

import PDF_PNG from "../assets/pdf.png";

const ComplaintReport = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const queryParams = new URLSearchParams(window.location.search);
  const exportMode = queryParams.get('export') === 'true';

  useEffect(() => {
    if (exportMode) {
      document.title = "Tourist Complaints Report";
    }
  }, [exportMode]);

  // A. For Doughnut Chart 
  const complaintChartData = [
    { name: "Scam problems", value: 70, color: "#0B53A4" }, // Dark Blue
    { name: "General problems", value: 20, color: "#00B4D8" }, // Light Teal/Cyan
    { name: "Other problems", value: 10, color: "#FFC154" }   // Yellow/Orange
  ];

  // B. For Complaints Table
  const tableData = [
    { month: "January", scam: 500, general: 450, service: 400, other: 350 },
    { month: "February", scam: 500, general: 450, service: 400, other: 350 },
    { month: "March", scam: 500, general: 450, service: 400, other: 350 },
    { month: "April", scam: 500, general: 450, service: 400, other: 350 },
    { month: "May", scam: 500, general: 450, service: 400, other: 350 },
    { month: "June", scam: 500, general: 450, service: 400, other: 350 },
    { month: "July", scam: 500, general: 450, service: 400, other: 350 },
    { month: "August", scam: 500, general: 450, service: 400, other: 350 },
    { month: "September", scam: 500, general: 450, service: 400, other: 350 },
    { month: "October", scam: 500, general: 450, service: 400, other: 350 },
    { month: "November", scam: 500, general: 450, service: 400, other: 350 },
    { month: "December", scam: 500, general: 450, service: 400, other: 350 }
  ];

  // For Table Totals 
  const totalScam = tableData.reduce((acc, r) => acc + r.scam, 0);
  const totalGeneral = tableData.reduce((acc, r) => acc + r.general, 0);
  const totalService = tableData.reduce((acc, r) => acc + r.service, 0);
  const totalOther = tableData.reduce((acc, r) => acc + r.other, 0);

  const formatNum = (val) => new Intl.NumberFormat('en-US').format(val);

  const monthColors = [
    "bg-[#1F5395] text-white", "bg-[#2D72AA] text-white", "bg-[#3E91BE] text-white",
    "bg-[#4FAFCF] text-gray-900", "bg-[#6EC9DF] text-gray-900", "bg-[#8EE2EC] text-gray-900",
    "bg-[#B2EDF3] text-gray-900", "bg-[#2D72AA] text-white", "bg-[#3E91BE] text-white",
    "bg-[#4FAFCF] text-gray-900", "bg-[#6EC9DF] text-gray-900", "bg-white text-gray-900"
  ];

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      const currentUrl = `${window.location.origin}${window.location.pathname}?export=true`;
      const result = await downloadReportPDF(currentUrl);

      if (!result.success) {
        alert("PDF download failed.");
        setIsDownloading(false);
        return;
      }

      const fileUrl = window.URL.createObjectURL(result.blob);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', 'Tourist_Complaints_Report.pdf');
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(fileUrl);

      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3500);

    } catch (error) {
      console.error("PDF download failed:", error);
      alert("PDF download failed.");
    } finally {
      setIsDownloading(false);
    }
  };

  // --- CONDITIONAL RENDERING FOR PDF EXPORT (A4) ---
  if (exportMode) {
    return (
      <div className="min-h-screen bg-[#EAF4FC] p-10 flex flex-col items-center gap-12" style={{ fontFamily: "'Inter', sans-serif" }}>
        <style>{printStyles}</style>

        <h2 className="text-3xl font-extrabold text-gray-900 text-center w-full">
          Tourist problems report count table
        </h2>

        <div className="w-full max-w-[900px] bg-white rounded-3xl p-10 shadow-sm border border-gray-100 flex flex-col items-center">
          <h4 className="text-center font-bold text-gray-700 text-sm mb-8">
            Summary of Problems report count
          </h4>
          <div className="flex flex-row items-center justify-around gap-8 w-full">

            <div className="w-[240px] h-[240px] flex items-center justify-center relative">
              <PieChart width={240} height={240}>
                <Pie
                  data={complaintChartData}
                  cx="50%" cy="50%" labelLine={false}
                  innerRadius={55} outerRadius={110} dataKey="value" isAnimationActive={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-black">
                        {`${(percent * 100).toFixed(0)} %`}
                      </text>
                    );
                  }}
                >
                  {complaintChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </div>

            <div className="flex flex-col gap-4">
              {complaintChartData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-white rounded-xl px-5 py-3 shadow-md border border-gray-100 min-w-[210px]">
                  <div className="h-2 w-10 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-gray-700">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1100px] overflow-x-auto rounded-2xl border border-gray-300 shadow-sm bg-white">
          <table className="w-full text-xs text-gray-800 border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-[#59C1D9] text-gray-900 font-extrabold text-center border-b border-gray-300">
                <th className="px-4 py-4 border-r border-gray-300 w-52">Month</th>
                <th className="px-4 py-4 border-r border-gray-300">Scam problems Report</th>
                <th className="px-4 py-4 border-r border-gray-300">General problems report</th>
                <th className="px-4 py-4 border-r border-gray-300">Service problem report</th>
                <th className="px-4 py-4">Other problem report</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-300 text-center font-semibold hover:bg-slate-50/50">
                  <td className={`px-4 py-3 border-r border-gray-300 font-bold ${monthColors[idx]}`}>{row.month}</td>
                  <td className="px-4 py-3 border-r border-gray-300 font-medium text-gray-600">{formatNum(row.scam)}</td>
                  <td className="px-4 py-3 border-r border-gray-300 font-medium text-gray-600">{formatNum(row.general)}</td>
                  <td className="px-4 py-3 border-r border-gray-300 font-medium text-gray-600">{formatNum(row.service)}</td>
                  <td className="px-4 py-3 font-medium text-gray-600">{formatNum(row.other)}</td>
                </tr>
              ))}
              <tr className="bg-[#E5E5E5] text-center font-extrabold text-gray-900">
                <td className="px-4 py-4 border-r border-gray-300 font-black">Total reported problem</td>
                <td className="px-4 py-4 border-r border-gray-300 font-black">{formatNum(totalScam)}</td>
                <td className="px-4 py-4 border-r border-gray-300 font-black">{formatNum(totalGeneral)}</td>
                <td className="px-4 py-4 border-r border-gray-300 font-black">{formatNum(totalService)}</td>
                <td className="px-4 py-4 font-black">{formatNum(totalOther)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAF4FC]" style={{ fontFamily: "'Inter', sans-serif" }}>

      <Header />

      <main className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-10 flex flex-col items-center gap-10">

        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight text-center w-full mt-6">
          Tourist problems report count table
        </h2>

        <div className="w-full max-w-[900px] bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 flex flex-col">
          <h4 className="text-center font-bold text-gray-700 text-sm sm:text-base mb-8">
            Summary of Problems report count
          </h4>
          <div className="flex flex-col md:flex-row items-center justify-around gap-8 w-full">
            <div className="w-[240px] h-[240px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complaintChartData}
                    cx="50%" cy="50%" labelLine={false}
                    innerRadius={55} outerRadius={110} dataKey="value"
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
                  >
                    {complaintChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-4">
              {complaintChartData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-white rounded-xl px-5 py-3 shadow-md border border-gray-100 min-w-[210px]">
                  <div className="h-2 w-10 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs sm:text-sm font-bold text-gray-700 select-none">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Download PDF Button */}
        <div className="w-full max-w-[1100px] flex justify-end mb-4 pr-15 transform transition-transform duration-300 xl:translate-x-[110px] 2xl:translate-x-[220px] print:hidden">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className={`flex items-center gap-2 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-all ${isDownloading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1E50FF] hover:bg-blue-700'
              }`}
          >
            <img src={PDF_PNG} alt="PDF" className="w-5 h-5 object-contain" />
            <span>{isDownloading ? "Downloading..." : "Download PDF"}</span>
          </button>
        </div>

        {/* DATA MATRIX SECTION */}
        <div className="w-full max-w-[1100px] overflow-x-auto rounded-2xl border border-gray-300 shadow-sm bg-white mb-10">
          <table className="w-full text-xs sm:text-sm text-gray-800 border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-[#59C1D9] text-gray-900 font-extrabold text-center border-b border-gray-300">
                <th className="px-4 py-4 border-r border-gray-300 w-52">Month</th>
                <th className="px-4 py-4 border-r border-gray-300">Scam problems Report</th>
                <th className="px-4 py-4 border-r border-gray-300">General problems report</th>
                <th className="px-4 py-4 border-r border-gray-300">Service problem report</th>
                <th className="px-4 py-4">Other problem report</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-300 text-center font-semibold hover:bg-slate-50/50 transition-colors">
                  <td className={`px-4 py-3 border-r border-gray-300 font-bold ${monthColors[idx]}`}>{row.month}</td>
                  <td className="px-4 py-3 border-r border-gray-300 font-medium text-gray-600">{formatNum(row.scam)}</td>
                  <td className="px-4 py-3 border-r border-gray-300 font-medium text-gray-600">{formatNum(row.general)}</td>
                  <td className="px-4 py-3 border-r border-gray-300 font-medium text-gray-600">{formatNum(row.service)}</td>
                  <td className="px-4 py-3 font-medium text-gray-600">{formatNum(row.other)}</td>
                </tr>
              ))}
              <tr className="bg-[#E5E5E5] text-center font-extrabold text-gray-900">
                <td className="px-4 py-4 border-r border-gray-300 font-black">Total reported problem</td>
                <td className="px-4 py-4 border-r border-gray-300 font-black">{formatNum(totalScam)}</td>
                <td className="px-4 py-4 border-r border-gray-300 font-black">{formatNum(totalGeneral)}</td>
                <td className="px-4 py-4 border-r border-gray-300 font-black">{formatNum(totalService)}</td>
                <td className="px-4 py-4 font-black">{formatNum(totalOther)}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </main>

      <Footer />

      {/* Success Download Alert Toast */}
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

// --- PRINT STYLES ---
const printStyles = `
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

      .recharts-responsive-container {
          width: 100% !important;
          min-width: 550px !important; 
          height: 220px !important; 
      }
      .recharts-wrapper {
          width: 100% !important;
          height: 100% !important;
      }
      .recharts-surface {
          width: 100% !important;
          height: 100% !important;
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

      thead tr th:first-child { border-top-left-radius: 16px !important; }
      thead tr th:last-child { border-top-right-radius: 16px !important; }
      tbody tr:last-child td:first-child { border-bottom-left-radius: 16px !important; }
      tbody tr:last-child td:last-child { border-bottom-right-radius: 16px !important; }

      tr {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
      }
  }
`;

export default ComplaintReport;