// Import required Firebase modules for app initialization and authentication
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Import Node.js built-in modules for file and path management
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Import custom logger to print messages
import logger from "../utils/logger.js"; 

// Workaround to get the current file and folder path in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Declare variables to store the Firebase App and Auth instances
let firebaseApp;
let auth;

try {
  // Create the exact path to the Firebase Service Account JSON file
  // "../../" goes back two folders to reach the main project folder
  const serviceAccountPath = path.join(
    __dirname,
    "../../firebase-service-account.json"
  );

  // Stop the process and show an error if the JSON file is missing
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(`Firebase service account file not found at: ${serviceAccountPath}`);
  }

  // Read the JSON file and convert it into a usable JavaScript object
  const rawData = fs.readFileSync(serviceAccountPath, "utf-8");
  const serviceAccount = JSON.parse(rawData);

  // Check if Firebase is NOT already initialized (prevents double initialization)
  if (getApps().length === 0) {
    // Start Firebase for the first time using the loaded credentials
    firebaseApp = initializeApp({
      credential: cert(serviceAccount),
    });
    logger.info("✅ Firebase Admin SDK Initialized Successfully!");
  } else {
    // If it is already running, just use the existing active instance
    firebaseApp = getApps()[0];
  }

  // Get the Authentication service instance for user management
  auth = getAuth(firebaseApp);

} catch (error) {
  // Log the error message if anything fails during startup
  logger.error(`❌ Firebase Initialization Failed: ${error.message}`);
}

// Export 'auth' (for login/security) and 'firebaseApp' (for push notifications)
export { auth, firebaseApp };