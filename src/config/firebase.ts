// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCp2CX-ZR4up4Onx0sw4ziO5Y2sySXZvJc",
  authDomain: "workout-61b6f.firebaseapp.com",
  databaseURL: "https://workout-61b6f-default-rtdb.firebaseio.com",
  projectId: "workout-61b6f",
  storageBucket: "workout-61b6f.firebasestorage.app",
  messagingSenderId: "481901563244",
  appId: "1:481901563244:web:90b6d4a84ca4871ee2f749",
  measurementId: "G-DLSGR6L6XB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
