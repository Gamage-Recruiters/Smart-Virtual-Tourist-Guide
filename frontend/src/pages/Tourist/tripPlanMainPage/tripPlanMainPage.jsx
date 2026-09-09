import Sidebar from "../../../components/Tourist/touristMainPage/sidebar";
import Header from "../../../components/Tourist/touristMainPage/header";
import { Outlet } from "react-router-dom";
import Footer from "../../../components/Footer";
import TripPlanningPage from "../tripPlanning/TripPlanningPage.jsx";

const MainPage = () => {
  return (
    <>
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
        {/* Sidebar */}
        <Sidebar />

        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="w-full ml-64 mt-20 overflow-y-auto">

          <Outlet />
          <TripPlanningPage />
        </main>
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
};

export default MainPage;
