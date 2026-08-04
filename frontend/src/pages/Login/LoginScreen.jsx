// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import AuthLayout from '../components/AuthLayout';
// import loginImg from '../assets/loginImg.png';

// const LoginScreen = () => {
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <AuthLayout rightImage={loginImg}>
//       <div className="glass-card p-8 rounded-3xl w-full">
//         <h2 className="text-3xl font-normal text-gray-800 mb-6 border-b-2 border-blue-400 inline-block pb-1">Sign In</h2>

//         <form className="space-y-5">
//           <div>
//             <input 
//               type="text" 
//               placeholder="Username or email address" 
//               className="input-field bg-white"
//             />
//           </div>

//           <div className="relative">
//             <input 
//               type={showPassword ? "text" : "password"} 
//               placeholder="Password must be 8 characters" 
//               className="input-field bg-white pr-10"
//             />
//             <button 
//               type="button" 
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </button>
//           </div>

//           <div className="flex justify-start text-sm">
//             <Link to="/forgot-password" className="text-gray-500 hover:text-blue-500">Forget Password ?</Link>
//           </div>

//           <div className="flex items-center gap-2 mt-2">
//             <input type="checkbox" id="terms" className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500" />
//             <label htmlFor="terms" className="text-xs text-gray-500">
//               I've read and agree with your <a href="#" className="text-blue-400">Privacy Policy</a> and <a href="#" className="text-blue-400">Terms & Conditions</a>
//             </label>
//           </div>

//           <button type="submit" className="btn-primary mt-6">
//             Sign In <span className="ml-2">→</span>
//           </button>
//         </form>

//         <div className="flex gap-4 mt-6">
//           <button type="button" className="btn-outline flex-1 text-sm bg-white border border-gray-100">
//             <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
//             Sign up with google
//           </button>
//           <button type="button" className="btn-outline flex-1 text-sm bg-white border border-gray-100">
//             <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5" />
//             Sign up with Facebook
//           </button>
//         </div>

//         <div className="mt-8">
//           <p className="text-sm text-gray-500 mb-3">You Don't have an account yet?</p>
//           <button type="button" className="btn-primary bg-[#0066ff] hover:bg-blue-700 w-full">
//             Register For Free <span className="ml-2">→</span>
//           </button>
//         </div>
//       </div>
//     </AuthLayout>
//   );
// };

// export default LoginScreen;
// // // ----------------------
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';

// import AuthLayout from '../components/AuthLayout';
// import loginImg from '../assets/loginImg.png';
// import leftLoginImg from '../assets/commonImg.png';

// const LoginScreen = () => {
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <AuthLayout rightImage={loginImg} leftImage={leftLoginImg}>
// {/* LOGIN CARD */}
// <div
//   className="
//     glass-card
//     w-full
//     max-w-[520px]
//     min-h-[550px]
//     p-8 lg:p-10

//     bg-white/35
//     backdrop-blur-md
//     shadow-2xl
//     border border-white/20

//     rounded-tl-[20px]
//     rounded-tr-[120px]
//     rounded-br-[20px]
//     rounded-bl-[140px]

//     relative
//   "
// >

//         {/* Title */}
//         <h2 className="
//           text-5xl
//           font-normal
//           text-[#1b1b2f]
//           mb-10
//           border-b-2
//           border-blue-400
//           inline-block
//           pb-2
//         ">
//           Sign In
//         </h2>

//         {/* FORM */}
//         <form className="space-y-6">

//           {/* Username */}
//           <div>
//             <input
//               type="text"
//               placeholder="Username or email address"
//               className="
//                 w-full
//                 px-5
//                 py-4
//                 rounded-xl
//                 bg-white
//                 border
//                 border-gray-200
//                 outline-none
//                 text-gray-700
//               "
//             />
//           </div>

//           {/* Password */}
//           <div className="relative">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               placeholder="Password must be 8 characters"
//               className="
//                 w-full
//                 px-5
//                 py-4
//                 rounded-xl
//                 bg-white
//                 border
//                 border-gray-200
//                 outline-none
//                 text-gray-700
//                 pr-12
//               "
//             />

//             <button
//               type="button"
//               className="
//                 absolute
//                 right-4
//                 top-1/2
//                 -translate-y-1/2
//                 text-gray-400
//               "
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </button>
//           </div>

//           {/* Forgot Password */}
//           <div className="flex justify-start text-sm">
//             <Link
//               to="/forgot-password"
//               className="text-gray-500 hover:text-blue-500"
//             >
//               Forget Password ?
//             </Link>
//           </div>

//           {/* Checkbox */}
//           <div className="flex items-start gap-3 mt-2">
//             <input
//               type="checkbox"
//               id="terms"
//               className="mt-1 w-4 h-4"
//             />

//             <label
//               htmlFor="terms"
//               className="text-xs text-gray-500 leading-6"
//             >
//               I've read and agree with your{' '}
//               <a href="#" className="text-blue-400">
//                 Privacy Policy
//               </a>{' '}
//               and{' '}
//               <a href="#" className="text-blue-400">
//                 Terms & Conditions
//               </a>
//             </label>
//           </div>

//           {/* Sign In Button */}
//           <button
//             type="submit"
//             className="
//               w-full
//               py-4
//               rounded-xl
//               bg-gradient-to-r
//               from-sky-400
//               to-blue-500
//               text-white
//               text-xl
//               font-medium
//               hover:scale-[1.01]
//               duration-300
//               shadow-lg
//             "
//           >
//             Sign In →
//           </button>
//         </form>

//         {/* Social Buttons */}
//         <div className="flex gap-4 mt-8">

//           {/* Google */}
//           <button
//             type="button"
//             className="
//               flex-1
//               bg-white
//               border
//               border-gray-200
//               rounded-xl
//               py-4
//               flex
//               items-center
//               justify-center
//               gap-3
//               text-sm
//             "
//           >
//             <img
//               src="https://www.svgrepo.com/show/475656/google-color.svg"
//               alt="Google"
//               className="w-5 h-5"
//             />

//             Sign up with google
//           </button>

//           {/* Facebook */}
//           <button
//             type="button"
//             className="
//               flex-1
//               bg-white
//               border
//               border-gray-200
//               rounded-xl
//               py-4
//               flex
//               items-center
//               justify-center
//               gap-3
//               text-sm
//             "
//           >
//             <img
//               src="https://www.svgrepo.com/show/475647/facebook-color.svg"
//               alt="Facebook"
//               className="w-5 h-5"
//             />

//             Sign up with Facebook
//           </button>
//         </div>

//         {/* Register */}
//         <div className="mt-10">

//           <p className="text-sm text-gray-500 mb-4">
//             You Don't have an account yet?
//           </p>

//           <button
//             type="button"
//             className="
//               w-full
//               py-4
//               rounded-xl
//               bg-[#0066ff]
//               text-white
//               text-xl
//               font-medium
//               hover:bg-blue-700
//               duration-300
//               shadow-lg
//             "
//           >
//             Register For Free →
//           </button>
//         </div>
//       </div>
//     </AuthLayout>
//   );
// };

// export default LoginScreen;

// LoginScreen.jsx

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';

// import AuthLayout from '../components/AuthLayout';
// import loginImg from '../assets/loginImg.png';
// import leftLoginImg from '../assets/commonImg.png';

// const LoginScreen = () => {
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <AuthLayout
//       rightImage={loginImg}
//       leftImage={leftLoginImg}
//     >

//  {/* LOGIN CARD */}
// <div
//   className="
//     glass-card
//     w-full
//     max-w-[1000px]

//     p-20
//     pl-10



//     bg-white/30
//     backdrop-blur-md
//     shadow-2xl
//     border border-white/20

//     rounded-tl-[150px]
//     rounded-tr-[20px]
//     rounded-br-[200px]
//     rounded-bl-[20px]

//     relative
//   "
// >

//         {/* Title */}
//   <div className="flex justify-center mb-7">
//     <h2
//       className="
//         text-4xl
//         font-normal
//         text-[#1b1b2f]
//         border-b-2
//         border-blue-400
//         inline-block
//         pb-2
//       "
//     >
//       Sign In
//     </h2>
//   </div>

//         {/* FORM */}
//         <form className="space-y-4">

//           {/* Username */}
//           <div>
//             <input
//               type="text"
//               placeholder="Username or email address"
//               className="
//                 w-full
//                 px-5
//                 py-3.5
//                 rounded-xl
//                 bg-white
//                 border
//                 border-gray-200
//                 outline-none
//                 text-gray-700
//                 text-sm
//               "
//             />
//           </div>

//           {/* Password */}
//           <div className="relative">

