import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';

function TouristFeedback() {
  const [feedbackTableData, setFeedbackTableData] = useState([]);
  const [supportTableData, setSupportTableData] = useState([]);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const [feedbackRes, supportRes] = await Promise.all([
          axios.get('http://localhost:5000/api/community-stats/feedback'),
          axios.get('http://localhost:5000/api/community-stats/support')
        ]);
        
        if (feedbackRes.data) {
          setFeedbackTableData(feedbackRes.data);
        }

        if (supportRes.data) {
          setSupportTableData(supportRes.data);
        }
      } catch (error) {
        console.error('Error fetching feedback stats:', error);
      }
    };
    fetchFeedbackData();
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

  const handleExportFeedbackPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("Tourist Feedback on Services", 14, 15);
      
      const tableColumn = ["Service Type", "Avg Rating", "Positive feedback %", "Negative feedback %"];
      const tableRows = [];

      feedbackTableData.forEach(row => {
        tableRows.push([row.service, row.rating, row.positive, row.negative]);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        theme: 'grid',
        headStyles: { fillColor: [13, 115, 167] },
      });

      doc.save('Tourist_Feedback_Services.pdf');
      showSuccessToast();
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  const handleExportSupportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("Tourist support on network", 14, 15);
      
      const tableColumn = ["Request Type", "Number of requests", "Region", "Priority level", "Status"];
      const tableRows = [];

      supportTableData.forEach(row => {
        tableRows.push([row.type, row.requests, row.region, row.priority, row.status]);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        theme: 'grid',
        headStyles: { fillColor: [13, 115, 167] },
      });

      doc.save('Tourist_Support_Requests.pdf');
      showSuccessToast();
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  return (
    <div className="bg-[#eaf4fc] min-h-screen font-sans pt-32">
      <Header />
      
      <div className="max-w-5xl mx-auto px-4 flex flex-col gap-12">
        
        {/* Section 1: Tourist Feedback on Services */}
        <section className="flex flex-col gap-8">
          <h1 className="text-center font-bold text-xl text-gray-800">
            Tourist Feedback on Services
          </h1>

          {/* Feedback Chart Section */}
          <div className="flex flex-col relative">
            <div className="bg-white rounded-xl shadow-sm p-8 w-full flex flex-col items-center">
              <h3 className="text-gray-700 font-medium mb-8 text-sm">Tourist Feedback on Services</h3>
              
              {/* Bar Chart Mockup */}
              <div className="w-full max-w-3xl flex gap-4 h-64 relative border-b-2 border-l-2 border-gray-300 pb-2 pl-4">
                {/* Y Axis labels */}
                <div className="absolute -left-10 top-0 bottom-0 flex flex-col justify-between text-[10px] text-gray-500 font-medium">
                  <span>100</span>
                  <span>80</span>
                  <span>60</span>
                  <span>40</span>
                  <span>20</span>
                  <span>0</span>
                </div>
                
                {/* Bars Dynamically Rendered */}
                <div className="flex flex-1 items-end justify-around gap-2 h-full pt-4">
                  {feedbackTableData.length > 0 ? feedbackTableData.map((fb, idx) => {
                    const positiveNum = parseInt(String(fb.positive).replace('%',''), 10) || 0;
                    const heightPercent = Math.min(100, Math.max(10, positiveNum));
                    const colors = ['#d68a7f', '#ef6c57', '#f48b52', '#f8b24f', '#fcd45a', '#e8e268', '#75b98a', '#9bc69e', '#abbb94', '#7c564c'];
                    
                    return (
                      <div key={idx} className="w-full relative group" style={{ backgroundColor: colors[idx % colors.length], height: `${heightPercent}%` }}>
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] -rotate-45 origin-top-left text-gray-600 truncate max-w-[60px]">{fb.service}</span>
                      </div>
                    );
                  }) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">No data available</div>
                  )}
                </div>

                {/* Legend */}
                <div className="absolute top-0 right-4 bg-gray-50 border border-gray-200 p-2 rounded shadow-sm text-[10px] flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400"></div> Satisfied
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-300"></div> Negative
                  </div>
                </div>
              </div>
              <div className="h-8"></div> {/* Spacer for x-axis labels */}
            </div>
            
            <div className="flex justify-end mt-4">
              <button onClick={handleExportFeedbackPDF} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1.5 rounded-full text-sm font-medium shadow-sm flex items-center justify-center transition-colors">
                Export
              </button>
            </div>
          </div>

          {/* Feedback Table */}
          <div className="w-full overflow-x-auto bg-white rounded-sm shadow-sm border border-gray-200">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold bg-[#0d73a7] text-white border-r border-gray-200 w-1/3">
                    Service Type
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold bg-[#2998cc] text-white text-center border-r border-gray-200">
                    Avg Rating
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold bg-[#43aedc] text-white text-center border-r border-gray-200">
                    Positive feedback<br/>percentage
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold bg-[#58c0e7] text-white text-center">
                    Negative feedback<br/>percentage
                  </th>
                </tr>
              </thead>
              <tbody>
                {feedbackTableData.map((row, index) => (
                  <tr key={index} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3 border-r border-gray-200 font-medium text-gray-800">
                      {row.service}
                    </td>
                    <td className="px-6 py-3 text-center border-r border-gray-200">
                      {row.rating}
                    </td>
                    <td className="px-6 py-3 text-center border-r border-gray-200">
                      {row.positive}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {row.negative}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>


        {/* Section 2: Tourist support on network */}
        <section className="flex flex-col gap-8 mt-4">
          <h1 className="text-center font-bold text-xl text-gray-800">
            Tourist support on network
          </h1>

          {/* Support Chart Section */}
          <div className="flex flex-col relative">
            <div className="bg-white rounded-xl shadow-sm p-8 w-full flex flex-col items-center">
              <h3 className="text-gray-700 font-medium mb-8 text-sm">Tourist support status</h3>
              
              {/* Bar Chart Mockup */}
              <div className="w-full max-w-3xl flex gap-4 h-64 relative border-b-2 border-l-2 border-gray-300 pb-2 pl-4">
                {/* Y Axis labels */}
                <div className="absolute -left-10 top-0 bottom-0 flex flex-col justify-between text-[10px] text-gray-500 font-medium">
                  <span>1000</span>
                  <span>800</span>
                  <span>600</span>
                  <span>400</span>
                  <span>200</span>
                  <span>0</span>
                </div>
                
                {/* Bars Dynamically Rendered */}
                <div className="flex flex-1 items-end justify-around gap-2 h-full pt-4">
                  {supportTableData.length > 0 ? supportTableData.map((sup, idx) => {
                    const reqNum = parseInt(sup.requests, 10) || 0;
                    const heightPercent = Math.min(100, Math.max(10, (reqNum / 1000) * 100));
                    const colors = ['#900c3f', '#c70039', '#ff5733', '#ff8d85', '#ffc300', '#eddd53', '#75b98a', '#52a67e', '#3962b7', '#3d2a7c'];
                    
                    return (
                      <div key={idx} className="w-full relative group" style={{ backgroundColor: colors[idx % colors.length], height: `${heightPercent}%` }}>
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] -rotate-45 origin-top-left text-gray-600 truncate max-w-[50px]">{sup.type}</span>
                      </div>
                    );
                  }) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">No data available</div>
                  )}
                </div>

                {/* Legend */}
                <div className="absolute top-0 right-4 bg-gray-50 border border-gray-200 p-2 rounded shadow-sm text-[10px] flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400"></div> Supported
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-300"></div> Not Supported
                  </div>
                </div>
              </div>
              <div className="h-8"></div> {/* Spacer for x-axis labels */}
            </div>
            
            <div className="flex justify-end mt-4">
              <button onClick={handleExportSupportPDF} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1.5 rounded-full text-sm font-medium shadow-sm flex items-center justify-center transition-colors">
                Export
              </button>
            </div>
          </div>

          {/* Support Table */}
          <div className="w-full overflow-x-auto bg-white rounded-sm shadow-sm border border-gray-200">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold bg-[#0d73a7] text-white border-r border-gray-200">
                    Request Type
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold bg-[#2998cc] text-white text-center border-r border-gray-200">
                    Number of<br/>requests
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold bg-[#43aedc] text-white text-center border-r border-gray-200">
                    Region
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold bg-[#58c0e7] text-white text-center border-r border-gray-200">
                    Priority level
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold bg-[#93d8ee] text-white text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {supportTableData.map((row, index) => (
                  <tr key={index} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3 border-r border-gray-200 font-medium text-gray-800">
                      {row.type}
                    </td>
                    <td className="px-6 py-3 text-center border-r border-gray-200">
                      {row.requests}
                    </td>
                    <td className="px-6 py-3 text-center border-r border-gray-200">
                      {row.region}
                    </td>
                    <td className="px-6 py-3 text-center border-r border-gray-200">
                      {row.priority}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
      
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}

export default TouristFeedback;
