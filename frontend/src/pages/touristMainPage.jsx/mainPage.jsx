import Sidebar from "../../components/touristMainPage/sidebar";
import Header from "../../components/touristMainPage/header";
import { Outlet } from "react-router-dom";

const MainPage = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar */}
      <Sidebar/>

      {/* Header */}
      <Header/>

      {/* Main Content */}
      <main className="w-full ml-64 mt-20 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainPage;
