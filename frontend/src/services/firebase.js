/**
 * Auth Module's Firebase entry point.
 * Re-exports from the unified Firebase initialization at src/firebase.js.
 * Kept for backward compatibility — all existing imports continue to work.
 */
export {
  auth,
  googleProvider,
  signInWithGoogle,
} from "../firebase";