import React, { useState } from 'react';

const ProfilePage = () => {
  const [budgetRange, setBudgetRange] = useState(50);

  // Styles for the blurred decorative background circles
  const backgroundBlobs = (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] opacity-50"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F9FF] font-sans text-slate-800 relative overflow-x-hidden">
      {backgroundBlobs}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Create Your Profile</h1>
              <p className="text-slate-500 mt-2 max-w-lg">
                Tell us about yourself and your travel preferences to get personalized recommendations for your upcoming trips.
              </p>
            </div>

            <form className="space-y-8">
              {/* Section 01: Personal Details */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-sm font-medium text-blue-600">01.</span>
                  <span className="text-sm font-medium text-slate-700">Personal Details</span>
                  <div className="h-[1px] flex-1 bg-slate-200 ml-2"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="sr-only">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="Full Name" 
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="sr-only">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="Email Address" 
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="sr-only">Password</label>
                      <div className="relative">
                        <input 
                          type="password" 
                          placeholder="Password" 
                          className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                        <button type="button" className="absolute right-3 top-3 text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <select className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                          <option>Country</option>
                          <option>USA</option>
                          <option>UK</option>
                          <option>India</option>
                          <option>Australia</option>
                        </select>
                      </div>
                      <div>
                        <input 
                          type="text" 
                          placeholder="Passport Number" 
                          className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 02: Trip Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-sm font-medium text-blue-600">02.</span>
                  <span className="text-sm font-medium text-slate-700">Trip Information</span>
                  <div className="h-[1px] flex-1 bg-slate-200 ml-2"></div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="sr-only">Start Date</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => e.target.type = 'text'}
                          placeholder="Start Date" 
                          className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                        <div className="absolute right-3 top-3 text-slate-400 pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="sr-only">End Date</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => e.target.type = 'text'}
                          placeholder="End Date" 
                          className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                        <div className="absolute right-3 top-3 text-slate-400 pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-600 font-medium">Budget Range</span>
                    </div>
                    <div className="mb-2 flex justify-between text-xs text-slate-400">
                      <span>$5,000</span>
                      <span className="text-blue-600 font-medium">${(budgetRange * 100).toLocaleString()}</span>
                      <span>$10,000</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={budgetRange} 
                      onChange={(e) => setBudgetRange(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-600 font-medium mb-3">Travel Preferences</label>
                    <div className="flex flex-wrap gap-2">
                      {['Adventure', 'Cultural', 'Relaxation', 'Food & Dining', 'Nature', 'Nightlife', 'Shopping', 'Photography', 'Historical', 'Beach'].map((tag) => (
                        <button 
                          key={tag}
                          type="button"
                          className="px-3 py-1.5 bg-[#F0F6FF] hover:bg-blue-100 text-slate-700 text-xs font-medium rounded-md transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 03: Health Profile */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-sm font-medium text-blue-600">03.</span>
                  <span className="text-sm font-medium text-slate-700">Health Profile</span>
                  <div className="h-[1px] flex-1 bg-slate-200 ml-2"></div>
                </div>
                <div className="space-y-4">
                  <div>
                    <select className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                      <option>Blood Type</option>
                      <option>A+</option>
                      <option>B+</option>
                      <option>O+</option>
                    </select>
                  </div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Medical Conditions (Optional)" 
                      className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Food Allergies" 
                      className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <p className="text-xs text-slate-400 mt-1 ml-1">Type allergy and press Enter</p>
                  </div>
                </div>
              </div>

              {/* Section 04: Emergency Contact */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-sm font-medium text-blue-600">04.</span>
                  <span className="text-sm font-medium text-slate-700">Emergency Contact</span>
                  <div className="h-[1px] flex-1 bg-slate-200 ml-2"></div>
                </div>
                <div className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Contact Name" 
                      className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input 
                        type="text" 
                        placeholder="Phone Number" 
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <select className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                        <option>Relationship</option>
                        <option>Spouse</option>
                        <option>Parent</option>
                        <option>Friend</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button 
                  type="button" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-all w-full md:w-auto md:min-w-[200px]"
                >
                  Complete Registration
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar - Registration Progress */}
          <div className="hidden lg:block w-64 shrink-0 pt-14">
            <div className="sticky top-8">
              <h3 className="text-sm font-semibold text-slate-700 mb-6">Registration Progress</h3>
              
              <div className="relative pl-4 border-l-2 border-slate-200 space-y-8 pb-4">
                {/* Active Item */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-sm"></div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Step 1 of 4</p>
                    <p className="text-sm font-semibold text-slate-800">Personal Details</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative opacity-50">
                  <div className="absolute -left-[21px] top-1 w-4 h-4 bg-slate-200 rounded-full border-4 border-white"></div>
                  <div>
                    <p className="text-xs text-slate-400">Step 2 of 4</p>
                    <p className="text-sm text-slate-600">Trip Information</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative opacity-50">
                  <div className="absolute -left-[21px] top-1 w-4 h-4 bg-slate-200 rounded-full border-4 border-white"></div>
                  <div>
                    <p className="text-xs text-slate-400">Step 3 of 4</p>
                    <p className="text-sm text-slate-600">Health Profile</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative opacity-50">
                  <div className="absolute -left-[21px] top-1 w-4 h-4 bg-slate-200 rounded-full border-4 border-white"></div>
                  <div>
                    <p className="text-xs text-slate-400">Step 4 of 4</p>
                    <p className="text-sm text-slate-600">Emergency Contact</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;