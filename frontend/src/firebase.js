/**
 * UNIFIED FIREBASE INITIALIZATION
 * ================================
 * SINGLE source of truth for both:
 *   - Auth Module (Google Login via Firebase Auth)
 *   - Notification Module (FCM Push via Firebase Messaging)
 *
 * This prevents the "Firebase App '[DEFAULT]' already exists" error
 * caused by two separate files calling initializeApp() independently.
 */
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ==========================================
// SAFE INIT — only one app instance ever
// ==========================================
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ==========================================
// AUTH EXPORTS (for Google Login)
// ==========================================
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
};

// ==========================================
// MESSAGING EXPORTS (for FCM Push)
// ==========================================
let messaging = null;
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  messaging = getMessaging(app);
}

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// CRITICAL: The service worker MUST be registered before getToken() is called.
// Without it, Firebase cannot receive background messages and getToken() will fail.
const registerServiceWorker = async () => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }
  try {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );
    console.log("✅ Service Worker registered:", registration.scope);
    return registration;
  } catch (err) {
    console.error("❌ Service Worker registration failed:", err);
    return null;
  }
};

export const requestForToken = async () => {
  if (!messaging) return null;

  try {
    // Ensure the service worker is active before requesting a token
    await registerServiceWorker();
    const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (currentToken) {
      console.log("✅ Firebase FCM Token Generated:", currentToken);
      return currentToken;
    } else {
      console.log(
        "No registration token available. Request permission to generate one.",
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