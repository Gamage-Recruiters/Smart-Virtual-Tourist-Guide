import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';

function CommunityEconomicImpact() {
  const [regionTableData, setRegionTableData] = useState([]);
  const [employmentTableData, setEmploymentTableData] = useState([]);

  useEffect(() => {
    const fetchEconomicStats = async () => {
      try {
        const [regionalRes, employmentRes] = await Promise.all([
          axios.get('http://localhost:5000/api/community-stats/regional'),
          axios.get('http://localhost:5000/api/community-stats/employment')
        ]);
        
        if (regionalRes.data) {
          setRegionTableData(regionalRes.data);
        }

        if (employmentRes.data) {
          setEmploymentTableData(employmentRes.data);
        }
      } catch (error) {
        console.error('Error fetching economic stats:', error);
      }
    };
    fetchEconomicStats();
  }, []);

  const showSuccessToast = () => {
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
  };

  const handleExportRegionalPDF = () => {
    const doc = new jsPDF();
    doc.text("Community Economic Impact - Regional", 14, 15);
    
    const tableColumn = ["Region", "Total SME", "Revenue LKR", "Growth Rate", "Top Sectors expanding"];
    const tableRows = [];

    regionTableData.forEach(row => {
      // Make sure we handle both old mock format and DB format
      const sme = row.smeCount !== undefined ? row.smeCount : row.sme;
      const revenue = row.revenueLKR !== undefined ? row.revenueLKR : row.revenue;
      const growth = row.growthRate !== undefined ? row.growthRate : row.growth;
      
      tableRows.push([row.region, sme, revenue, growth, row.topSectors]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [13, 115, 167] },
    });

    doc.save('Regional_Impact_Stats.pdf');
    showSuccessToast();
  };

  const handleExportEmploymentPDF = () => {
    const doc = new jsPDF();
    doc.text("Employment Impact statistics by Role", 14, 15);
    
    const tableColumn = ["Sector", "Full-Time", "Part-Time / Casual", "Self-Employed", "Total Employees", "Male", "Female"];
    const tableRows = [];

    employmentTableData.forEach(row => {
      // Handle both mock and DB keys
      const m = row.malePercent || row.male;
      const f = row.femalePercent || row.female;
      tableRows.push([row.sector, row.fullTime, row.partTime, row.selfEmployed, row.total, m, f]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [13, 115, 167] },
    });

    doc.save('Employment_Impact_Stats.pdf');
    showSuccessToast();
  };

  return (
    <div className="bg-[#eaf4fc] min-h-screen font-sans pt-32">
      <Header />
      
      <div className="max-w-5xl mx-auto px-4 flex flex-col gap-10">
        
        <h1 className="text-center font-bold text-xl text-gray-800 uppercase tracking-wide">
          Community Economic Impact status
        </h1>

        {/* Chart Section */}
        <div className="flex flex-col relative">
          <div className="bg-white rounded-xl shadow-sm p-8 w-full flex flex-col items-center">
            <h3 className="text-gray-700 font-medium mb-8 text-sm">Total Tourism Impact by Region</h3>
            
            {/* Bar Chart Mockup */}
            <div className="w-full max-w-3xl flex gap-4 h-64 relative border-b-2 border-l-2 border-gray-300 pb-2 pl-4">
              {/* Y Axis labels */}
              <div className="absolute -left-12 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 font-medium">
                <span>1000M</span>
                <span>800M</span>
                <span>600M</span>
                <span>400M</span>
                <span>200M</span>
                <span>0M</span>
              </div>
              
              {/* Bars Dynamically Rendered */}
              <div className="flex flex-1 items-end justify-around gap-2 h-full pt-4">
                {regionTableData.length > 0 ? regionTableData.map((reg, idx) => {
                  const revStr = reg.revenueLKR || reg.revenue || '0';
                  const revNum = parseInt(revStr.replace(/\D/g, ''), 10) || 0;
                  const heightPercent = Math.min(100, Math.max(10, (revNum / 1000) * 100));
                  
                  const colors = ['#880e4f', '#c2185b', '#e64a19', '#f57c00', '#fbc02d', '#dce775', '#81c784', '#4db6ac', '#1976d2', '#5e35b1'];
                  const bgColor = colors[idx % colors.length];

                  return (
                    <div key={idx} className="w-full relative group" style={{ backgroundColor: bgColor, height: `${heightPercent}%` }}>
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] -rotate-45 origin-top-left text-gray-600 truncate max-w-[60px]">{reg.region}</span>
                    </div>
                  );
                }) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">No data available</div>
                )}
              </div>

              {/* Legend */}
              <div className="absolute top-0 right-4 bg-gray-50 border border-gray-200 p-2 rounded shadow-sm text-xs flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400"></div> Direct
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300"></div> Indirect/Induced
                </div>
              </div>
            </div>
            <div className="h-10"></div> {/* Spacer for x-axis labels */}
          </div>
          
          <div className="flex justify-end mt-4">
            <button onClick={handleExportRegionalPDF} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1.5 rounded-full text-sm font-medium shadow-sm flex items-center justify-center transition-colors">
              Export
            </button>
          </div>
        </div>

        {/* Region Table Section */}
        <div className="w-full overflow-x-auto bg-white rounded-sm shadow-sm border border-gray-200">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold bg-[#0d73a7] text-white border-r border-gray-200">
                  Region
                </th>
                <th scope="col" className="px-6 py-4 font-bold bg-[#2998cc] text-white text-center border-r border-gray-200">
                  Total SME
                </th>
                <th scope="col" className="px-6 py-4 font-bold bg-[#43aedc] text-white text-center border-r border-gray-200">
                  Revenue LKR
                </th>
                <th scope="col" className="px-6 py-4 font-bold bg-[#58c0e7] text-white text-center border-r border-gray-200">
                  Growth Rate<br/>last year
                </th>
                <th scope="col" className="px-6 py-4 font-bold bg-[#93d8ee] text-white text-center">
                  Top Sectors expanding<br/>(sme, energy)
                </th>
              </tr>
            </thead>
            <tbody>
              {regionTableData.map((row, index) => (
                <tr key={index} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 border-r border-gray-200 font-medium text-gray-800">
                    {row.region}
                  </td>
                  <td className="px-6 py-3 text-center border-r border-gray-200">
                    {row.smeCount !== undefined ? row.smeCount : row.sme}
                  </td>
                  <td className="px-6 py-3 text-center border-r border-gray-200">
                    {row.revenueLKR || row.revenue}
                  </td>
                  <td className="px-6 py-3 text-center border-r border-gray-200">
                    {row.growthRate || row.growth}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {row.topSectors}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Employment Stats Section */}
        <div className="mt-8">
          <div className="flex justify-between items-end mb-4 px-2">
            <h2 className="text-center w-full font-bold text-lg text-gray-800">
              Employment Impact statistics by Role
            </h2>
            <button onClick={handleExportEmploymentPDF} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1.5 rounded-full text-sm font-medium shadow-sm flex items-center justify-center transition-colors whitespace-nowrap absolute right-0 mr-4 md:static md:mr-0">
              Export
            </button>
          </div>

          <div className="w-full overflow-x-auto bg-white rounded-sm shadow-sm border border-gray-200">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 font-bold bg-[#0d73a7] text-white border-r border-gray-200">Sector</th>
                  <th scope="col" className="px-4 py-3 font-bold bg-[#1d8dbb] text-white text-center border-r border-gray-200">Full-Time</th>
                  <th scope="col" className="px-4 py-3 font-bold bg-[#34a9d4] text-white text-center border-r border-gray-200">Part-Time / Casual</th>
                  <th scope="col" className="px-4 py-3 font-bold bg-[#4fbede] text-white text-center border-r border-gray-200">Self-Employed</th>
                  <th scope="col" className="px-4 py-3 font-bold bg-[#69d4e9] text-white text-center border-r border-gray-200">Total Employees</th>
                  <th scope="col" className="px-4 py-3 font-bold bg-[#9ce1f1] text-white text-center border-r border-gray-200">Male</th>
                  <th scope="col" className="px-4 py-3 font-bold bg-[#bdf0f9] text-gray-800 text-center">Female</th>
                </tr>
              </thead>
              <tbody>
                {employmentTableData.map((row, index) => (
                  <tr key={index} className={`bg-white hover:bg-gray-50 ${index === employmentTableData.length - 1 ? 'border-t-2 border-gray-300 font-bold' : 'border-b border-gray-200'}`}>
                    <td className="px-4 py-3 border-r border-gray-200 text-gray-800">
                      {row.sector}
                    </td>
                    <td className="px-4 py-3 text-center border-r border-gray-200">{row.fullTime}</td>
                    <td className="px-4 py-3 text-center border-r border-gray-200">{row.partTime}</td>
                    <td className="px-4 py-3 text-center border-r border-gray-200">{row.selfEmployed}</td>
                    <td className="px-4 py-3 text-center border-r border-gray-200">{row.total}</td>
                    <td className="px-4 py-3 text-center border-r border-gray-200">{row.malePercent || row.male}</td>
                    <td className="px-4 py-3 text-center">{row.femalePercent || row.female}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}

export default CommunityEconomicImpact;
