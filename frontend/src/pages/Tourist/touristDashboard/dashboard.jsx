import main from "../../../assets/touristDashboard/main.png";
import TripPlan from "../../../components/Tourist/touristDashboard/tripPlan";
import DiscoverSection from "../../../components/Tourist/touristDashboard/discoverSection";
import BudgetTracker from "../../../components/Tourist/touristDashboard/budgetTracker";
import AlertsNotifications from "../../../components/Tourist/touristDashboard/notifications";
import QuickActions from "../../../components/Tourist/touristDashboard/quickActions";
import UpcomingBookings from "../../../components/Tourist/touristDashboard/upcomingBookings";
import TripCalendar from "../../../components/Tourist/touristDashboard/calender";
import dayjs from "dayjs";
import LocationSelector from "../../../components/notifications/LocationSelector";

function TouristDashboard() {
  // Retrieve travel dates from localStorage (tripInfo or touristProfile)
  const getDates = () => {
    let startStr = "2026-05-15";
    let endStr = "2026-05-25";

    const tripInfo = localStorage.getItem("tripInfo");
    const profile = localStorage.getItem("touristProfile");

    if (tripInfo) {
      try {
        const parsed = JSON.parse(tripInfo);
        if (parsed.startDate) startStr = parsed.startDate;
        if (parsed.endDate) endStr = parsed.endDate;
      } catch (e) {
        console.error("Error parsing tripInfo", e);
      }
    } else if (profile) {
      try {
        const parsed = JSON.parse(profile);
        if (parsed.travelStart) startStr = parsed.travelStart;
        else if (parsed.startDate) startStr = parsed.startDate;

        if (parsed.travelEnd) endStr = parsed.travelEnd;
        else if (parsed.endDate) endStr = parsed.endDate;
      } catch (e) {
        console.error("Error parsing touristProfile", e);
      }
    }

    return {
      startDate: dayjs(startStr),
      endDate: dayjs(endStr),
    };
  };

  const { startDate, endDate } = getDates();

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto 2xl:p-8 xl:flex-row 2xl:gap-8">
      {/* Left Column */}
      <div className="md:flex-[2.5] 2xl:flex-4 space-y-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden shadow-xl h-100 2xl:h-130 rounded-3xl group">
          <img
            src={main}
            alt="Sri Lanka"
            className="object-fill w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Discover Section */}
        <DiscoverSection />

        {/* Trip Plan Section */}
        <TripPlan />

        {/* budget & alterts section */}
        <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
          <BudgetTracker />
          <AlertsNotifications />
        </div>
      </div>

      {/* Right Column (Sidebar/Widgets) */}
      <div className="flex-1 space-y-6">
        {/* Calendar Widget */}
        <TripCalendar startDate={startDate} endDate={endDate} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Upcoming Bookings Section */}
        <UpcomingBookings />

        {/* Final Report Action Button (as seen in your screenshot) */}
        <div className="w-full text-center">
          <button className="w-1/2 py-4 mt-8 font-bold text-white transition-all bg-blue-600 shadow-lg rounded-xl shadow-blue-100 hover:bg-blue-700">
            Final Report
          </button>
        </div>
      </div>

      <div className="mb-6">
        <LocationSelector />
      </div>
    </div>
  );
}

export default TouristDashboard;
