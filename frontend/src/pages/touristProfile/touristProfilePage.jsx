import { useState } from "react";
import { ProgressStep } from "../../components/touristProfile/progressStep";
import PersonalDetails from "../../components/touristProfile/personalDetails";
import TripInformation from "../../components/touristProfile/tripInformation";
import HealthProfile from "../../components/touristProfile/healthProfile";
import EmergencyContact from "../../components/touristProfile/emergencyContact";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export const TouristProfilePage = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  // 1. Unified Form State Object
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    country: "",
    passport: "",
    startDate: "",
    endDate: "",
    budget: 5000,
    preferences: ["Adventure", "Cultural"],
    bloodType: "",
    medicalConditions: "",
    allergies: [],
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
  });

  // Temporary state for the allergy input box
  const [allergyInput, setAllergyInput] = useState("");

  // 2. Universal Input Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Preference Toggle
  const togglePreference = (pref) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter((p) => p !== pref)
        : [...prev.preferences, pref],
    }));
  };

  // Allergy Tag Handlers
  const handleAllergyKeyDown = (e) => {
    if (e.key === "Enter" && allergyInput.trim() !== "") {
      e.preventDefault(); // Stop form submission
      if (!formData.allergies.includes(allergyInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          allergies: [...prev.allergies, allergyInput.trim()],
        }));
      }
      setAllergyInput(""); // Clear the input visually
    }
  };

  const removeAllergy = (allergyToRemove) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a !== allergyToRemove),
    }));
  };

  // Final Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const registerRes = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const registerData = await registerRes.json();
      if (!registerRes.ok) {
        throw new Error(registerData.message || "Registration failed.");
      }

      const token = registerData.token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(registerData.user));

      const profileRes = await fetch(`${apiBaseUrl}/tourist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          country: formData.country,
          passport: formData.passport,
          passportNumber: formData.passport,
          startDate: formData.startDate,
          endDate: formData.endDate,
          budget: Number(formData.budget),
          preferences: formData.preferences,
          bloodType: formData.bloodType,
          medicalConditions: formData.medicalConditions,
          allergies: formData.allergies,
          foodAllergies: formData.allergies,
          emergencyName: formData.emergencyName,
          emergencyContactName: formData.emergencyName,
          emergencyPhone: formData.emergencyPhone,
          emergencyRelation: formData.emergencyRelation,
          relationship: formData.emergencyRelation,
        }),
      });

      const profileData = await profileRes.json();
      if (!profileRes.ok) {
        throw new Error(profileData.message || "Failed to save tourist profile.");
      }

      console.log("Saved tourist profile:", profileData);

      setFormData({
        fullName: "",
        email: "",
        password: "",
        country: "",
        passport: "",
        startDate: "",
        endDate: "",
        budget: 5000,
        preferences: ["Adventure", "Cultural"],
        bloodType: "",
        medicalConditions: "",
        allergies: [],
        emergencyName: "",
        emergencyPhone: "",
        emergencyRelation: "",
      });
      setAllergyInput("");
    } catch (error) {
      console.error("Profile submission failed:", error);
      alert(error.message || "Failed to submit profile.");
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
              Create Your Profile
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
              className="bg-blue-600 text-white font-bold py-4 px-12 rounded-xl hover:bg-blue-700 transition-transform active:scale-95 shadow-lg shadow-blue-200"
            >
              Complete Registration
            </button>
          </div>
        </div>

        {/* Right Column: Sticky Sidebar Progress */}
        <div className="hidden lg:block 2xl:w-64 pt-8 shrink-0 ">
          <div className="sticky top-12 space-y-8">
            <h3 className="text-xs font-extrabold text-slate-800 tracking-wide uppercase">
              Registration Progress
            </h3>

            <div className="space-y-6">
              <ProgressStep
                step="01"
                label="Personal Details"
                active={
                  formData.fullName !== "" &&
                  formData.email !== "" &&
                  formData.password !== "" &&
                  formData.country !== "" &&
                  formData.passport !== ""
                }
              />
              <ProgressStep
                step="02"
                label="Trip Information"
                active={formData.startDate !== "" && formData.endDate !== ""}
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
                  formData.emergencyName !== "" &&
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
