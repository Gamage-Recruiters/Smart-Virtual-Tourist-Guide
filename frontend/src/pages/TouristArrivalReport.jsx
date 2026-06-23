import React from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import PDF_PNG from "../assets/pdf.png";

import { downloadReportPDF } from "../services/pdfService";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell
} from 'recharts';

const TouristArrivalReport = () => {

    const handleDownloadPDF = () => {
        // Pass the current React page URL to the download service
        downloadReportPDF(window.location.href);
    };

    const chartData = [
        { label: "Asia", value: 500000, colorHex: "#0B53A4" },
        { label: "Africa", value: 400000, colorHex: "#247BB2" },
        { label: "Europe", value: 300000, colorHex: "#2EC4B6" },
        { label: "Americas", value: 350000, colorHex: "#4CC9F0" },
        { label: "Oceania", value: 440000, colorHex: "#72EFDD" },
        { label: "Asia-Pacific", value: 170000, colorHex: "#F1C40F" },
        { label: "Middle East", value: 450000, colorHex: "#F39C12" },
    ];

    const regionColors = [
        "bg-[#0B53A4] text-white",           // Asia (Dark Blue)
        "bg-[#247BB2] text-white",           // Africa (Medium Blue)
        "bg-[#2EC4B6] text-gray-900",        // Europe (Teal)
        "bg-[#4CC9F0] text-gray-900",        // Americas (Sky Blue/Teal)
        "bg-[#72EFDD] text-gray-900",        // Oceania (Light Mint/Aqua)
        "bg-[#A8E6CF] text-gray-900",        // Asia-Pacific (Soft Green/Teal)
        "bg-[#D8F3DC] text-gray-900"         // Middle East & North Africa (Very Pale Green)
    ];

    const tableData = [
        {
            region: "Asia",
            rows: [
                { gender: "Male", monthly: [1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500], total: "18,000" },
                { gender: "Female", monthly: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500], total: "6,000" }
            ]
        },
        {
            region: "Africa",
            rows: [
                { gender: "Male", monthly: [1450, 1450, 1450, 1450, 1450, 1450, 1450, 1450, 1450, 1450, 1450, 1450], total: "17,400" },
                { gender: "Female", monthly: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], total: "12,000" }
            ]
        },
        {
            region: "Europe",
            rows: [
                { gender: "Male", monthly: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500], total: "6,000" },
                { gender: "Female", monthly: [1450, 1450, 1450, 1450, 1450, 1450, 1450, 1450, 1450, 1450, 1450, 1450], total: "17,400" }
            ]
        },
        {
            region: "Americas",
            rows: [
                { gender: "Male", monthly: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], total: "12,000" },
                { gender: "Female", monthly: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500], total: "6,000" }
            ]
        },
        {
            region: "Oceania",
            rows: [
                { gender: "Male", monthly: [1450, 1450, 1450, 1450, 1450, 1450, 1450, 1450, 1450, 1450, 1450, 1450], total: "17,400" },
                { gender: "Female", monthly: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], total: "12,000" }
            ]
        },
        {
            region: "Asia-Pacific",
            rows: [
                { gender: "Male", monthly: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500], total: "6,000" },
                { gender: "Female", monthly: [1450, 1450, 1450, 1450, 1450, 1450, 1450, 1450, 1450, 1450, 1450, 1450], total: "17,400" }
            ]
        },
        {
            region: "Middle East & North Africa",
            rows: [
                { gender: "Male", monthly: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], total: "12,000" },
                { gender: "Female", monthly: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], total: "12,000" }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#EAF4FC]" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* Google Fonts */}
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
                    }
                    body {
                        padding: 15mm 20mm; 
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        background-color: #EAF4FC !important; 
                    }
    
                    table {
                        min-width: 100% !important;
                        font-size: 10px !important;
                    }
                    th, td {
                        padding: 5px 3px !important;
                    }
                }
            `}</style>

            <div className="print:hidden">
                <Header />
            </div>

            <main className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-10 flex flex-col items-center">

                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight text-center mb-10 w-full">
                    Total tourist arrival
                </h2>

                <div className="w-full max-w-[900px] bg-white rounded-3xl pt-6 sm:pt-10 pr-4 sm:pr-10 pb-10 sm:pb-[40px] pl-8 sm:pl-[40px] shadow-sm border border-gray-100 relative mb-10">

                    {/* Chart Header */}
                    <h4 className="text-center font-bold text-gray-700 text-sm sm:text-base mb-8">
                        total Summary of tourist arrival
                    </h4>

                    {/* Legend/Key Box */}
                    <div className="absolute top-6 right-6 sm:right-10 bg-[#B9E3FB]/60 rounded-xl p-3 text-[10px] sm:text-xs font-semibold text-gray-700 leading-relaxed max-w-[190px] border border-[#A2D5FF]/30 shadow-sm hidden sm:block print:hidden">
                        <p>X - Region categories</p>
                        <p>Y - Total Tourist Arrivals</p>
                    </div>

                    {/* Recharts Plot Area */}
                    <div className="relative w-full h-[285px] mt-4 flex justify-center">
                        {/* Render BarChart with a static width to ensure stable layout in headless PDF generation */}
                        <BarChart
                            width={780}
                            height={285}
                            data={chartData}
                            margin={{ top: 10, right: 40, left: 10, bottom: 30 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D1D5DB" />

                            <XAxis
                                dataKey="label"
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
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.colorHex} />
                                ))}
                            </Bar>
                        </BarChart>
                    </div>
                </div>

                <div className="w-full max-w-[1000px] flex justify-end mb-4 pr-1 transform transition-transform duration-300 xl:translate-x-[110px] 2xl:translate-x-[220px] z-20 print:hidden">

                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 bg-[#1E50FF] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-all"
                    >
                        <img
                            src={PDF_PNG}
                            alt="PDF Icon"
                            className="w-5 h-5 object-contain"
                        />
                        <span>Download PDF</span>
                    </button>
                </div>

                <div className="w-full max-w-[1000px] overflow-x-auto rounded-2xl border border-gray-300 shadow-sm bg-white mb-10 print:mb-0">
                    <table className="w-full text-xs sm:text-sm text-gray-800 border-collapse min-w-[850px] print:min-w-0">

                        <thead>
                            <tr className="bg-[#B6C9D6] text-gray-900 font-extrabold text-center border-b border-gray-300">
                                <th className="px-2 py-4 border-r border-gray-300 w-16">Age</th>
                                <th className="px-4 py-4 border-r border-gray-300 w-44">Region</th>
                                {["Jan", "Feb", "March", "April", "May", "June", "July", "Augest", "Sept", "Oct", "Nov", "Dec"].map(m => (
                                    <th key={m} className="px-2 py-4 border-r border-gray-300 font-bold">{m}</th>
                                ))}
                                <th className="px-3 py-4">total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tableData.map((group, groupIdx) => (
                                <React.Fragment key={groupIdx}>
                                    {group.rows.map((row, rowIdx) => (
                                        <tr key={rowIdx} className="border-b border-gray-300 text-center font-semibold hover:bg-slate-50/50 transition-colors">

                                            <td className="px-2 py-3 border-r border-gray-300 font-bold bg-gray-50 text-gray-700">
                                                {row.gender}
                                            </td>

                                            {rowIdx === 0 && (
                                                <td
                                                    rowSpan={2}
                                                    className={`px-4 py-3 border-r border-gray-300 font-bold text-center align-middle ${regionColors[groupIdx]}`}
                                                >
                                                    {group.region}
                                                </td>
                                            )}

                                            {/* Monthly values */}
                                            {row.monthly.map((val, mIdx) => (
                                                <td key={mIdx} className="px-2 py-3 border-r border-gray-300 font-medium text-gray-600">
                                                    {val}
                                                </td>
                                            ))}

                                            {/* Row Total */}
                                            <td className="px-3 py-3 font-bold text-gray-900 bg-gray-50">
                                                {row.total}
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

            </main>

            <div className="print:hidden">
                <Footer />
            </div>
        </div>
    );
};

export default TouristArrivalReport;
