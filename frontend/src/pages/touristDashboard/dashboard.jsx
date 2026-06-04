import main from "../../assets/touristDashboard/main.png";
import TripPlan from "../../components/touristDashboard/tripPlan";
import DiscoverSection from "../../components/touristDashboard/discoverSection";
import BudgetTracker from "../../components/touristDashboard/budgetTracker";
import AlertsNotifications from "../../components/touristDashboard/notifications";
import QuickActions from "../../components/touristDashboard/quickActions";
import UpcomingBookings from "../../components/touristDashboard/upcomingBookings";
import TripCalendar from "../../components/touristDashboard/calender";
import dayjs from "dayjs";

function Dashboard() {
  return (
    <div className="p-4 2xl:p-8 flex flex-col xl:flex-row gap-4 2xl:gap-8 overflow-y-auto">
      {/* Left Column */}
      <div className="md:flex-[2.5] 2xl:flex-4 space-y-8">
        {/* Hero Banner */}
        <div className="relative h-100 2xl:h-130 rounded-3xl overflow-hidden shadow-xl group">
          <img
            src={main}
            alt="Sri Lanka"
            className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Discover Section */}
        <DiscoverSection />

        {/* Trip Plan Section */}
        <TripPlan />

        {/* budget & alterts section */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
          <BudgetTracker />
          <AlertsNotifications />
        </div>
      </div>

      {/* Right Column (Sidebar/Widgets) */}
      <div className="flex-1 space-y-6">
        {/* Calendar Widget */}
        <TripCalendar startDate={dayjs("2026-05-15")} endDate={dayjs("2026-05-25")} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Upcoming Bookings Section */}
        <UpcomingBookings />

        {/* Final Report Action Button (as seen in your screenshot) */}
        <div className="w-full text-center">
          <button className="w-1/2 mt-8 bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
          Final Report
        </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
