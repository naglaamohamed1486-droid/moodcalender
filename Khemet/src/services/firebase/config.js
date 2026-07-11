import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA5ZYwcdbHBusFVs2ZCKRMVMYYEMa1Oeok",
  authDomain: "khemet-6b6be.firebaseapp.com",
  projectId: "khemet-6b6be",
  storageBucket: "khemet-6b6be.firebasestorage.app",
  messagingSenderId: "371772471138",
  appId: "1:371772471138:web:88ac833c070de0845e9e3b",
  measurementId: "G-TZWXGVCN26"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
