import React from "react";

const NotificationSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col p-4 rounded-2xl border border-gray-100 bg-gray-50/50 mb-3 shadow-sm">
      <div className="flex items-start">
        {/* Icon Circle */}
        <div className="flex-shrink-0 p-5 rounded-full bg-gray-200 mr-4"></div>
        
        <div className="flex-1 space-y-3 py-1">
          {/* Title and Time Row */}
          <div className="flex justify-between items-start">
            <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
            <div className="h-2 bg-gray-100 rounded-full w-12"></div>
          </div>
          
          {/* Message Lines */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded-full w-full"></div>
            <div className="h-3 bg-gray-200 rounded-full w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSkeleton;