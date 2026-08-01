// // import React from 'react';
// // import Header from './Header';
// // import Footer from './Footer';
// // import logoText from '../assets/name.png';

// // const AuthLayout = ({ children, rightImage }) => {
// //   return (
// //     <div className="min-h-screen flex flex-col relative bg-[#f4f8fc] overflow-hidden">
// //       {/* Background Graphic - Dotted lines representing plane path */}
// //       <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
// //         <path d="M 100,200 Q 300,50 500,250 T 900,100" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
// //         <path d="M 500,100 Q 800,300 1100,50" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
// //       </svg>
      
// //       <Header />
      
// //       <main className="flex-grow flex flex-col lg:flex-row relative z-10 pt-24 pb-16">
// //         {/* Left Side */}
// //         <div className="w-full lg:w-[45%] flex flex-col items-center justify-center px-8 lg:px-16 xl:px-24">
// //           <div className="w-full max-w-md">
// //             <div className="mb-8 pl-4 lg:pl-0">
// //               <h1 className="auth-heading">Welcome <span>Traveler</span></h1>
// //             {/* Logo Name Text Image - Increased from h-8 to h-12 */}
// //             <div>
// //                           <img 
// //                             src={logoText} 
// //                             alt="Smart Virtual Tourism Guide Sri Lanka" 
// //                             className="h-12 w-auto object-contain"
// //                           />
// //                         </div>
// //               <p className="text-gray-500 text-sm">Login to explore Sri Lanka with your smart virtual guide</p>
// //             </div>
            
// //             {/* The Form Content Wrapper */}
// //             <div className="w-full">
// //               {children}
// //             </div>
// //           </div>
// //         </div>
        
// //         {/* Right Side */}
// //         <div className="hidden lg:block w-[55%] relative">
// //           <div className="absolute inset-0 right-0 top-0 bottom-0 overflow-hidden">
// //              {/* We use a mask image or rounded corner for the image container to match the design's curved left edge */}
// //              <div className="absolute inset-0 bg-cover bg-center rounded-l-[80px] overflow-hidden shadow-2xl" 
// //                   style={{ backgroundImage: `url(${rightImage})` }}>
// //              </div>
// //           </div>
// //         </div>
// //       </main>

// //       <Footer />
// //     </div>
// //   );
// // };

// // export default AuthLayout;

// import React from 'react';
// import Header from './Header';
// import Footer from './Footer';
// import logoText from '../assets/name.png';

// const AuthLayout = ({ children, rightImage, leftImage }) => {
//   return (
//     <div className="min-h-screen flex flex-col relative bg-[#f4f8fc] overflow-hidden">

//       {/* Plane Path Background */}
//       <svg
//         className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <path
//           d="M 300,180 Q 500,20 700,240 T 1200,100"
//           fill="none"
//           stroke="#38bdf8"
//           strokeWidth="2"
//           strokeDasharray="10,10"
//           opacity="0.5"
//         />

//         <path
//           d="M 700,100 Q 900,300 1200,80"
//           fill="none"
//           stroke="#38bdf8"
//           strokeWidth="2"
//           strokeDasharray="10,10"
//           opacity="0.5"
//         />
//       </svg>

//       {/* Header */}
//       <Header />

//       {/* MAIN SECTION */}
//      <main className="relative min-h-[1100px] pt-24 overflow-hidden">

//  {/* LEFT BACKGROUND IMAGE */}
// <div
//   className="
//     absolute
//     left-0
//     top-0
//     w-full
//     h-full
//     bg-no-repeat
//     bg-left-top
//     z-0
//   "
//   style={{
//     backgroundImage: `url(${leftImage})`,
//     backgroundSize: 'cover',
//   }}
// ></div>

// {/* RIGHT MAIN IMAGE */}
// <div
//   className="
//     absolute
//     right-0
//     top-0
//     w-[55%]
//     h-full
//     bg-no-repeat
//     bg-right-top
//     z-10
//   "
//   style={{
//     backgroundImage: `url(${rightImage})`,
//     backgroundSize: 'cover',
//   }}
// ></div>

//   {/* CONTENT AREA */}
//   <div className="relative z-20 flex flex-col lg:flex-row h-full">

//     {/* LEFT CONTENT */}
//     <div className="w-full lg:w-[45%] px-8 lg:px-16 pt-16">

//       {/* Welcome Text */}
//       <div className="mb-8">
//         <h1 className="text-[58px] font-bold leading-tight text-[#111]">
//           Welcome <span className="text-[#27b6ff]">Traveler</span>
//         </h1>

//         <div className="mt-3">
//           <img
//             src={logoText}
//             alt="logo"
//             className="h-14 object-contain"
//           />
//         </div>

//         <p className="text-gray-500 mt-3">
//           Login to explore Sri Lanka with your smart virtual guide
//         </p>
//       </div>

//       {/* LOGIN CARD */}
//       <div className="max-w-[650px]">
//         {children}
//       </div>
//     </div>

//   </div>

// </main>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// };

// export default AuthLayout;

// AuthLayout.jsx

// import React from 'react';
// import Header from './Header';
// import Footer from './Footer';
// import logoText from '../assets/name.png';

// const AuthLayout = ({ children, rightImage, leftImage }) => {
//   return (
//     <div className="min-h-screen flex flex-col relative bg-[#f4f8fc] overflow-hidden">

//       {/* Plane Path Background */}
//       {/* <svg
//         className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <path
//           d="M 300,180 Q 500,20 700,240 T 1200,100"
//           fill="none"
//           stroke="#38bdf8"
//           strokeWidth="2"
//           strokeDasharray="10,10"
//           opacity="0.5"
//         />

//         <path
//           d="M 700,100 Q 900,300 1200,80"
//           fill="none"
//           stroke="#38bdf8"
//           strokeWidth="2"
//           strokeDasharray="10,10"
//           opacity="0.5"
//         />
//       </svg> */}

//       {/* Header */}
//       <Header />

//       {/* MAIN SECTION */}
//       <main className="relative min-h-[1200px] pt-1 overflow-hidden">

//         {/* LEFT BACKGROUND IMAGE */}
//         <div
//           className="
//             absolute
//             left-0
//             top-0
//             w-full
//             h-full
//             bg-no-repeat
//             bg-left-top
//             z-0
//           "
//           style={{
//             backgroundImage: `url(${leftImage})`,
//             backgroundSize: 'cover',
//           }}
//         ></div>

//         {/* RIGHT MAIN IMAGE */}
//         <div
//           className="
//             absolute
//             right-0
//             top-0
//             w-[60%]
//             h-full
//             bg-no-repeat
//             bg-right-top
//             z-10
//           "
//           style={{
//             backgroundImage: `url(${rightImage})`,
//             backgroundSize: 'cover',
//           }}
//         ></div>

//         {/* CONTENT AREA */}
//         <div className="relative z-20 flex h-full">

//           {/* LEFT CONTENT */}
//           <div className="w-full lg:w-[45%] px-6 lg:px-12 pt-12">

//             {/* Welcome Text */}
//             <div className="mb-6">

//               <h1 className="text-[48px] font-bold leading-tight text-[#111]">
//                 Welcome <span className="text-[#27b6ff]">Traveler</span>
//               </h1>

//               <div className="mt-2">
//                 <img
//                   src={logoText}
//                   alt="logo"
//                   className="h-12 object-contain"
//                 />
//               </div>

//               <p className="text-gray-500 mt-2 text-sm">
//                 Login to explore Sri Lanka with your smart virtual guide
//               </p>
//             </div>

//             {/* LOGIN CARD */}
//             <div className="w-full max-w-[950px]">
//               {children}
//             </div>

//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// };

// export default AuthLayout;

import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import logoText from '../../assets/Tourist/name.png';

const AuthLayout = ({
  children,
  leftImage,
  rightImage,
  leftConfig = {},
  rightConfig = {},
}) => {

const leftStyle = {
  backgroundImage: leftImage ? `url(${leftImage})` : 'none',
  backgroundSize: leftConfig.size || 'cover',
  backgroundPosition: leftConfig.position || 'left top',
  opacity: leftConfig.opacity ?? 1,
  zIndex: leftConfig.zIndex ?? 20,
  filter: leftConfig.blur ? `blur(${leftConfig.blur}px)` : 'none',
  display: leftImage ? 'block' : 'none',
};

const rightStyle = {
  backgroundImage: rightImage ? `url(${rightImage})` : 'none',
  backgroundSize: rightConfig.size || 'cover',
  backgroundPosition: rightConfig.position || 'right top',
  opacity: rightConfig.opacity ?? 1,
  zIndex: rightConfig.zIndex ?? 0,
  filter: rightConfig.blur ? `blur(${rightConfig.blur}px)` : 'none',
  display: rightImage ? 'block' : 'none',
};

  return (
    <div className="min-h-screen flex flex-col relative bg-[#f4f8fc] overflow-hidden">

      <Header />

      <main className="relative min-h-[1200px] pt-1 overflow-hidden">

        {/* LEFT IMAGE */}
        <div
          className="absolute left-0 top-0 h-full bg-no-repeat"

          style={{
            ...leftStyle,
            width: leftConfig.width || '100%',
          }}
        />

        {/* RIGHT IMAGE */}
        <div
          className="absolute right-0 top-0 h-full bg-no-repeat"
          style={{
            ...rightStyle,
            width: rightConfig.width || '60%',
          }}
        />

        {/* CONTENT */}
        <div className="relative z-20 flex h-full">

          <div className="w-full lg:w-[45%] px-6 lg:px-12 pt-12">

            <div className="mb-6">
              <h1 className="text-[48px] font-bold leading-tight text-[#111]">
                Welcome <span className="text-[#27b6ff]">Hotel Owner</span>
              </h1>

              <div className="mt-2">
                <img src={logoText} alt="logo" className="h-12 object-contain" />
              </div>

              <p className="text-gray-500 mt-2 text-sm">
                Login to explore Sri Lanka with your smart virtual guide
              </p>
            </div>

            <div className="w-full max-w-[950px]">
              {children}
            </div>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default AuthLayout;