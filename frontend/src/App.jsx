import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ActivityProviderDashboard from './pages/ActivityProvider/ActivityProviderDashboard.jsx';
import ActivityList from './pages/ActivityProvider/ActivityList.jsx';
import Activity from './pages/ActivityProvider/AddActivity.jsx';
import ManageCalendar from './pages/ActivityProvider/ManageCalendar.jsx';
import ViewRatings from './pages/ActivityProvider/ViewRatings.jsx';
import AcceptBookings from './pages/ActivityProvider/AcceptBookings.jsx';
import LoginScreen from './pages/Login/LoginScreen';
import ForgotPasswordScreen from './pages/Login/ForgotPasswordScreen';
import NewPasswordCreate from './pages/Login/NewPasswordCreate';
import ActivityProviderSignup from './pages/ActivityProvider/SignupPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/activity-provider" element={<ActivityProviderSignup />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/create-password" element={<NewPasswordCreate />} />

        {/* Protected Activity Provider Routes */}
        <Route
          path="/activityprovider/dashboard"
          element={
            <ProtectedRoute allowedRoles={['activityprovider_user']}>
              <ActivityProviderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-ActivityProvider"
          element={
            <ProtectedRoute allowedRoles={['activityprovider_user']}>
              <ActivityProviderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activityprovider/activities"
          element={
            <ProtectedRoute allowedRoles={['activityprovider_user']}>
              <ActivityList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activityprovider/activities/new"
          element={
            <ProtectedRoute allowedRoles={['activityprovider_user']}>
              <Activity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activityprovider/activities/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['activityprovider_user']}>
              <Activity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activityprovider/calendar"
          element={
            <ProtectedRoute allowedRoles={['activityprovider_user']}>
              <ManageCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activityprovider/viewratings"
          element={
            <ProtectedRoute allowedRoles={['activityprovider_user']}>
              <ViewRatings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activityprovider/acceptbookings"
          element={
            <ProtectedRoute allowedRoles={['activityprovider_user']}>
              <AcceptBookings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;