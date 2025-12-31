import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // Record last login in Firestore
        const now = new Date().toLocaleString('en-GB');
        try {
            await updateDoc(doc(db, "users", user.uid), {
                lastLogin: now
            });
        } catch (dbError) {
            console.warn("User document not found in Firestore. Logging in anyway...");
        }

        window.location.href = "dashboard.html"; 

    } catch (error) {
        btn.disabled = false;
        btn.innerText = "Login";
        
        console.error("Firebase Error:", error.code);

        // Modern Firebase error handling
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
            alert("Invalid email or password.");
        } else if (error.code === 'auth/api-key-expired') {
            alert("System Error: API Key expired. Please contact the administrator.");
        } else {
            alert("Login Failed: " + error.message);
        }
    }
};
