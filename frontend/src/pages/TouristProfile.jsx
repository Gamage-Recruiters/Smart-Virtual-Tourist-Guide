import { useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PREFERENCE_TAGS = [
  "Adventure",
  "Cultural",
  "Relaxation",
  "Food & Dining",
  "Nature",
  "Nightlife",
  "Shopping",
  "Photography",
  "Historical",
  "Beaches",
];

const STEPS = [
  { id: 1, label: "Personal Details" },
  { id: 2, label: "Trip Information" },
  { id: 3, label: "Travel Profile" },
  { id: 4, label: "Emergency Contact" },
];

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "India",
  "Japan",
  "Canada",
  "Netherlands",
  "Other",
];

function EyeIcon({ open, ...props }) {
  return open ? (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path d="M10.6 5.2A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a16.6 16.6 0 0 1-3.2 4.1M6.5 6.6C4 8.3 2 12 2 12s3.6 7 10 7c1 0 1.9-.1 2.8-.4" />
      <path d="M9.5 9.8a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

function CalendarIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9.5h18M8 3v4M16 3v4" />
    </svg>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-medium text-slate-500">
          {label}
        </span>
      )}
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100";

function SectionCard({ number, title, sectionRef, children }) {
  return (
    <section ref={sectionRef} className="scroll-mt-24">
      <h2 className="mb-3 text-sm font-semibold text-slate-800">
        {number}. {title}
      </h2>
      <div className="rounded-2xl border border-blue-100 bg-white/70 p-6 shadow-sm">
        {children}
      </div>
    </section>
  );
}

