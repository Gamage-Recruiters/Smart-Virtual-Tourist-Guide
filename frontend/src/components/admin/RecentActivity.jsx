import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import apiClient from '../../services/api';

const activityColor = {
  USER: "bg-yellow-400",
  BOOKING: "bg-purple-500",
  PACKAGE: "bg-red-500",
  PAYMENT: "bg-green-500"
};

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/admin/recent-activities');
        if (res && res.success) {
          setActivities(res.data);
        } else {
          setError("Failed to load activities");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="bg-white p-6 rounded-[12px] shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-[20px] font-bold text-[#111111]">Recent Activity</h3>
        <p className="text-[14px] text-gray-500 mt-1">Latest updates across the platform.</p>
      </div>

      <div className="flex-grow flex flex-col justify-center">
        {loading ? (
          <div className="text-center text-gray-400 py-8 animate-pulse">Loading recent activities...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-8">{error}</div>
        ) : activities.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No recent activities found.</div>
        ) : (
          <div className="flex flex-col space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between group">
                <div className="flex items-start gap-4">
                  <div className="mt-2">
                    <div className={`w-2 h-2 rounded-full ${activityColor[activity.type] || 'bg-gray-400'}`}></div>
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-[#111111] group-hover:text-blue-600 transition-colors">
                      {activity.title}
                    </h4>
                    <p className="text-[13px] text-gray-500 mt-0.5">{activity.subtitle}</p>
                  </div>
                </div>
                <span className="text-[12px] text-gray-400 whitespace-nowrap mt-1">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && !error && activities.length > 0 && (
        <button className="mt-8 w-[100px] self-end bg-[#1877F2] text-white text-[13px] font-medium py-2 px-4 rounded-[6px] hover:bg-blue-600 transition-colors">
          See more
        </button>
      )}
    </div>
  );
};

export default RecentActivity;