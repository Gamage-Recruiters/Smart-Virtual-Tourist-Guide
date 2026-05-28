import { Outlet } from "react-router-dom";
import Header from "../components/header";

const MainPage = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <Header/>

      {/* Main Content */}
      <main className="w-full mt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default MainPage;