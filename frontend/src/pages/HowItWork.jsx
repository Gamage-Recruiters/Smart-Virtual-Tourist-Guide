import React from 'react';
import { 
  User, 
  MapPin, 
  ClipboardList, 
  Lightbulb, 
  Compass, 
  CheckCircle, 
  Clock, 
  Cpu, 
  Smartphone, 
  RefreshCw, 
  Navigation,
  WifiOff
} from 'lucide-react';

// Import your hero background image from assets
import heroBackground from '../assets/LandingPage/HIW1.png'; // Adjust the path as needed

// Import step icons from assets
import step1Icon from '../assets/LandingPage/HIW2.png'; // Create Account icon
import step2Icon from '../assets/LandingPage/HIW3.png'; // Choose Destination icon
import step3Icon from '../assets/LandingPage/HIW4.png'; // Plan Your Trip icon
import step4Icon from '../assets/LandingPage/HIW5.png'; // Get Suggestions icon
import step5Icon from '../assets/LandingPage/HIW6.png'; // Start Exploring icon

// Import App showcase background image from assets
import appShowcaseBg from '../assets/LandingPage/HIW7.png'; // App showcase background image

// Import App showcase mockup image (combined laptop and mobile) - without background frame
import appMockup from '../assets/LandingPage/HIW8.png'; // Combined laptop and mobile mockup image

// Import feature icons for App showcase content
import realTimeIcon from '../assets/LandingPage/HIW9.png'; // Real Time Updates icon
import gpsIcon from '../assets/LandingPage/HIW10.png'; // GPS Navigation icon
import offlineIcon from '../assets/LandingPage/HIW11.png'; // Offline Access icon

// Import feature icons for Features section
import routingIcon from '../assets/LandingPage/HIW12.png'; // Routing Planning icon
import aiIcon from '../assets/LandingPage/HIW13.png'; // AI Powered icon
import timeIcon from '../assets/LandingPage/HIW14.png'; // Time Saved icon
import deviceIcon from '../assets/LandingPage/HIW15.png'; // All Device icon

