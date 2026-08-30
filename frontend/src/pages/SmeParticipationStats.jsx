import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';

function SmeParticipationStats() {
  const [tableData, setTableData] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [smeRes, dashRes] = await Promise.all([
          axios.get('http://localhost:5000/api/community-stats/sme'),
          axios.get('http://localhost:5000/api/community-stats/dashboard')
        ]);
        if (smeRes.data) setTableData(smeRes.data);
        if (dashRes.data) setDashboardStats(dashRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      
      doc.text("Small & Medium businesses Participation statistics", 14, 15);
      
      const tableColumn = ["SME Business Type / Categories", "Total of registered SME", "Total of currently active SME", "Total of inactive / closed to SME"];
      const tableRows = [];

      tableData.forEach(row => {
        const rowData = [row.category, row.registered, row.active, row.inactive];
        tableRows.push(rowData);
      });

      // Add totals row
      tableRows.push(["Total", totals.registered, totals.active, totals.inactive]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        theme: 'grid',
        headStyles: { fillColor: [29, 141, 187] },
      });

      doc.save('SME_Participation_Stats.pdf');
      
      // Custom Toast Notification
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex items-center justify-center p-6`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="bg-[#12b918] rounded-full w-10 h-10 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-800 font-medium text-sm text-center">PDF has been downloaded</p>
          </div>
        </div>
      ), { duration: 3000 });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  const totals = tableData.reduce((acc, row) => ({
    registered: acc.registered + row.registered,
    active: acc.active + row.active,
    inactive: acc.inactive + row.inactive,
  }), { registered: 0, active: 0, inactive: 0 });

  // Fallback for empty DB
  const econData = dashboardStats?.economicImpact || {
    tourismRevenuePercent: 0,
    localBusinessProfitPercent: 0,
    jobCreationPercent: 0
  };

  return (
    <div className="bg-[#eaf4fc] min-h-screen font-sans pt-32">
      <Header />
      
      <div className="max-w-5xl mx-auto px-4 flex flex-col gap-8">
        
        <h1 className="text-center font-bold text-xl text-gray-800">
          Small & Medium businesses Participation statistics
        </h1>

        {/* Chart Section */}
        <div className="flex justify-center relative">
          <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-2xl flex flex-col items-center">
            <h3 className="text-gray-700 font-medium mb-8 text-sm">Total percentage of SME</h3>
            <div className="flex items-center gap-12 w-full justify-center">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e5e7eb" strokeWidth="20" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - econData.jobCreationPercent/100)} />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - (econData.localBusinessProfitPercent + econData.jobCreationPercent)/100)} />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - econData.tourismRevenuePercent/100)} />
                </svg>
                {/* Fake percentages overlaying the donut */}
                {econData.tourismRevenuePercent > 0 && (
                  <div className="absolute inset-0 text-xs text-white font-bold flex">
                    <span className="absolute top-1/4 left-1/4">{econData.jobCreationPercent}%</span>
                    <span className="absolute bottom-1/4 left-1/2 -translate-x-1/2 text-black">{econData.tourismRevenuePercent}%</span>
                    <span className="absolute top-1/3 right-1/4">{econData.localBusinessProfitPercent}%</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-5 text-sm font-medium text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-1.5 bg-[#10b981] rounded-full"></div> Tourism Revenue
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-1.5 bg-[#ef4444] rounded-full"></div> Local business profit
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-1.5 bg-[#f59e0b] rounded-full"></div> Community profit
                </div>
              </div>
            </div>
          </div>
          
          {/* Export Button */}
          <div className="absolute bottom-0 right-0 transform translate-y-1/2">
            <button onClick={handleExportPDF} className="bg-blue-500 hover:bg-blue-600 cursor-pointer z-10 relative text-white px-6 py-1.5 rounded-full text-sm font-medium shadow-sm flex items-center gap-2 transition-colors">
              Export
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="w-full overflow-x-auto mt-8 bg-white rounded-sm shadow-sm border border-gray-200">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold bg-[#1d8dbb] text-white w-2/5 border-r border-gray-200">
                  SME Business Type /<br/>Categories
                </th>
                <th scope="col" className="px-6 py-4 font-bold bg-[#34a9d4] text-white text-center border-r border-gray-200">
                  Total of registered<br/>SME
                </th>
                <th scope="col" className="px-6 py-4 font-bold bg-[#4fbede] text-white text-center border-r border-gray-200">
                  Total of currently<br/>active SME
                </th>
                <th scope="col" className="px-6 py-4 font-bold bg-[#69d4e9] text-white text-center">
                  Total of inactive /<br/>closed to SME
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 border-r border-gray-200 font-medium text-gray-800">
                    {row.category}
                  </td>
                  <td className="px-6 py-3 text-center border-r border-gray-200">
                    {row.registered}
                  </td>
                  <td className="px-6 py-3 text-center border-r border-gray-200">
                    {row.active}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {row.inactive}
                  </td>
                </tr>
              ))}
              {/* Totals Row */}
              <tr className="bg-gray-200 border-t-2 border-gray-300 font-bold text-gray-800">
                <td className="px-6 py-4 border-r border-gray-300">
                  Total
                </td>
                <td className="px-6 py-4 text-center border-r border-gray-300">
                  {totals.registered}
                </td>
                <td className="px-6 py-4 text-center border-r border-gray-300">
                  {totals.active}
                </td>
                <td className="px-6 py-4 text-center">
                  {totals.inactive}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
      
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}

export default SmeParticipationStats;

