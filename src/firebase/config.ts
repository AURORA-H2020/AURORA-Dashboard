import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { FirebaseConstants } from "@/firebase/firebase-constants";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: FirebaseConstants.buckets.auroraDashboard.name,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let firebaseApp: FirebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

// Initialize App Check in the browser before any Firebase service is used
if (typeof window !== "undefined") {
  try {
    if (process.env.NEXT_PUBLIC_USE_EMULATOR === "true") {
      Object.assign(window, {
        FIREBASE_APPCHECK_DEBUG_TOKEN:
          process.env.NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN,
      });
    }

    initializeAppCheck(firebaseApp, {
      provider: new ReCaptchaEnterpriseProvider(
        process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_KEY as string,
      ),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (error) {
    console.error("Failed to initialize Firebase App Check:", error);
  }
}

// Check if we are in development and if so, connect to Firebase emulators
if (process.env.NEXT_PUBLIC_USE_EMULATOR === "true") {
  // Firestore Emulator
  const firestore = getFirestore(firebaseApp);
  connectFirestoreEmulator(firestore, "127.0.0.1", 8080);

  // Storage Emulator
  const storage = getStorage(firebaseApp);
  connectStorageEmulator(storage, "127.0.0.1", 9199);

  // Authentication Emulator
  const auth = getAuth(firebaseApp);
  connectAuthEmulator(auth, "http://127.0.0.1:9099");

  // Function Emulator
  const functions = getFunctions(firebaseApp);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

export { firebaseApp };