const SriLankaTourismPage = () => {
  return (
    <div className="font-sans text-gray-800 bg-white overflow-x-hidden relative">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[500px] flex flex-col items-center justify-center text-center px-4 pt-16 pb-24">
        {/* Background Image - full coverage with subtle blur */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBackground}
            alt="Sri Lanka Landscape" 
            className="w-full h-full object-cover blur-[2px]"
          />
          {/* Lighter gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB]/60 via-transparent to-white/70"></div>
        </div>

        <div className="relative z-10 max-w-4xl">
          {/* Topic - Orange color with black drop shadow */}
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4" 
            style={{ 
              color: '#FF6B00',
              textShadow: '0 4px 12px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6), 0 6px 16px rgba(0,0,0,0.4)'
            }}
          >
            How it Works
          </h1>
          
          {/* Sub Topic - Black color with white drop shadow */}
          <p 
            className="text-lg md:text-xl font-bold" 
            style={{ 
              color: '#000000',
              textShadow: '0 2px 8px rgba(255,255,255,0.9), 0 4px 12px rgba(255,255,255,0.7), 0 1px 4px rgba(255,255,255,0.5)'
            }}
          >
            Plan your journey in Sri Lanka easily with our Smart Virtual Tourist Guide<br />
            In just a few simple steps.
          </p>
        </div>
      </section>

      {/* STEPS SECTION */}
      <section className="relative py-16 bg-white/90">
        {/* Decorative dashed lines background */}
        <div className="absolute top-10 right-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
            <svg className="absolute top-10 right-0 w-[400px] h-[200px]" viewBox="0 0 400 200">
                <path d="M380,20 C300,50 250,180 180,160 C100,140 150,40 50,80" fill="none" stroke="black" strokeWidth="2" strokeDasharray="8,8"/>
                <polygon points="380,20 385,10 395,25" fill="black" transform="rotate(-45 380 20)"/>
            </svg>
            <svg className="absolute bottom-20 right-10 w-[200px] h-[150px]" viewBox="0 0 200 150">
                <path d="M150,20 C100,40 80,120 30,100" fill="none" stroke="black" strokeWidth="2" strokeDasharray="8,8"/>
                <polygon points="30,100 20,105 25,95" fill="black"/>
            </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-semibold mb-12 inline-block relative">
            Follow These <span className="text-[#00a8ff] font-bold">Simple Steps</span>
            <div className="absolute bottom-[-8px] left-0 w-1/3 h-1 bg-blue-400"></div>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start mt-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] rounded-full flex items-center justify-center shadow-md mb-3 relative z-10">
                <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center overflow-hidden">
                  <img 
                    src={step1Icon} 
                    alt="Create Account" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-sm mt-1">Create Account</h3>
              <p className="text-xs text-gray-500 px-2">Sign up or log in to access all features.</p>
              <div className="text-2xl font-bold text-gray-300 mt-2">1</div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] rounded-full flex items-center justify-center shadow-md mb-3 relative z-10">
                <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center overflow-hidden">
                  <img 
                    src={step2Icon} 
                    alt="Choose Destination" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-sm mt-1">Choose Destination</h3>
              <p className="text-xs text-gray-500 px-2">Select places you want to visit in Sri Lanka.</p>
              <div className="text-2xl font-bold text-gray-300 mt-2">2</div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] rounded-full flex items-center justify-center shadow-md mb-3 relative z-10">
                <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center overflow-hidden">
                  <img 
                    src={step3Icon} 
                    alt="Plan Your Trip" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-sm mt-1">Plan Your Trip</h3>
              <p className="text-xs text-gray-500 px-2">Set dates, routes & preferred activities.</p>
              <div className="text-2xl font-bold text-gray-300 mt-2">3</div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] rounded-full flex items-center justify-center shadow-md mb-3 relative z-10">
                <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center overflow-hidden">
                  <img 
                    src={step4Icon} 
                    alt="Get Suggestions" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-sm mt-1">Get Suggestions</h3>
              <p className="text-xs text-gray-500 px-2">Receive smart hotels, food & place recommendations.</p>
              <div className="text-2xl font-bold text-gray-300 mt-2">4</div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] rounded-full flex items-center justify-center shadow-md mb-3 relative z-10">
                <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center overflow-hidden">
                  <img 
                    src={step5Icon} 
                    alt="Start Exploring" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-sm mt-1">Start Exploring</h3>
              <p className="text-xs text-gray-500 px-2">Follow your guide & enjoy the journey!</p>
              <div className="text-2xl font-bold text-gray-300 mt-2">5</div>
            </div>
          </div>
        </div>
      </section>

      {/* APP SHOWCASE SECTION */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={appShowcaseBg}
            alt="App Showcase Background" 
            className="w-full h-full object-cover"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent"></div>
        </div>

        {/* Background dashed line */}
        <div className="absolute bottom-10 right-0 w-full h-full pointer-events-none opacity-20 z-10">
            <svg className="absolute bottom-20 right-10 w-[300px] h-[200px]" viewBox="0 0 300 200">
                <path d="M250,20 C180,80 200,180 100,150 C50,130 20,80 10,40" fill="none" stroke="#00a8ff" strokeWidth="2" strokeDasharray="10,10"/>
                <polygon points="10,40 0,45 15,35" fill="#00a8ff"/>
            </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-20">
          
          {/* Mockup Image - Left - Without background frame */}
          <div className="relative w-full md:w-1/2 flex justify-center md:justify-start">
            <div className="relative w-[80%] max-w-md">
              <img 
                src={appMockup}
                alt="App Showcase Mockup - Laptop and Mobile" 
                className="w-full h-auto object-contain transform hover:scale-105 transition-transform duration-300"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
              />
            </div>
          </div>

          {/* Content - Right */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Smart Travel Planning
            </h2>
            <p className="text-gray-700 mb-8 text-lg font-medium">
              Our platform provides a seamless experience across web and mobile to guide you through Sri Lanka effortlessly.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {/* Real Time Updates */}
              <div className="bg-[#d2f4ea] px-6 py-3 rounded-full flex items-center gap-3 shadow-sm backdrop-blur-sm">
                <img 
                  src={realTimeIcon}
                  alt="Real Time Updates" 
                  className="w-5 h-5 object-contain"
                />
                <span className="font-medium text-sm text-gray-800">Real Time Updates</span>
              </div>

              {/* GPS Navigation */}
              <div className="bg-[#e8f5e9] px-6 py-3 rounded-full flex items-center gap-3 shadow-sm backdrop-blur-sm">
                <img 
                  src={gpsIcon}
                  alt="GPS Navigation" 
                  className="w-5 h-5 object-contain"
                />
                <span className="font-medium text-sm text-gray-800">GPS Navigation</span>
              </div>

              {/* Offline Access */}
              <div className="bg-[#c8e6c9] px-6 py-3 rounded-full flex items-center gap-3 shadow-sm backdrop-blur-sm">
                <img 
                  src={offlineIcon}
                  alt="Offline Access" 
                  className="w-5 h-5 object-contain"
                />
                <span className="font-medium text-sm text-gray-800">Offline Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">What It's Easy & Effective</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Card 1 - Routing Planning */}
            <div className="border border-green-200 rounded-lg p-6 flex items-start gap-4 shadow-sm bg-white hover:shadow-lg transition-shadow duration-300">
              <img 
                src={routingIcon}
                alt="Routing Planning" 
                className="w-8 h-8 object-contain mt-1 flex-shrink-0"
              />
              <div>
                <h3 className="font-bold text-gray-800">Routing Planning</h3>
                <p className="text-sm text-gray-500">Plan trips in minutes</p>
              </div>
            </div>

            {/* Card 2 - AI Powered */}
            <div className="border border-blue-200 rounded-lg p-6 flex items-start gap-4 shadow-sm bg-white hover:shadow-lg transition-shadow duration-300">
              <img 
                src={aiIcon}
                alt="AI Powered" 
                className="w-8 h-8 object-contain mt-1 flex-shrink-0"
              />
              <div>
                <h3 className="font-bold text-gray-800">AI Powered</h3>
                <p className="text-sm text-gray-500">Smart Recommendations</p>
              </div>
            </div>

            {/* Card 3 - Time Saved */}
            <div className="border border-red-200 rounded-lg p-6 flex items-start gap-4 shadow-sm bg-white hover:shadow-lg transition-shadow duration-300">
              <img 
                src={timeIcon}
                alt="Time Saved" 
                className="w-8 h-8 object-contain mt-1 flex-shrink-0"
              />
              <div>
                <h3 className="font-bold text-gray-800">Time Saved</h3>
                <p className="text-sm text-gray-500">No more research hassle</p>
              </div>
            </div>
          </div>

          {/* Bottom Centered Card - All Device */}
          <div className="flex justify-center">
            <div className="border border-gray-200 rounded-lg p-6 flex items-start gap-4 shadow-sm bg-white w-full max-w-md hover:shadow-lg transition-shadow duration-300">
              <img 
                src={deviceIcon}
                alt="All Device" 
                className="w-8 h-8 object-contain mt-1 flex-shrink-0"
              />
              <div>
                <h3 className="font-bold text-gray-800">All Device</h3>
                <p className="text-sm text-gray-500">Mobile, Tablet, Web</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default SriLankaTourismPage;