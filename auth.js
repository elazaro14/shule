import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Exporting to window so index.html can call it
window.login = async () => {
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value;
    const loginBtn = document.querySelector('button');

    if (!email || !pass) {
        alert("Please enter both email and password.");
        return;
    }

    loginBtn.disabled = true;
    loginBtn.innerText = "Checking...";

    try {
        // 1. Authenticate with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // 2. Update Last Login time in Firestore
        const now = new Date().toLocaleString('en-GB');
        const userRef = doc(db, "users", user.uid);
        
        // Check if user document exists before updating
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            await updateDoc(userRef, { lastLogin: now });
            window.location.href = "dashboard.html"; 
        } else {
            // If user is in Auth but not in Firestore 'users' collection
            alert("Error: Your account exists but no role is assigned in the database.");
            loginBtn.disabled = false;
            loginBtn.innerText = "Login";
        }

    } catch (error) {
        console.error("Login Error:", error.code);
        loginBtn.disabled = false;
        loginBtn.innerText = "Login";
        
        // Specific error messages
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            alert("Email or Password is incorrect!");
        } else {
            alert("System Error: " + error.message);
        }
    }
};
