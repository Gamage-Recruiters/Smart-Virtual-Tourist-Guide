import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ActivityProviderDashboard from './pages/ActivityProvider/ActivityProviderDashboard.jsx';
import ActivityList from './pages/ActivityProvider/ActivityList.jsx';
import Activity from './pages/ActivityProvider/AddActivity.jsx';
import ManageCalendar from './pages/ActivityProvider/ManageCalendar.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" />
        <Route path="/activityprovider/activities" element={<ActivityList />} />
        <Route path="/activityprovider/activities/new" element={<Activity />} />
        <Route path="/activityprovider/activities/edit/:id" element={<Activity />} />
        <Route path="/activityprovider/dashboard" element={<ActivityProviderDashboard />} />
        <Route path="/activityprovider/calendar" element={<ManageCalendar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;