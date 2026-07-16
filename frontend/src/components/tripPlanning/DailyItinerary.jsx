import React, { useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  Trash2,
  Plus,
  GripVertical,
  Utensils,
  Camera,
  Sun,
  Hotel,
} from "lucide-react";

export default function DailyItinerary() {
  const [activeDay, setActiveDay] = useState(1);

  const days = [
    { day: 1, amount: 190 },
    { day: 2, amount: 71 },
    { day: 3, amount: 21 },
    { day: 4, amount: 26 },
    { day: 5, amount: 36 },
  ];

  const activities = [
    {
      time: "08:00 AM",
      title: "Breakfast at Cinnamon Grand",
      location: "Colombo 03",
      duration: "1h",
      price: "$25",
      note: "Try the Sri Lankan breakfast buffet",
      icon: <Utensils className="w-4 h-4 text-orange-500" />,
    },
    {
      time: "10:00 AM",
      title: "Gangaramaya Temple",
      location: "Slave Island, Colombo",
      duration: "2h",
      price: "$5",
      note: "Remove shoes before entering",
      icon: <Camera className="w-4 h-4 text-purple-500" />,
    },
    {
      time: "01:00 PM",
      title: "Lunch at Ministry of Crab",
      location: "Old Dutch Hospital",
      duration: "1.5h",
      price: "$40",
      note: "Book in advance!",
      icon: <Utensils className="w-4 h-4 text-orange-500" />,
    },
    {
      time: "03:30 PM",
      title: "Galle Face Green Walk",
      location: "Galle Face, Colombo",
      duration: "1.5h",
      price: "Free",
      note: "Great sunset views",
      icon: <Sun className="w-4 h-4 text-yellow-500" />,
    },
    {
      time: "07:00 PM",
      title: "Check-in Cinnamon Red Hotel",
      location: "Colombo 02",
      duration: "30m",
      price: "$120",
      note: "Confirmation #CR2024",
      icon: <Hotel className="w-4 h-4 text-green-500" />,
    },
  ];

  return (
    
      <div className="bg-white rounded-3xl p-8 shadow-sm">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="font-bold text-xl">
              Daily Itinerary Planner
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Drag activities to reorder your schedule
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-sm">
            <CalendarDays size={16} />
            <span>
              Day Total: <b>$190</b>
            </span>
          </div>
        </div>

        {/* Day Tabs */}
        <div className="flex flex-wrap gap-3 mb-12">
          {days.map((item) => (
            <button
              key={item.day}
              onClick={() => setActiveDay(item.day)}
              className={`px-5 py-3 rounded-xl transition-all
              ${
                activeDay === item.day
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-gray-600"
              }`}
            >
              <div className="text-sm font-medium">
                Day {item.day}
              </div>

              <div className="text-xs opacity-70">
                ${item.amount}
              </div>
            </button>
          ))}

          <button className="bg-slate-100 rounded-xl px-6 py-3 text-gray-500">
            +Add date
          </button>
        </div>

        {/* Day heading */}
        <div className="flex justify-between mb-8">
          <h3 className="font-semibold text-lg">
            Day 1 – Colombo
          </h3>

          <span className="text-gray-400 text-sm">
            5 activities
          </span>
        </div>

        {/* Activity List */}
        <div className="space-y-8">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex justify-between items-start"
            >
              <div className="flex gap-5">

                <GripVertical
                  className="text-gray-300 mt-3"
                  size={18}
                />

                <div className="bg-slate-100 text-blue-700 text-xs px-3 py-2 rounded-md font-medium h-fit">
                  {activity.time}
                </div>

                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  {activity.icon}
                </div>

                <div>
                  <h4 className="font-semibold">
                    {activity.title}
                  </h4>

                  <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                    <MapPin size={13} />
                    {activity.location}
                  </div>

                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock3 size={14} />
                      {activity.duration}
                    </span>

                    <span className="text-blue-600">
                      {activity.price}
                    </span>

                    <span className="text-yellow-400">
                      ★★★★★
                    </span>
                  </div>

                  <div className="text-xs text-gray-400 mt-2">
                    💡 {activity.note}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="p-2 rounded-lg bg-blue-50">
                  <Pencil
                    size={16}
                    className="text-blue-600"
                  />
                </button>

                <button className="p-2 rounded-lg bg-red-50">
                  <Trash2
                    size={16}
                    className="text-red-400"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add activity */}
        <button className="w-full mt-10 border border-dashed border-slate-300 rounded-2xl py-5 flex justify-center items-center gap-2 text-blue-600 font-medium hover:bg-slate-50">
          <Plus size={18} />
          Add Activity
        </button>
      </div>
    
  );
}