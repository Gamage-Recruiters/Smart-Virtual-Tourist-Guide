const StatCard = ({ title, count, percentage, isPositive, icon }) => {
  return (
    <div className="flex min-h-[136px] min-w-0 flex-col justify-between rounded-[10px] border border-white bg-white p-5 font-inter shadow-[0_8px_24px_rgba(46,92,136,0.08)]">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h3 className="text-[14px] font-medium text-gray-500">{title}</h3>
          <h2 className="text-[23px] font-bold text-[#111111]">{count}</h2>
        </div>
        <div className="rounded-[8px] bg-[#F4F9FF] p-2.5 text-[#2E5C88] [&_svg]:h-5 [&_svg]:w-5">
          {icon}
        </div>
      </div>
      
      <div className="mt-2 flex items-center gap-2">
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
