import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// =========================================================
// 1. UNIFIED FIREBASE CONFIGURATION
// =========================================================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, // Measurement ID included
};

// Check if config is ready
const isFirebaseConfigured =
  firebaseConfig.apiKey && firebaseConfig.apiKey !== "placeholder";

let app = null;
let auth = null;
let googleProvider = null;
let messaging = null;

if (isFirebaseConfigured) {
  // Singleton Pattern: Never call initializeApp twice!
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  // Initialize Auth (for Google Sign-In)
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();

  // Initialize Messaging (for Push Notifications)
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    messaging = getMessaging(app);
  }
}

// =========================================================
// 2. AUTH EXPORTS & FUNCTIONS (Google Login)
// =========================================================
export { auth, googleProvider };

export const signInWithGoogle = async () => {
  if (!isFirebaseConfigured || !auth) {
    throw new Error(
      "Google sign-in is not configured yet. Please contact the administrator."
    );
  }
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
};

// =========================================================
// 3. NOTIFICATION EXPORTS & FUNCTIONS (FCM Push Alerts)
// =========================================================
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const requestForToken = async () => {
  if (!messaging) return null;

  try {
    const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (currentToken) {
      console.log("✅ Firebase FCM Token Generated:", currentToken);
      return currentToken;
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
      return null;
    }
  } catch (err) {
    console.error("An error occurred while retrieving token:", err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export default app;