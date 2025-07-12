// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDlRrW-u1dI8rUS3PnX_AujL6Kac9HlkyQ",
  authDomain: "amuerose-shop.firebaseapp.com",
  projectId: "amuerose-shop",
  storageBucket: "amuerose-shop.firebasestorage.app",
  messagingSenderId: "210304519323",
  appId: "1:210304519323:web:2acb3a1876431611b88a3e",
  measurementId: "G-TSY535HPH2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();