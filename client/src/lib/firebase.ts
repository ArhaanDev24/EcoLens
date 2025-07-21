import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: "eco-lens-54294.firebaseapp.com",
  projectId: "eco-lens-54294",
  storageBucket: "eco-lens-54294.firebasestorage.app",
  messagingSenderId: "758395307710",
  appId: "1:758395307710:web:39b1661d324c1a20a800ef",
  measurementId: "G-5JPX1V2VJZ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
