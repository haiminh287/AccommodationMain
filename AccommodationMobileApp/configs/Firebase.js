// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkXpEjCG8x_xUBJwSaB_U8eJ4vugkBQ",
  authDomain: "chatapp-962cb.firebaseapp.com",
  projectId: "chatapp-962cb",
  storageBucket: "chatapp-962cb.firebasestorage.app",
  messagingSenderId: "677871320945",
  appId: "1:677871320945:web:824a9ad52f9d2b6cec80d0",
  measurementId: "G-ZJBM4BBDSK"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);

// Initialize Auth
let auth;
if (!getApps().length) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  auth = getAuth(app);
}

export const usersRef = collection(db, "users");
export const roomRef = collection(db, "rooms");

export { auth };