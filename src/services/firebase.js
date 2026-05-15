import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFWkcY2fvLIcxTtuUEHQ_bOXvG_ba0eeE",
  authDomain: "hi5-foundation-76527.firebaseapp.com",
  projectId: "hi5-foundation-76527",
  storageBucket: "hi5-foundation-76527.firebasestorage.app",
  messagingSenderId: "123600269345",
  appId: "1:123600269345:web:e49641bb9b253b60b2b360",
  measurementId: "G-V4HPTQQ6VZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
