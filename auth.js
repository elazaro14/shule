import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;
    const snap = await getDoc(doc(db, "users", uid));
    const role = snap.data().role;
    sessionStorage.setItem("role", role);
    sessionStorage.setItem("user", email);
    window.location = "dashboard.html";
  } catch (e) {
    alert("Login failed: " + e.message);
  }
};
