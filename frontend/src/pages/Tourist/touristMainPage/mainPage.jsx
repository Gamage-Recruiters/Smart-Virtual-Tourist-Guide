import Sidebar from "../../../components/Tourist/touristMainPage/sidebar";
import Header from "../../../components/Tourist/touristMainPage/Header";
import { Outlet } from "react-router-dom";
import Footer from "../../../components/Tourist/Footer";

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
          {/* Footer */}
          <Footer />
        </main>
      </div>
    </>
  );
};

export default MainPage;