export default function TouristProfile() {
  const [activeStep, setActiveStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [budget, setBudget] = useState(1200);
  const [preferences, setPreferences] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    country: "",
    passportNumber: "",
    startDate: "",
    endDate: "",
    visaType: "",
    medicalConditions: "",
    foodAllergies: "",
    emergencyContactName: "",
    emergencyPhone: "",
    relationship: "",
  });

  const sectionRefs = {
    1: useRef(null),
    2: useRef(null),
    3: useRef(null),
    4: useRef(null),
  };

  const togglePreference = (tag) => {
    setPreferences((current) =>
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag],
    );
  };

  const goToStep = (stepId) => {
    setActiveStep(stepId);
    sectionRefs[stepId]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSubmitted(false);

    try {
      const envUrl = import.meta.env.VITE_API_BASE_URL;
      const apiBaseUrl = envUrl
        ? (envUrl.endsWith("/budget") ? envUrl.slice(0, -7) : envUrl)
        : "http://localhost:3001/api";

      // 1. Register user to get JWT token
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
        throw new Error(registerData.message || "Registration failed");
      }

      const token = registerData.token;
      localStorage.setItem("token", token);
      if (registerData.user) {
        localStorage.setItem("user", JSON.stringify(registerData.user));
      }

      // 2. Submit tourist profile
      const profileRes = await fetch(`${apiBaseUrl}/tourist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          country: formData.country,
          passportNumber: formData.passportNumber,
          startDate: formData.startDate,
          endDate: formData.endDate,
          budget: budget,
          preferences: preferences,
          visaType: formData.visaType,
          medicalConditions: formData.medicalConditions,
          foodAllergies: formData.foodAllergies,
          emergencyContactName: formData.emergencyContactName,
          emergencyPhone: formData.emergencyPhone,
          relationship: formData.relationship,
        }),
      });

      const profileData = await profileRes.json();
      if (!profileRes.ok) {
        throw new Error(profileData.message || "Failed to save profile details");
      }

      setSubmitted(true);
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 w-full min-h-screen rounded-[55px] bg-gradient-to-br from-[#FFFFFF] to-[#A0DBFF] mb-10 h-[1650px]">
        <div className="absolute top-[199px] left-[204px] w-[735px] h-[112px]">
          <h1 className="text-2xl font-bold text-slate-900 h-[40px] w-[936px]">
            Create Your Profile
          </h1>
          <p className="mb-4 text-sm text-slate-500 h-[56px] w-[672px] top-[56px]">
            Tell us about yourself and your travel preferences to get
            personalized <br/> recommendations before your upcoming trip.
          </p>
        </div>
        {error && (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm flex items-center gap-2 ">
            <svg className="h-5 w-5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {submitted && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm flex items-center gap-2">
            <svg className="h-5 w-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Your profile has been submitted. We'll tailor recommendations for your trip shortly.</span>
          </div>
        )}

        <div className="mt-30 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]  pb-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="top-[340px] left-[298px] w-[577px] h-[1871px] ml-33 mt-10">
            <SectionCard
              number="01"
              title="Personal Details"
              sectionRef={sectionRefs[1]}
            >
              <div className="space-y-4">
                <Field>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className={inputClass}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    onFocus={() => setActiveStep(1)}
                    required
                  />
                </Field>
                <Field>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className={inputClass}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setActiveStep(1)}
                    required
                  />
                </Field>
                <Field>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className={`${inputClass} pr-10`}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      onFocus={() => setActiveStep(1)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <EyeIcon open={showPassword} className="h-4 w-4" />
                    </button>
                  </div>
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <select
                      className={inputClass}
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      onFocus={() => setActiveStep(1)}
                    >
                      <option value="" disabled>
                        Country
                      </option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field>
                    <input
                      type="text"
                      placeholder="Passport Number"
                      className={inputClass}
                      value={formData.passportNumber}
                      onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                      onFocus={() => setActiveStep(1)}
                    />
                  </Field>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              number="02"
              title="Trip Information"
              sectionRef={sectionRefs[2]}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <div className="relative">
                      <input
                        type="date"
                        placeholder="Start Date"
                        className={`${inputClass} pr-9`}
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        onFocus={() => setActiveStep(2)}
                      />
                      <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </Field>
                  <Field>
                    <div className="relative">
                      <input
                        type="date"
                        placeholder="End Date"
                        className={`${inputClass} pr-9`}
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        onFocus={() => setActiveStep(2)}
                      />
                      <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </Field>
                </div>

                <div>
                  <span className="mb-2 block text-xs font-medium text-slate-500">
                    Budget Range
                  </span>
                  <div className="text-lg font-semibold text-blue-700">
                    ${budget.toLocaleString()}
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={5000}
                    step={50}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    onFocus={() => setActiveStep(2)}
                    className="mt-2 w-full accent-blue-600"
                  />
                  <div className="mt-1 flex justify-between text-xs text-slate-400">
                    <span>$100</span>
                    <span>$5,000+</span>
                  </div>
                </div>

                <div>
                  <span className="mb-2 block text-xs font-medium text-slate-500">
                    Travel Preferences
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {PREFERENCE_TAGS.map((tag) => {
                      const selected = preferences.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            togglePreference(tag);
                            setActiveStep(2);
                          }}
                          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                            selected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              number="03"
              title="Travel Profile"
              sectionRef={sectionRefs[3]}
            >
              <div className="space-y-4">
                <Field>
                  <select
                    className={inputClass}
                    value={formData.visaType}
                    onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                    onFocus={() => setActiveStep(3)}
                  >
                    <option value="" disabled>
                      Visa Type
                    </option>
                    <option>Tourist Visa</option>
                    <option>Electronic Travel Authorization (ETA)</option>
                    <option>Business Visa</option>
                    <option>Transit Visa</option>
                    <option>Other</option>
                  </select>
                </Field>
                <Field>
                  <textarea
                    placeholder="Medical Conditions (Optional)"
                    rows={3}
                    className={`${inputClass} resize-none`}
                    value={formData.medicalConditions}
                    onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                    onFocus={() => setActiveStep(3)}
                  />
                </Field>
                <Field label="Food Allergies">
                  <input
                    type="text"
                    placeholder="List any dietary restrictions or allergies"
                    className={inputClass}
                    value={formData.foodAllergies}
                    onChange={(e) => setFormData({ ...formData, foodAllergies: e.target.value })}
                    onFocus={() => setActiveStep(3)}
                  />
                </Field>
              </div>
            </SectionCard>

            <SectionCard
              number="04"
              title="Emergency Contact"
              sectionRef={sectionRefs[4]}
            >
              <div className="space-y-4">
                <Field>
                  <input
                    type="text"
                    placeholder="Contact Name"
                    className={inputClass}
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    onFocus={() => setActiveStep(4)}
                    required
                  />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className={inputClass}
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                      onFocus={() => setActiveStep(4)}
                      required
                    />
                  </Field>
                  <Field>
                    <select
                      className={inputClass}
                      value={formData.relationship}
                      onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                      onFocus={() => setActiveStep(4)}
                    >
                      <option value="" disabled>
                        Relationship
                      </option>
                      <option>Parent</option>
                      <option>Spouse</option>
                      <option>Sibling</option>
                      <option>Friend</option>
                      <option>Other</option>
                    </select>
                  </Field>
                </div>
              </div>
            </SectionCard>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Registering & Saving..." : "Complete Registration"}
              </button>
            </div>
          </form>

          {/* Progress sidebar */}
          
            <div className="rounded-2xl border-none  top-[230px] left-[988px] w-[310px] h-[1871px] ">
              <h3 className="text-sm font-semibold text-slate-800 ">
                Registration Progress
              </h3>
              <ol className="mt-5 space-y-6">
                {STEPS.map((step, idx) => {
                  const isActive = step.id === activeStep;
                  const isComplete = step.id < activeStep;
                  return (
                    <li key={step.id} className="relative flex gap-3">
                      {idx < STEPS.length - 1 && (
                        <span
                          className="absolute left-[7px] top-5 h-6 w-px bg-slate-200"
                          aria-hidden="true"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => goToStep(step.id)}
                        className="flex items-start gap-3 text-left"
                      >
                        <span
                          className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full ${
                            isActive
                              ? "bg-blue-600 ring-4 ring-blue-100"
                              : isComplete
                                ? "bg-blue-600"
                                : "bg-slate-200"
                          }`}
                        />
                        <span>
                          <span className="block text-xs text-slate-400">
                            Step {step.id}
                          </span>
                          <span
                            className={`block text-sm font-medium ${
                              isActive ? "text-blue-700" : "text-slate-600"
                            }`}
                          >
                            {step.label}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          
        </div>
      </main>

      <Footer />
    </div>
    
  );
}
