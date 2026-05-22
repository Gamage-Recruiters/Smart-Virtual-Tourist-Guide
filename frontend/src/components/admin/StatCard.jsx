import React from 'react';

const StatCard = ({ title, count, percentage, isPositive, icon }) => {
  return (
    <div className="bg-white p-6 rounded-[12px] shadow-sm border border-gray-100 flex flex-col gap-4 font-inter min-w-[240px]">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h3 className="text-[14px] font-medium text-gray-500">{title}</h3>
          <h2 className="text-[32px] font-bold text-[#111111]">{count}</h2>
        </div>
        <div className="p-3 bg-[#F5F7FA] rounded-[10px] text-gray-500">
          {icon}
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-1">
        <span className={`flex items-center gap-1 text-[12px] font-medium px-2 py-1 rounded-[6px] ${
          isPositive ? 'text-[#4CAF50] bg-green-50' : 'text-[#2E5C88] bg-blue-50' 
        }`}>
          {isPositive ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7L17 17M17 17H7M17 17V7"/></svg>
          )}
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default StatCard;