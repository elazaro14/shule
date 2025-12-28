import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.login = async () => {
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value.trim();

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // This is where 'Missing Permissions' usually happens:
        const userRef = doc(db, "users", user.uid); 
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            window.location.href = "dashboard.html";
        } else {
            alert("No user record found in database for UID: " + user.uid);
        }
    } catch (error) {
        // If the error is 'permission-denied', it's a Rules/UID issue
        alert("Error: " + error.message);
    }
};
