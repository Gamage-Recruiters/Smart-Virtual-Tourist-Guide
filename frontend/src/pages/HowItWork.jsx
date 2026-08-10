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

const SriLankaTourismPage = () => {
  return (
    <div className="font-sans text-gray-800 bg-white overflow-x-hidden relative">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[500px] flex flex-col items-center justify-center text-center px-4 pt-16 pb-24 bg-gradient-to-b from-[#dbeefe] to-[#b3daf5]">
        {/* Background Image Overlay - simulating the landscape */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1596464716129-3f2bfd1e5d79?q=80&w=2000&auto=format&fit=crop" 
            alt="Sri Lanka Landscape" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          {/* Gradient overlay to match the light blue sky feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB]/80 via-transparent to-white/90"></div>
        </div>

        <div className="relative z-10 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-[#00a8ff] mb-4">How it Works</h1>
          <p className="text-lg md:text-xl text-gray-700 font-medium">
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
                <div className="bg-white p-2 rounded-full"><User className="w-8 h-8 text-[#00838f]" /></div>
              </div>
              <h3 className="font-semibold text-sm mt-1">Create Account</h3>
              <p className="text-xs text-gray-500 px-2">Sign up or log in to access all features.</p>
              <div className="text-2xl font-bold text-gray-300 mt-2">1</div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] rounded-full flex items-center justify-center shadow-md mb-3 relative z-10">
                <div className="bg-white p-2 rounded-full"><MapPin className="w-8 h-8 text-[#00838f]" /></div>
              </div>
              <h3 className="font-semibold text-sm mt-1">Choose Destination</h3>
              <p className="text-xs text-gray-500 px-2">Select places you want to visit in Sri Lanka.</p>
              <div className="text-2xl font-bold text-gray-300 mt-2">2</div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] rounded-full flex items-center justify-center shadow-md mb-3 relative z-10">
                <div className="bg-white p-2 rounded-full"><ClipboardList className="w-8 h-8 text-[#00838f]" /></div>
              </div>
              <h3 className="font-semibold text-sm mt-1">Plan Your Trip</h3>
              <p className="text-xs text-gray-500 px-2">Set dates, routes & preferred activities.</p>
              <div className="text-2xl font-bold text-gray-300 mt-2">3</div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] rounded-full flex items-center justify-center shadow-md mb-3 relative z-10">
                <div className="bg-white p-2 rounded-full"><Lightbulb className="w-8 h-8 text-[#00838f]" /></div>
              </div>
              <h3 className="font-semibold text-sm mt-1">Get Suggestions</h3>
              <p className="text-xs text-gray-500 px-2">Receive smart hotels, food & place recommendations.</p>
              <div className="text-2xl font-bold text-gray-300 mt-2">4</div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] rounded-full flex items-center justify-center shadow-md mb-3 relative z-10">
                <div className="bg-white p-2 rounded-full"><Compass className="w-8 h-8 text-[#00838f]" /></div>
              </div>
              <h3 className="font-semibold text-sm mt-1">Start Exploring</h3>
              <p className="text-xs text-gray-500 px-2">Follow your guide & enjoy the journey!</p>
              <div className="text-2xl font-bold text-gray-300 mt-2">5</div>
            </div>
          </div>
        </div>
      </section>

      {/* APP SHOWCASE SECTION */}
      <section className="relative py-20 bg-gradient-to-b from-white to-[#f0f8ff] overflow-hidden">
        {/* Background dashed line */}
        <div className="absolute bottom-10 right-0 w-full h-full pointer-events-none opacity-20">
            <svg className="absolute bottom-20 right-10 w-[300px] h-[200px]" viewBox="0 0 300 200">
                <path d="M250,20 C180,80 200,180 100,150 C50,130 20,80 10,40" fill="none" stroke="#00a8ff" strokeWidth="2" strokeDasharray="10,10"/>
                <polygon points="10,40 0,45 15,35" fill="#00a8ff"/>
            </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-10">
          
          {/* Mockup Images - Left */}
          <div className="relative w-full md:w-1/2 flex justify-center md:justify-start">
            {/* Laptop Frame */}
            <div className="relative w-[80%] max-w-md bg-white rounded-xl shadow-2xl p-2 pb-8 border border-gray-200 transform rotate-[-2deg]">
                <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                     {/* Simulated laptop screen content */}
                     <div className="w-full h-full bg-blue-50 p-4 flex flex-col items-center justify-center">
                        <h3 className="text-blue-600 font-bold text-lg mb-2">Explore Sri Lanka Smartly</h3>
                        <div className="w-full h-2/3 bg-white rounded shadow-sm p-2 flex flex-col gap-2">
                            <div className="h-2 w-1/2 bg-blue-200 rounded"></div>
                            <div className="h-2 w-3/4 bg-gray-200 rounded"></div>
                            <div className="h-2 w-1/3 bg-gray-200 rounded"></div>
                            <div className="mt-auto flex justify-center"><button className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">Start</button></div>
                        </div>
                     </div>
                </div>
                {/* Laptop base */}
                <div className="absolute bottom-[-15px] left-1/2 transform -translate-x-1/2 w-1/3 h-4 bg-gray-300 rounded-b-lg"></div>
            </div>

            {/* Mobile Frame behind laptop */}
            <div className="absolute left-0 bottom-[-20px] w-[100px] h-[200px] bg-white rounded-3xl shadow-xl border-4 border-gray-100 transform rotate-[-10deg] z-[-1] overflow-hidden">
                 <div className="w-full h-full bg-blue-50 p-1 flex flex-col items-center pt-4">
                    <div className="w-4 h-1 bg-gray-300 rounded-full mb-2"></div>
                    <div className="w-full h-4 bg-white rounded mb-1"></div>
                    <div className="w-full h-4 bg-white rounded"></div>
                 </div>
            </div>
          </div>

          {/* Content - Right */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Smart Travel Planning
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Our platform provides a seamless experience across web and mobile to guide you through Sri Lanka effortlessly.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="bg-[#d2f4ea] px-6 py-3 rounded-full flex items-center gap-3 shadow-sm">
                <RefreshCw className="w-5 h-5 text-[#00bfa5]" />
                <span className="font-medium text-sm text-gray-800">Real Time Updates</span>
              </div>
              <div className="bg-[#e8f5e9] px-6 py-3 rounded-full flex items-center gap-3 shadow-sm">
                <Navigation className="w-5 h-5 text-[#ff7043]" />
                <span className="font-medium text-sm text-gray-800">GPS Navigation</span>
              </div>
              <div className="bg-[#c8e6c9] px-6 py-3 rounded-full flex items-center gap-3 shadow-sm">
                <WifiOff className="w-5 h-5 text-[#00bfa5]" />
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
            {/* Card 1 */}
            <div className="border border-green-200 rounded-lg p-6 flex items-start gap-4 shadow-sm bg-white">
              <CheckCircle className="w-8 h-8 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-800">Routing Planning</h3>
                <p className="text-sm text-gray-500">Plan trips in minutes</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="border border-blue-200 rounded-lg p-6 flex items-start gap-4 shadow-sm bg-white">
              <div className="bg-blue-500 text-white p-1 rounded-full mt-1 flex-shrink-0">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">AI Powered</h3>
                <p className="text-sm text-gray-500">Smart Recommendations</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="border border-red-200 rounded-lg p-6 flex items-start gap-4 shadow-sm bg-white">
              <Clock className="w-8 h-8 text-red-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-800">Time Saved</h3>
                <p className="text-sm text-gray-500">No more research hassle</p>
              </div>
            </div>
          </div>

          {/* Bottom Centered Card */}
          <div className="flex justify-center">
             <div className="border border-gray-200 rounded-lg p-6 flex items-start gap-4 shadow-sm bg-white w-full max-w-md">
              <Smartphone className="w-8 h-8 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-800">All Device</h3>
                <p className="text-sm text-gray-500">Mobile,Tablet,Web</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default SriLankaTourismPage;