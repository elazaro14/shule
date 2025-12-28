import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.login = async () => {
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value.trim();
    const btn = document.querySelector('button');

    if (!email || !pass) {
        alert("Please enter both email and password.");
        return;
    }

    btn.disabled = true;
    btn.innerText = "Connecting...";

    try {
        // Step 1: Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // Step 2: Fetch Role from Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            // Step 3: Update login timestamp and redirect
            await updateDoc(userRef, {
                lastLogin: new Date().toLocaleString('en-GB')
            });
            window.location.href = "dashboard.html";
        } else {
            btn.disabled = false;
            btn.innerText = "Login";
            alert("Success, but no role found! Create a document in 'users' collection with ID: " + user.uid);
        }
    } catch (error) {
        btn.disabled = false;
        btn.innerText = "Login";
        console.error("Login Error:", error.code);
        alert("Login Failed: " + error.message);
    }
};
