import { useState, useEffect } from 'react'
import { userAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom'
import { IoMdArrowForward, IoMdArrowBack } from 'react-icons/io'
import { getNames } from 'country-list'
import { FaShieldAlt, FaHeartbeat, FaPhoneAlt, FaWallet, FaBed, FaUmbrellaBeach } from 'react-icons/fa'
import Header from '../../components/Tourist/Header'
import Footer from '../../components/Tourist/Footer'
import formBgImage from '../../assets/Tourist/form back.jpg'
import bgImage1 from '../../assets/Tourist/tbg1.png'
import bgImage2 from '../../assets/Tourist/tbg3.png'
import bgImage3 from '../../assets/Tourist/tbg2.png'
import bgImage4 from '../../assets/Tourist/bg4.png'

const TravelSafetyInfo = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    travelStart: '',
    travelEnd: '',
    budgetRange: 'LKR 10000 - LKR 50000',
    travelStyle: [],
    accommodationType: '',
    bloodType: 'O+',
    medicalCondition: '',
    emergencyName: '',
    emergencyRelationship: '',
    emergencyCountry: 'United States'
  })

  const [budgetMin, setBudgetMin] = useState(10000)
  const [budgetMax, setBudgetMax] = useState(50000)

  // Load signup data when component mounts
  useEffect(() => {
    // Check if user has Form 1 data
    const signupData = localStorage.getItem('signupData')
    if (!signupData) {
      navigate('/tourist') // or whichever route handles form 1
    }
  }, [navigate])

  const travelStyles = ['Adventure', 'Beach', 'Culture', 'Wildlife']
  const accommodationTypes = ['Hotel', 'Hostel', 'Resort', 'Homestay']
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
  const countries = getNames();

  const handleStyleToggle = (style) => {
    setFormData(prev => ({
      ...prev,
      travelStyle: prev.travelStyle.includes(style)
        ? prev.travelStyle.filter(s => s !== style)
        : [...prev.travelStyle, style]
    }))
  }

  const handleBudgetChange = (type, value) => {
    if (type === 'min') {
      setBudgetMin(value)
      setFormData(prev => ({
        ...prev,
        budgetRange: `LKR ${value} - LKR ${budgetMax}`
      }))
    } else {
      setBudgetMax(value)
      setFormData(prev => ({
        ...prev,
        budgetRange: `LKR ${budgetMin} - LKR ${value}`
      }))
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBack = () => {
    navigate('/tourist');
  };

  // Update handleSubmit to properly structure the data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const signupDataStr = localStorage.getItem('signupData');
      const signupData = signupDataStr ? JSON.parse(signupDataStr) : {};

      const travelData = {
        ...signupData,
        travelPreferences: {
          travelStart: formData.travelStart,
          travelEnd: formData.travelEnd,
          budgetRange: {
            min: budgetMin,
            max: budgetMax,
            currency: 'LKR'
          },
          travelStyle: formData.travelStyle,
          accommodationType: formData.accommodationType
        },
        healthInfo: {
          bloodType: formData.bloodType,
          medicalCondition: formData.medicalCondition
        },
        emergencyContact: {
          name: formData.emergencyName,
          relationship: formData.emergencyRelationship,
          country: formData.emergencyCountry
        }
      };

      const response = await userAPI.register(travelData);

      if (!response.success) {
        throw new Error(response.message || 'Failed to save information.');
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      localStorage.removeItem('signupData');
      navigate('/');
    } catch (error) {
      console.error('Failed to update travel info:', error);
      alert(error.message || 'Failed to save information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      <Header />

      {/* Page content area - relative so bg images are scoped here */}
      <div className="flex-1 relative">

        {/* Background Images - scoped to content area only */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-0 top-0 hidden lg:block" style={{ zIndex: 0, width: '50%', height: '100%' }}>
            <img src={bgImage1} alt="" className="w-full h-full object-cover opacity-70" />
          </div>
          <div className="absolute left-0 bottom-0 hidden lg:block" style={{ zIndex: 0, width: '40%', height: '60%' }}>
            <img src={bgImage2} alt="" className="w-full h-full object-cover opacity-100" />
          </div>
          <div className="absolute hidden lg:block" style={{ zIndex: 0, width: '20%', height: '20%', left: '30%', top: '30%' }}>
            <img src={bgImage3} alt="" className="w-full h-full object-cover opacity-100" />
          </div>
          <div className="absolute top-0 right-0 hidden lg:block" style={{ zIndex: 0, width: '20%', height: '20%' }}>
            <img src={bgImage4} alt="" className="w-full h-full object-cover opacity-100" />
          </div>
        </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Side - Empty/Background Space */}
          <div className="hidden lg:block lg:w-1/2">
            {/* Empty div for balance - background images will show here */}
          </div>

          {/* Right Side - Form Section */}
          <div className="w-full lg:w-1/2">
            <div className="pl-0 lg:pl-12">
              {/* Form Card with Background Image and Custom Shadow */}
              <div
                className="relative overflow-hidden"
                style={{
                  borderRadius: '25px',
                  boxShadow: '0 20px 40px rgba(60, 180, 255, 0.25), 0 8px 20px rgba(60, 180, 255, 0.15)'
                }}
              >

                {/* Form Background Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={formBgImage}
                    alt="Form background"
                    className="w-full h-full object-cover"
                  />
                  {/* Semi-transparent overlay for better text readability */}
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
                </div>

                {/* Form Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center pt-8 pb-4 px-6">
                    <div className="inline-flex items-center justify-center bg-gradient-to-r from-[#3CB4FF] to-blue-500 p-3 rounded-2xl mb-4">
                      <FaShieldAlt className="text-white text-3xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Travel & Safety Information</h1>
                    <p className="text-gray-500">Set up your profile let AI plan your journey</p>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

                    {/* Travel Dates - Two columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaUmbrellaBeach className="inline mr-2 text-[#3CB4FF]" />
                          Travel Start Date
                        </label>
                        <input
                          type="date"
                          name="travelStart"
                          value={formData.travelStart}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB4FF] focus:border-transparent outline-none transition bg-white/90"
                          style={{ borderRadius: '10px' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaUmbrellaBeach className="inline mr-2 text-[#3CB4FF]" />
                          Travel End Date
                        </label>
                        <input
                          type="date"
                          name="travelEnd"
                          value={formData.travelEnd}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB4FF] focus:border-transparent outline-none transition bg-white/90"
                          style={{ borderRadius: '10px' }}
                        />
                      </div>
                    </div>

                    {/* Budget Range */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaWallet className="inline mr-2 text-[#3CB4FF]" />
                        Budget Range (LKR)
                      </label>
                      <div className="space-y-3">
                        <div className="flex gap-4 items-center">
                          <span className="text-sm text-gray-600">Min: LKR {budgetMin.toLocaleString()}</span>
                          <input
                            type="range"
                            min="0"
                            max="500000"
                            step="5000"
                            value={budgetMin}
                            onChange={(e) => handleBudgetChange('min', parseInt(e.target.value))}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3CB4FF]"
                          />
                        </div>
                        <div className="flex gap-4 items-center">
                          <span className="text-sm text-gray-600">Max: LKR {budgetMax.toLocaleString()}</span>
                          <input
                            type="range"
                            min="0"
                            max="1000000"
                            step="5000"
                            value={budgetMax}
                            onChange={(e) => handleBudgetChange('max', parseInt(e.target.value))}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3CB4FF]"
                          />
                        </div>
                        <div className="text-center p-3 bg-blue-50/90 rounded-lg" style={{ borderRadius: '10px' }}>
                          <span className="font-semibold text-[#3CB4FF]">Selected Budget: LKR {budgetMin.toLocaleString()} - LKR {budgetMax.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Travel Style - Grid of options */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Travel Preference / Style</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {travelStyles.map(style => (
                          <button
                            key={style}
                            type="button"
                            onClick={() => handleStyleToggle(style)}
                            className={`px-4 py-2 font-medium transition-all transform hover:scale-105 ${formData.travelStyle.includes(style) ? 'bg-gradient-to-r from-[#3CB4FF] to-blue-500 text-white shadow-lg' : 'bg-white/90 text-gray-700 hover:bg-gray-100'}`}
                            style={{ borderRadius: '12px' }}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Accommodation Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaBed className="inline mr-2 text-[#3CB4FF]" />
                        Accommodation Type
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {accommodationTypes.map(type => (
                          <label key={type} className="cursor-pointer">
                            <input
                              type="radio"
                              name="accommodationType"
                              value={type}
                              checked={formData.accommodationType === type}
                              onChange={handleChange}
                              className="hidden peer"
                            />
                            <div
                              className={`px-4 py-2 font-medium text-center transition-all ${formData.accommodationType === type ? 'bg-gradient-to-r from-[#3CB4FF] to-blue-500 text-white shadow-lg' : 'bg-white/90 text-gray-700 hover:bg-gray-100'}`}
                              style={{ borderRadius: '12px' }}>
                              {type}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Health Information */}
                    <div className="bg-red-50/90 p-4" style={{ borderRadius: '16px' }}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FaHeartbeat className="mr-2 text-red-500" />
                        Health Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                          <select
                            name="bloodType"
                            value={formData.bloodType}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB4FF] focus:border-transparent outline-none transition bg-white/90"
                            style={{ borderRadius: '10px' }}
                          >
                            {bloodTypes.map(type => (
                              <option key={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Medical Condition / Allergies</label>
                          <input
                            type="text"
                            name="medicalCondition"
                            value={formData.medicalCondition}
                            onChange={handleChange}
                            placeholder="e.g., Food Allergies, Diabetes, Asthma"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB4FF] focus:border-transparent outline-none transition bg-white/90"
                            style={{ borderRadius: '10px' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="bg-yellow-50/90 p-4" style={{ borderRadius: '16px' }}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FaPhoneAlt className="mr-2 text-yellow-600" />
                        Emergency Contact
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                          <input
                            type="text"
                            name="emergencyName"
                            value={formData.emergencyName}
                            onChange={handleChange}
                            placeholder="Full name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB4FF] focus:border-transparent outline-none transition bg-white/90"
                            style={{ borderRadius: '10px' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                          <input
                            type="text"
                            name="emergencyRelationship"
                            value={formData.emergencyRelationship}
                            onChange={handleChange}
                            placeholder="e.g., Parent, Spouse, Friend"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB4FF] focus:border-transparent outline-none transition bg-white/90"
                            style={{ borderRadius: '10px' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <select
                            name="emergencyCountry"
                            value={formData.emergencyCountry}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB4FF] focus:border-transparent outline-none transition bg-white/90"
                            style={{ borderRadius: '10px' }}
                          >
                            {countries.map(country => (
                              <option key={country}>{country}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons with Custom Border Radius */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                        style={{
                          borderRadius: '0px 0px 0px 25px',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}
                      >
                        <IoMdArrowBack />
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-[#3CB4FF] to-blue-500 text-white py-3 font-semibold hover:from-[#2ea0e6] hover:to-blue-600 transition-all flex items-center justify-center gap-2"
                        style={{
                          borderRadius: '0px 0px 25px 0px',
                          boxShadow: '0 4px 15px rgba(60, 180, 255, 0.3)'
                        }}
                      >
                        Create
                        <IoMdArrowForward />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* close flex-1 relative */}
      </div>
      <Footer />
    </div>
  )
}

export default TravelSafetyInfo