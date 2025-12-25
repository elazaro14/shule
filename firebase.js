// Import Firebase SDKs from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1oj2HQLz4GUd_I-fl59BzELYpYcpto8E",
  authDomain: "shule-project-2e214.firebaseapp.com",
  projectId: "shule-project-2e214",
  storageBucket: "shule-project-2e214.appspot.com",
  messagingSenderId: "1048482629660",
  appId: "1:1048482629660:web:87faa286b97e2e4c7a37d9",
  measurementId: "G-MGDC4X9FZ6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