//             <input
//               type={showPassword ? 'text' : 'password'}
//               placeholder="Password must be 8 characters"
//               className="
//                 w-full
//                 px-5
//                 py-3.5
//                 rounded-xl
//                 bg-white
//                 border
//                 border-gray-200
//                 outline-none
//                 text-gray-700
//                 text-sm
//                 pr-12
//               "
//             />

//             <button
//               type="button"
//               className="
//                 absolute
//                 right-4
//                 top-1/2
//                 -translate-y-1/2
//                 text-gray-400
//               "
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </button>

//           </div>

//           {/* Forgot Password */}
//           <div className="flex justify-start text-sm">
//             <Link
//               to="/forgot-password"
//               className="text-gray-500 hover:text-blue-500"
//             >
//               Forget Password ?
//             </Link>
//           </div>

//           {/* Checkbox */}
//           <div className="flex items-start gap-3 mt-2">

//             <input
//               type="checkbox"
//               id="terms"
//               className="mt-1 w-4 h-4"
//             />

//             <label
//               htmlFor="terms"
//               className="text-xs text-gray-500 leading-5"
//             >
//               I've read and agree with your{' '}
//               <a href="#" className="text-blue-400">
//                 Privacy Policy
//               </a>{' '}
//               and{' '}
//               <a href="#" className="text-blue-400">
//                 Terms & Conditions
//               </a>
//             </label>

//           </div>

//           {/* Sign In Button */}
//           <button
//             type="submit"
//             className="
//               w-full
//               py-3.5
//               rounded-xl
//               bg-gradient-to-r
//               from-sky-400
//               to-blue-500
//               text-white
//               text-lg
//               font-medium
//               hover:scale-[1.01]
//               duration-300
//               shadow-lg
//             "
//           >
//             Sign In →
//           </button>

//         </form>

//         {/* Social Buttons */}
//         <div className="flex gap-3 mt-6">

//           {/* Google */}
//           <button
//             type="button"
//             className="
//               flex-1
//               bg-white
//               border
//               border-gray-200
//               rounded-xl
//               py-3.5
//               flex
//               items-center
//               justify-center
//               gap-2
//               text-xs
//             "
//           >
//             <img
//               src="https://www.svgrepo.com/show/475656/google-color.svg"
//               alt="Google"
//               className="w-4 h-4"
//             />

//             Google
//           </button>

//           {/* Facebook */}
//           <button
//             type="button"
//             className="
//               flex-1
//               bg-white
//               border
//               border-gray-200
//               rounded-xl
//               py-3.5
//               flex
//               items-center
//               justify-center
//               gap-2
//               text-xs
//             "
//           >
//             <img
//               src="https://www.svgrepo.com/show/475647/facebook-color.svg"
//               alt="Facebook"
//               className="w-4 h-4"
//             />

//             Facebook
//           </button>

//         </div>

//         {/* Register */}
//         <div className="mt-6">

//           <p className="text-sm text-gray-500 mb-3">
//             You Don't have an account yet?
//           </p>

//           <button
//             type="button"
//             className="
//               w-full
//               py-3.5
//               rounded-xl
//               bg-[#0066ff]
//               text-white
//               text-lg
//               font-medium
//               hover:bg-blue-700
//               duration-300
//               shadow-lg
//             "
//           >
//             Register For Free →
//           </button>

//         </div>

//       </div>

//     </AuthLayout>
//   );
// };

// export default LoginScreen;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import AuthLayout from '../../components/Tourist/AuthLayout';
import loginImg from '../../assets/Tourist/loginImg.png';
import leftLoginImg from '../../assets/Tourist/commonImg.png';
import apiClient from '../../services/api';
import useGoogleAuth from '../../hooks/useGoogleAuth';

