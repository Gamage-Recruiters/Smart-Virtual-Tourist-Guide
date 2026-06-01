import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RenterLoginPage } from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import VehicleAdmin from "./pages/vehicleAdminDashboard/vehicleAdminPage";
import Dashboard from "./pages/vehicleAdminDashboard/dashboard";
import RentalRequestsPage from "./pages/vehicleAdminDashboard/rentalRequestsPage";
import MyFleetPage from "./pages/vehicleAdminDashboard/myFleetPage";
import SettingsPage from "./pages/vehicleAdminDashboard/settingsPage";
import EarningsPage from "./pages/vehicleAdminDashboard/earningsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<RenterLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/vehicle-admin" element={<VehicleAdmin />}>
          <Route index element={<Dashboard/>} />
          <Route path="requests" element={<RentalRequestsPage/>} />
          <Route path="fleet" element={<MyFleetPage />} />
          <Route path="earnings" element={<EarningsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
