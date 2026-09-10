import { Building2, Car, Binoculars } from 'lucide-react';

const BookingItem = ({ icon: Icon, title, location, time, status }) => {
  const isConfirmed = status === 'Confirmed';
  
  return (
    <div className="flex items-start justify-between py-5 first:pt-0 last:pb-0">
      <div className="flex items-center gap-4">
        {/* Icon Square */}
        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-blue-900 border border-slate-100">
          <Icon size={22} />
        </div>
        
        {/* Text Content */}
        <div>
          <h5 className="font-bold text-slate-800 text-sm leading-tight">{title}</h5>
          <p className="text-slate-400 text-[11px] font-medium mt-0.5">{location}</p>
          <p className="text-slate-400 text-[11px] font-medium">{time}</p>
        </div>
      </div>

      {/* Status Pill */}
      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
        isConfirmed 
        ? 'bg-green-100 text-green-600' 
        : 'bg-slate-100 text-slate-400'
      }`}>
        {status}
      </div>
    </div>
  );
};

const UpcomingBookings = () => {
  const bookings = [
    {
      icon: Building2,
      title: "Hotel Check-in",
      location: "Kandy",
      time: "3:00 PM",
      status: "Confirmed"
    },
    {
      icon: Car,
      title: "Driver Pickup",
      location: "Hotel Lobby",
      time: "9:00 AM",
      status: "Pending"
    },
    {
      icon: Binoculars,
      title: "Safari Activity",
      location: "Yala National Park",
      time: "3:00 PM",
      status: "Confirmed"
    }
  ];

  return (
    <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base 2xl:text-lg font-bold text-slate-800">Upcoming Bookings</h3>
        <button className="text-blue-600 text-xs font-bold hover:underline">View all</button>
      </div>

      <div className="divide-y divide-slate-50">
        {bookings.map((booking, index) => (
          <BookingItem key={index} {...booking} />
        ))}
      </div>
      
    </div>
  );
};

export default UpcomingBookings;