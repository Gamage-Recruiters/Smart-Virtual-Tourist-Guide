const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

let auth = null;
let firebaseInitialized = false;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  const isPlaceholder = 
    !projectId || 
    projectId === 'your_project_id' || 
    !privateKey || 
    privateKey.includes('your_private_key');

  if (isPlaceholder) {
    console.warn("⚠️ Firebase Admin SDK: Placeholder or missing credentials in .env. Google Auth will be unavailable.");
  } else {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    }
    auth = getAuth();
    firebaseInitialized = true;
    console.log("✅ Firebase Admin SDK initialized successfully.");
  }
} catch (error) {
  console.error("❌ Failed to initialize Firebase Admin SDK:", error.message);
  console.warn("Google Auth will be unavailable until environment variables are corrected.");
}

module.exports = { auth, firebaseInitialized };
