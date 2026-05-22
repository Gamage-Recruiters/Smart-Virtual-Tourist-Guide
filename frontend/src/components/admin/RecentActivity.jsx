import React from 'react';

const activities = [
  {
    id: 1,
    title: 'New package published',
    subtitle: 'Paradise Travel Co.',
    time: '2 mins ago',
    dotColor: 'bg-red-500'
  },
  {
    id: 2,
    title: 'User registration',
    subtitle: 'John Doe',
    time: '15 minutes ago',
    dotColor: 'bg-yellow-400'
  },
  {
    id: 3,
    title: 'Booking completed',
    subtitle: 'Sarah Johnson',
    time: '1 hours ago',
    dotColor: 'bg-purple-500'
  },
  {
    id: 4,
    title: 'New package published',
    subtitle: 'Paradise Travel Co.',
    time: '2 hours ago',
    dotColor: 'bg-orange-400'
  },
  {
    id: 5,
    title: 'User registration',
    subtitle: 'sachin jayalth',
    time: '2 hours ago',
    dotColor: 'bg-yellow-400'
  },
  {
    id: 6,
    title: 'Package reviewed',
    subtitle: 'Paradise Travel Co.',
    time: '2 hours ago',
    dotColor: 'bg-purple-500'
  },
  {
    id: 7,
    title: 'Payment received',
    subtitle: 'Michael Chen',
    time: '3 hours ago',
    dotColor: 'bg-green-500'
  }
];

const RecentActivity = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[12px] shadow-sm border border-gray-100 mt-6 font-inter">
      <div className="mb-6">
        <h2 className="text-[24px] font-bold text-[#111111]">Recent Activity</h2>
        <p className="text-[14px] text-gray-600 mt-1">New listings waiting for review.</p>
      </div>

      <div className="flex flex-col gap-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex justify-between items-center group cursor-pointer">
            <div className="flex items-start gap-4">
              <div className={`w-2 h-2 rounded-full mt-2 ${activity.dotColor}`}></div>
              <div className="flex flex-col">
                <h4 className="text-[14px] font-medium text-[#111111] group-hover:text-blue-600 transition-colors">
                  {activity.title}
                </h4>
                <span className="text-[12px] text-gray-500 mt-0.5">
                  {activity.subtitle}
                </span>
              </div>
            </div>
            <span className="text-[12px] text-gray-500">
              {activity.time}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button className="bg-[#1877F2] text-white text-[12px] font-medium py-2 px-6 rounded-[6px] hover:bg-blue-600 transition-colors">
          See more
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;