import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import apiClient from '../../services/adminApi';

const activityColor = {
  USER: "bg-yellow-400",
  BOOKING: "bg-purple-500",
  PACKAGE: "bg-red-500",
  PAYMENT: "bg-green-500",
  REVIEW: "bg-orange-400",
  ADVERTISEMENT: "bg-blue-500",
  ROOM: "bg-teal-500"
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
    <div className="mx-auto flex min-h-[620px] w-full max-w-[1210px] flex-col rounded-[10px] border border-white/60 bg-white/40 p-6 shadow-[0_8px_30px_rgba(46,92,136,0.08)] backdrop-blur-[2px] sm:p-10 lg:min-h-[760px] lg:p-14">
      <div className="mb-8 lg:mb-12">
        <h3 className="text-[30px] font-bold text-[#111111] sm:text-[34px] lg:text-[36px]">Recent Activity</h3>
        <p className="mt-2 text-[17px] font-medium text-[#111111] sm:text-[20px] lg:text-[24px]">New listings waiting for review.</p>
      </div>

      <div className="flex-grow flex flex-col justify-center">
        {loading ? (
          <div className="text-center text-gray-400 py-8 animate-pulse">Loading recent activities...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-8">{error}</div>
        ) : activities.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No recent activities found.</div>
        ) : (
          <div className="flex flex-col space-y-7 lg:space-y-9">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between group">
                <div className="flex items-start gap-4">
                  <div className="mt-2">
                    <div className={`w-2 h-2 rounded-full ${activityColor[activity.type] || 'bg-gray-400'}`}></div>
                  </div>
                  <div>
                    <h4 className="text-[16px] font-medium text-[#111111] transition-colors group-hover:text-blue-600 sm:text-[18px] lg:text-[20px]">
                      {activity.title}
                    </h4>
                    <p className="mt-1 text-[12px] font-light text-slate-600 sm:text-[13px]">{activity.subtitle}</p>
                  </div>
                </div>
                <span className="ml-4 mt-1 whitespace-nowrap text-[12px] font-medium text-slate-600 sm:text-[14px]">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && !error && activities.length > 0 && (
        <button type="button" className="mt-10 w-[110px] self-end rounded-[6px] bg-[#0075FF] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-blue-600">
          See more
        </button>
      )}
    </div>
  );
};

export default RecentActivity;
