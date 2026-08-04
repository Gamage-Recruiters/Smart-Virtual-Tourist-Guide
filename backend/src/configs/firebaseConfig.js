import { initializeApp, cert, getApps } from "firebase-admin/app";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import logger from "../utils/logger.js";

// ESM workaround for __dirname (not available in ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let firebaseApp;

try {
  /**
   * Define the path to the Firebase Service Account JSON file.
   * __dirname gives the current folder (src/configs), so we go two steps back (../../) to reach the root folder.
   */
  const serviceAccountPath = path.join(
    __dirname,
    "../../firebase-service-account.json",
  );

  // Safety Check: Verify if the service account file actually exists before trying to load it
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      `Firebase service account file not found at: ${serviceAccountPath}`,
    );
  }

  // Load the service account credentials using fs + JSON.parse (ESM JSON import workaround)
  const rawData = fs.readFileSync(serviceAccountPath, "utf-8");
  const serviceAccount = JSON.parse(rawData);

  /**
   * Singleton Pattern: Check if Firebase is already initialized.
   * This prevents Firebase from throwing an error if the server reloads (e.g., during development with nodemon).
   */
  if (getApps().length === 0) {
    // Initialize Firebase for the first time
    firebaseApp = initializeApp({
      credential: cert(serviceAccount),
    });
    logger.info(" Firebase Admin Initialized Successfully!");
  } else {
    // If already initialized, just use the existing instance
    firebaseApp = getApps()[0];
    logger.info("Firebase Admin already running.");
  }
} catch (error) {
  // Log any errors that happen during initialization (e.g., wrong file path or invalid credentials)
  logger.error(` Firebase Initialization Failed: ${error.message}`);
}

// Export the initialized app so other services (like FCM) can use it
export default firebaseApp;