import React, { createContext, useContext, useState, useEffect } from 'react';

// ─── Initial state shapes ────────────────────────────────────────────────────

const initialStep1 = {
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  contactNumber: '',
};

const initialStep2 = {
  vehicleType: '',
  vehicleCategory: '',
  manufactureDate: '',
  loadType: '',
};

const initialStep3 = {
  vehicleNumber: '',
  licenseNumber: '',
  licenseImages: [],
  regBookImages: [],
  vehicleImages: [],
};

// ─── Context ─────────────────────────────────────────────────────────────────

const DriverSignupContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const DriverSignupProvider = ({ children }) => {
  // Rehydrate from sessionStorage so Back navigation doesn't lose data
  const [step1Data, setStep1DataState] = useState(() => {
    try {
      const saved = sessionStorage.getItem('driver_signup_step1');
      return saved ? JSON.parse(saved) : initialStep1;
    } catch {
      return initialStep1;
    }
  });

  const [step2Data, setStep2DataState] = useState(() => {
    try {
      const saved = sessionStorage.getItem('driver_signup_step2');
      return saved ? JSON.parse(saved) : initialStep2;
    } catch {
      return initialStep2;
    }
  });

  // Step 3 has image File objects — can't persist to sessionStorage, keep in memory only
  const [step3Data, setStep3DataState] = useState(initialStep3);

  // Mirror step1 & step2 to sessionStorage on every change
  useEffect(() => {
    sessionStorage.setItem('driver_signup_step1', JSON.stringify(step1Data));
  }, [step1Data]);

  useEffect(() => {
    sessionStorage.setItem('driver_signup_step2', JSON.stringify(step2Data));
  }, [step2Data]);

  const setStep1Data = (data) => setStep1DataState((prev) => ({ ...prev, ...data }));
  const setStep2Data = (data) => setStep2DataState((prev) => ({ ...prev, ...data }));
  const setStep3Data = (data) => setStep3DataState((prev) => ({ ...prev, ...data }));

  /** Call this after successful registration to wipe all saved state */
  const clearSignupData = () => {
    setStep1DataState(initialStep1);
    setStep2DataState(initialStep2);
    setStep3DataState(initialStep3);
    sessionStorage.removeItem('driver_signup_step1');
    sessionStorage.removeItem('driver_signup_step2');
    sessionStorage.removeItem('driver_signup_step3');
  };

  return (
    <DriverSignupContext.Provider
      value={{
        step1Data,
        step2Data,
        step3Data,
        setStep1Data,
        setStep2Data,
        setStep3Data,
        clearSignupData,
      }}
    >
      {children}
    </DriverSignupContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useDriverSignup = () => {
  const ctx = useContext(DriverSignupContext);
  if (!ctx) {
    throw new Error('useDriverSignup must be used inside <DriverSignupProvider>');
  }
  return ctx;
};

export default DriverSignupContext;
