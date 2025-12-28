import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.login = async () => {
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value;
    const btn = document.querySelector('button');

    if (!email || !pass) {
        alert("Please enter both email and password.");
        return;
    }

    btn.disabled = true;
    btn.innerText = "Authenticating...";

    try {
        // 1. Authenticate with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // 2. Fetch User Document from 'users' collection using UID
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            // 3. Update Last Login Timestamp
            await updateDoc(userRef, {
                lastLogin: new Date().toLocaleString('en-GB')
            });
            window.location.href = "dashboard.html"; 
        } else {
            // Document missing in Firestore
            btn.disabled = false;
            btn.innerText = "Login";
            alert("Success! But no role found. Create a document in Firestore 'users' with ID: " + user.uid);
        }

    } catch (error) {
        btn.disabled = false;
        btn.innerText = "Login";
        console.error("Login Error:", error.code);
        
        if (error.code === 'permission-denied') {
            alert("Database Error: Missing Permissions. Check your Firestore Security Rules.");
        } else {
            alert("Login Failed: " + error.message);
        }
    }
};
