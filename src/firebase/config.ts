import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { FirebaseConstants } from "./firebase-constants";

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
let firebaseApp;

if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApp();
}

// Check if we are in development and if so, connect to Firebase emulators
if (process.env.NEXT_PUBLIC_TEST_MODE === "true") {
    // Firestore Emulator
    const firestore = getFirestore(firebaseApp);
    connectFirestoreEmulator(firestore, "localhost", 8080);

    // Authentication Emulator
    const auth = getAuth(firebaseApp);
    connectAuthEmulator(auth, "http://localhost:9099");
}

export { firebaseApp };
