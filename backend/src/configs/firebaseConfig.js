const { initializeApp, cert, getApps } = require('firebase-admin/app');
const path = require("path");

try {
  const serviceAccount = require("../../firebase-service-account.json");

  if (getApps().length === 0) {
    initializeApp({
      credential: cert(serviceAccount),
    });
    console.log("🔥 Firebase Admin (v14) Initialized Successfully!");
  } else {
    console.log("ℹ️ Firebase Admin already running.");
  }
} catch (error) {
  console.error("❌ Firebase Initialization Error:", error.message);
}

const admin = require('firebase-admin');
module.exports = admin;