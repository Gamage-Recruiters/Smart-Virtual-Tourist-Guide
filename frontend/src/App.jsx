import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignupForm from './pages/Tourist/SignupForm1';
import TravelSafetyInfo from './pages/Tourist/SignupForm2';
import LoginScreen from './pages/Login/LoginScreen';
import ForgotPasswordScreen from './pages/Login/ForgotPasswordScreen';
import NewPasswordCreate from './pages/Login/NewPasswordCreate';

import HotelOwnerSignup from './pages/HotelOwner/SignUp';
import HotelInfo from './pages/HotelOwner/HotelInfo';

import RestuarantSignup from './pages/Restuarant/SignupPage';

import GuideSignup from './pages/Guide/SignupPage';

import RenterSignup from './pages/Renter/SignupPage';

import GovernmentSignup from './pages/Government/SignupPage';

import AdminLogin from './pages/Admin/LoginPage';

import DriverSignUp1 from './pages/Driver/SignUpForm1';
import DriverSignUp2 from './pages/Driver/SignUpForm2';
import DriverSignUp3 from './pages/Driver/SignUpForm3';
import DriverSignUp4 from './pages/Driver/SignUpForm4';



import DummyPageTourist from './pages/Tourist/dummyPage';
import DummyPageHotelOwner from './pages/HotelOwner/dummyPage';
import DummyPageRestaurant from './pages/Restuarant/dummyPage';
import DummyPageGuide from './pages/Guide/dummyPage';
import DummyPageRenter from './pages/Renter/dummyPage';
import DummyPageGovernment from './pages/Government/dummyPage';
import DummyPageDriver from './pages/Driver/dummyPage';
import DummyPageAdmin from './pages/Admin/dummyPage';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/tourist" element={<SignupForm />} />
        <Route path="/travel-safety" element={<TravelSafetyInfo />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/create-password" element={<NewPasswordCreate />} />

        <Route path="/hotel-owner" element={<HotelOwnerSignup/>}/>
        <Route path="/hotel-info" element={<HotelInfo/>}/>

        <Route path="/restuarant" element={<RestuarantSignup/>}/>

        <Route path="/guide" element={<GuideSignup/>}/>

        <Route path="/renter" element={<RenterSignup/>}/>

        <Route path="/government" element={<GovernmentSignup/>}/>

        <Route path="/admin" element={<AdminLogin/>}/>

        <Route path="/driver-signup1" element={<DriverSignUp1/>}/>
        <Route path="/driver-signup2" element={<DriverSignUp2/>}/>
        <Route path="/driver-signup3" element={<DriverSignUp3/>}/>
        <Route path="/driver-signup4" element={<DriverSignUp4/>}/>



        <Route path="/dashboard-Tourist" element={<DummyPageTourist/>}/>
        <Route path="/dashboard-HotelOwner" element={<DummyPageHotelOwner/>}/>
        <Route path="/dashboard-Restaurant" element={<DummyPageRestaurant/>}/>
        <Route path="/dashboard-Guide" element={<DummyPageGuide/>}/>
        <Route path="/dashboard-Renter" element={<DummyPageRenter/>}/>
        <Route path="/dashboard-Government" element={<DummyPageGovernment/>}/>
        <Route path="/dashboard-Driver" element={<DummyPageDriver/>}/>
        <Route path="/dashboard-Admin" element={<DummyPageAdmin/>}/>






        

      </Routes>
    </BrowserRouter>
  );
}

export default App;
