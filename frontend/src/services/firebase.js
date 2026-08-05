import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase credentials are actually configured
const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
);

// Lazy init — only initialise Firebase when credentials exist
let _app = null;
let _auth = null;
let _googleProvider = null;

const getFirebaseApp = () => {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase is not configured. Add VITE_FIREBASE_* variables to your frontend .env file to enable Google Sign-In.'
    );
  }
  if (!_app) {
    _app = initializeApp(firebaseConfig);
    _auth = getAuth(_app);
    _googleProvider = new GoogleAuthProvider();
  }
  return { auth: _auth, googleProvider: _googleProvider };
};

// Named exports kept for backward-compat (used lazily now)
export const getAuthInstance = () => getFirebaseApp().auth;
export const getGoogleProvider = () => getFirebaseApp().googleProvider;

export const signInWithGoogle = async () => {
  const { auth, googleProvider } = getFirebaseApp();
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
};

// Keep legacy named exports so other files don't break
export { isFirebaseConfigured };
