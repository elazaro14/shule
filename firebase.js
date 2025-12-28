import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDFPLbIyIKVD03sXVsbh0lveLIW9fJNoOY", 
  authDomain: "shule-project-2e214.firebaseapp.com",
  projectId: "shule-project-2e214",
  storageBucket: "shule-project-2e214.appspot.com",
  messagingSenderId: "774134734612",
  appId: "1:774134734612:web:715c0e189871587d656093"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