// Import social icons from assets (SVG files)
import googleIcon from '../../assets/HotelOwner/svg/google.svg';

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Google auth — role=null means backend uses existing user's role
  const { handleGoogleAuth, googleLoading, googleError } = useGoogleAuth(navigate, null);

  const getDashboardRoute = (role) => {
    switch (role) {
      case 'tourist_user': return '/dashboard-Tourist';
      case 'guide_user': return '/dashboard-Guide';
      case 'hotelowner_user': return '/dashboard-HotelOwner';
      case 'restaurant_user': return '/dashboard-Restaurant';
      case 'government_user': return '/dashboard-Government';
      case 'renter_user': return '/vehicle-admin';
      case 'driver_user': return '/dashboard-Driver';
      case 'activityprovider_user': return '/activityprovider/dashboard';
      case 'admin': return '/dashboard-Admin';


      default: return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // validation
    if (!identifier || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const data = await apiClient.post('/auth/login', {
        identifier,
        password,
      });

      // success login
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));

        // navigate to specific dashboard
        const route = getDashboardRoute(data.user.role);
        if (route) {
          navigate(route);
        } else {
          setError('Invalid user role configuration.');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <AuthLayout
      rightImage={loginImg}
      leftImage={leftLoginImg}
      rightConfig={{
        width: '60%',
        position: 'right top',
        size: 'cover',
        zIndex: 20,
      }}
      leftConfig={{
        width: '100%',
        position: 'left top',
        size: 'cover',
        zIndex: 0,
      }}
    >
      <div
        className="
          glass-card
          w-full
          max-w-[1000px]
          p-20
          pl-10
          bg-white/30
          backdrop-blur-md
          shadow-2xl
          border border-white/20
          rounded-tl-[150px]
          rounded-tr-[20px]
          rounded-br-[200px]
          rounded-bl-[20px]
          relative
        "
      >
        {/* Title */}
        <div className="flex justify-center mb-7">
          <h2 className="text-4xl font-normal text-black border-b-2 border-black inline-block pb-2">
            Sign In
          </h2>
        </div>

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleLogin}>
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Username or email address"
            className="w-full px-5 py-3.5 rounded-xl bg-white border border-gray-200 outline-none text-gray-700 text-sm"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password must be 8 characters"
              className="w-full px-5 py-3.5 rounded-xl bg-white border border-gray-200 outline-none text-gray-700 text-sm pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="text-sm">
            <Link to="/forgot-password" className="text-gray-500 hover:text-blue-500">
              Forget Password ?
            </Link>
          </div>

          <div className="flex items-start gap-3 mt-2">
            <input type="checkbox" id="terms" className="mt-1 w-4 h-4" />
            <label htmlFor="terms" className="text-xs text-gray-500 leading-5">
              I've read and agree with{' '}
              <span className="text-blue-400">Privacy Policy</span> and{' '}
              <span className="text-blue-400">Terms & Conditions</span>
            </label>
          </div>

          <button type="submit" className="btn-primary py-3 w-full text-lg">
            Sign In →
          </button>
        </form>

         {/* Social Sign In */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 mb-3">Sign in With</p>
            {googleError && (
              <div className="text-red-500 text-xs text-center mb-2 bg-red-50 p-1 rounded">
                {googleError}
              </div>
            )}
            <div className="flex justify-center gap-6">
              <div
                className={`cursor-pointer hover:bg-gray-100 p-2 rounded-full transition ${googleLoading ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={handleGoogleAuth}
                title="Sign in with Google"
              >
                <img src={googleIcon} alt="Google" className="w-6 h-6 object-contain" />
              </div>
            </div>
          </div>

        {/* REGISTER */}
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-3">
            You Don't have an account yet?
          </p>

          <div className="flex flex-wrap gap-2">
            <Link to="/tourist" className="flex-1 btn-primary bg-[#0066ff] hover:bg-blue-700 py-3 text-center text-sm">
              Tourist Register
            </Link>
            <Link to="/guide" className="flex-1 btn-primary bg-green-600 hover:bg-green-700 py-3 text-center text-sm">
              Guide Register
            </Link>
            <Link to="/hotel-owner" className="flex-1 btn-primary bg-orange-600 hover:bg-orange-700 py-3 text-center text-sm">
              Hotel Owner Register
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Link to="/restuarant" className="flex-1 btn-primary bg-purple-600 hover:bg-purple-700 py-3 text-center text-sm">
              Restaurant Register
            </Link>
            <Link to="/renter" className="flex-1 btn-primary bg-teal-600 hover:bg-teal-700 py-3 text-center text-sm">
              Renter Register
            </Link>
            <Link to="/government" className="flex-1 btn-primary bg-indigo-600 hover:bg-indigo-700 py-3 text-center text-sm">
              Government Register
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Link to="/driver-signup1" className="flex-1 btn-primary bg-yellow-600 hover:bg-yellow-700 py-3 text-center text-sm">
              Driver Register
            </Link>
            <Link to="/activity-provider" className="flex-1 btn-primary bg-rose-600 hover:bg-rose-700 py-3 text-center text-sm">
              Activity Provider Register
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginScreen;