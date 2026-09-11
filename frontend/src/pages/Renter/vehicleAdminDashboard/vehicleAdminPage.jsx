import { Outlet } from 'react-router-dom';
import Sidebar from '../../../components/Renter/vehicleAdminDashboard/sideBar';

function VehicleAdmin() {
  return (
    <div className="flex h-screen w-full bg-[#f8f9fc] overflow-hidden">
      
      {/*The Persistent Sidebar */}
      <Sidebar />

      {/*The Dynamic Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
      
    </div>
  )
}

export default VehicleAdmin