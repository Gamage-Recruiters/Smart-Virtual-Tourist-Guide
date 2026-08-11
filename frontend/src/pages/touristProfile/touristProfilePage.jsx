import { useState, useEffect } from "react";
import { ProgressStep } from "../../components/touristProfile/progressStep";
import PersonalDetails from "../../components/touristProfile/personalDetails";
import TripInformation from "../../components/touristProfile/tripInformation";
import HealthProfile from "../../components/touristProfile/healthProfile";
import EmergencyContact from "../../components/touristProfile/emergencyContact";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../../services/api";

export const TouristProfilePage = () => {
  const navigate = useNavigate();
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    country: "",
    passport: "",
    startDate: "",
    endDate: "",
    budget: 50000,
    preferences: ["Adventure", "Cultural"],
    bloodType: "",
    medicalConditions: "",
    allergies: [],
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
  });

  const [allergyInput, setAllergyInput] = useState("");

  // Load existing profile values from backend API and localStorage on mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const savedProfileStr = localStorage.getItem("touristProfile");
        const savedUserStr = localStorage.getItem("userData") || localStorage.getItem("user");
        const signupDataStr = localStorage.getItem("signupData");

        let localProfile = savedProfileStr ? JSON.parse(savedProfileStr) : {};
        let localUser = savedUserStr ? JSON.parse(savedUserStr) : {};
        let localSignup = signupDataStr ? JSON.parse(signupDataStr) : {};

        let apiProfile = {};
        let apiUser = {};

        const token = localStorage.getItem("token");
        if (token && token !== "null") {
          try {
            const apiRes = await userAPI.getProfile();
            if (apiRes && apiRes.success) {
              apiUser = apiRes.user || {};
              apiProfile = apiRes.profile || {};
            }
          } catch (apiErr) {
            console.warn("Could not fetch profile from backend API, using local storage:", apiErr);
          }
        }

        const merged = { ...localSignup, ...localUser, ...localProfile, ...apiUser, ...apiProfile };

        if (Object.keys(merged).length > 0) {
          setFormData(prev => ({
            ...prev,
            fullName: merged.fullName || prev.fullName,
            email: merged.email || prev.email,
            password: merged.password || prev.password,
            country: merged.country || prev.country,
            passport: merged.passport || merged.passportNumber || prev.passport,
            startDate: merged.travelStart || merged.startDate || prev.startDate,
            endDate: merged.travelEnd || merged.endDate || prev.endDate,
            budget: merged.budgetMax || merged.budget || prev.budget,
            preferences: Array.isArray(merged.travelStyle) 
              ? merged.travelStyle 
              : Array.isArray(merged.preferences) 
                ? merged.preferences 
                : prev.preferences,
            bloodType: merged.bloodType || prev.bloodType,
            medicalConditions: merged.medicalCondition || merged.medicalConditions || prev.medicalConditions,
            allergies: Array.isArray(merged.allergies) && merged.allergies.length > 0
              ? merged.allergies
              : merged.medicalCondition
                ? [merged.medicalCondition]
                : prev.allergies,
            emergencyName: merged.emergencyName || merged.emergencyContactName || prev.emergencyName,
            emergencyPhone: merged.emergencyContactNumber || merged.emergencyPhone || prev.emergencyPhone,
            emergencyRelation: merged.emergencyRelationship || merged.relationship || merged.emergencyRelation || prev.emergencyRelation,
          }));
        }
      } catch (err) {
        console.error("Error loading saved tourist data:", err);
      }
    };

    loadProfileData();

    // Check update mode based on localStorage or path
    const completed = localStorage.getItem("profileCompleted") === "true";
    if (completed || window.location.pathname === "/touristProfile") {
      setIsUpdateMode(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePreference = (pref) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter((p) => p !== pref)
        : [...prev.preferences, pref],
    }));
  };

  const handleAllergyKeyDown = (e) => {
    if (e.key === "Enter" && allergyInput.trim() !== "") {
      e.preventDefault();
      if (!formData.allergies.includes(allergyInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          allergies: [...prev.allergies, allergyInput.trim()],
        }));
      }
      setAllergyInput("");
    }
  };

  const removeAllergy = (allergyToRemove) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a !== allergyToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = {
        fullName: formData.fullName,
        email: formData.email,
        country: formData.country,
        passportNumber: formData.passport,
        passport: formData.passport,
        startDate: formData.startDate,
        endDate: formData.endDate,
        travelStart: formData.startDate,
        travelEnd: formData.endDate,
        budget: Number(formData.budget),
        budgetMax: Number(formData.budget),
        budgetRange: `Rs. ${formData.budget}`,
        preferences: formData.preferences,
        travelStyle: formData.preferences,
        bloodType: formData.bloodType,
        medicalConditions: formData.medicalConditions,
        medicalCondition: formData.medicalConditions,
        allergies: formData.allergies,
        emergencyContactName: formData.emergencyName,
        emergencyName: formData.emergencyName,
        emergencyPhone: formData.emergencyPhone,
        emergencyContactNumber: formData.emergencyPhone,
        relationship: formData.emergencyRelation,
        emergencyRelationship: formData.emergencyRelation,
      };

      localStorage.setItem("touristProfile", JSON.stringify(updatedProfile));
      localStorage.setItem("profileCompleted", "true");
      localStorage.setItem("userData", JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        country: formData.country
      }));
      localStorage.setItem("user", JSON.stringify({
        fullName: formData.fullName,
        email: formData.email
      }));
      localStorage.setItem("tripInfo", JSON.stringify({
        startDate: formData.startDate,
        endDate: formData.endDate,
        budgetLKR: Number(formData.budget),
        preferences: formData.preferences,
      }));

      // Post/Put to backend API if token exists
      const token = localStorage.getItem("token");
      if (token && token !== "null") {
        try {
          await userAPI.updateProfile(updatedProfile);
        } catch (apiErr) {
          console.warn("Backend profile sync notice:", apiErr);
        }
      }

      alert("Tourist Profile saved successfully!");
      navigate("/tour-dashboard");
    } catch (error) {
      console.error("Profile submission error:", error);
      alert(error.message || "Failed to save profile.");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#eaf4fb] p-8 md:p-12 font-sans flex justify-center rounded-4xl">
        <form
          onSubmit={handleSubmit}
          className="max-w-6xl w-full flex flex-col md:flex-row gap-12 relative"
        >
          {/* Left Column: Form Content */}
          <div className="flex-1 max-w-3xl space-y-12">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
                {isUpdateMode ? "Update Profile" : "Create Your Profile"}
              </h1>
              <p className="text-slate-500 text-sm max-w-lg leading-relaxed">
                Tell us about yourself and your travel preferences to get
                personalized recommendations for your upcoming trips.
              </p>
            </div>

            <div className="space-y-12 ml-33">
              {/* Section 01: Personal Details */}
              <PersonalDetails formData={formData} handleChange={handleChange} />

              {/* Section 02: Trip Information */}
              <TripInformation
                formData={formData}
                handleChange={handleChange}
                togglePreference={togglePreference}
              />

              {/* Section 03: Health Profile */}
              <HealthProfile
                formData={formData}
                handleChange={handleChange}
                allergyInput={allergyInput}
                handleAllergyKeyDown={handleAllergyKeyDown}
                removeAllergy={removeAllergy}
                setAllergyInput={setAllergyInput}
              />

              {/* Section 04: Emergency Contact */}
              <EmergencyContact formData={formData} handleChange={handleChange} />
            </div>

            <div className="flex justify-center pt-8">
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold py-4 px-12 rounded-xl hover:bg-blue-700 transition-transform active:scale-95 shadow-lg shadow-blue-200 cursor-pointer"
              >
                {isUpdateMode ? "Update Profile" : "Complete Registration"}
              </button>
            </div>
          </div>

          {/* Right Column: Sticky Sidebar Progress */}
          <div className="hidden lg:block 2xl:w-64 pt-8 shrink-0">
            <div className="sticky top-12 space-y-8">
              <h3 className="text-xs font-extrabold text-slate-800 tracking-wide uppercase">
                Registration Progress
              </h3>

              <div className="space-y-6">
                <ProgressStep
                  step="01"
                  label="Personal Details"
                  active={
                    formData.fullName !== "" ||
                    formData.email !== "" ||
                    formData.password !== ""
                  }
                />
                <ProgressStep
                  step="02"
                  label="Trip Information"
                  active={formData.startDate !== "" || formData.endDate !== ""}
                />
                <ProgressStep
                  step="03"
                  label="Health Profile"
                  active={formData.bloodType !== ""}
                />
                <ProgressStep
                  step="04"
                  label="Emergency Contact"
                  active={
                    formData.emergencyName !== "" ||
                    formData.emergencyPhone !== ""
                  }
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default TouristProfilePage;

