import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import '../css/signup.css';
import Toast from "../components/toast";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [toast, setToast] = useState({ visible: false, type: "success", message: "" });
  const toastTimeout = useRef(null);

  const showToast = (type, message) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ visible: true, type, message });
    toastTimeout.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 3000);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    const { name, email, password, confirm } = formData;

    if (!name || !email || !password || !confirm) {
      showToast("error", "All fields are required");
      return;
    }
    if (password.length < 6) {
      showToast("error", "Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      showToast("error", "Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      await updateProfile(firebaseUser, { displayName: name });

      const role = email === "khemet2026@gmail.com" ? "admin" : "user";
      const newUser = {
        name,
        email,
        role,
        location: "",
        bio: "",
        contributions: [],
        savedTrips: [],
        favorites: [],
        createdAt: Date.now(),
      };

      await setDoc(doc(db, "users", firebaseUser.uid), newUser);

      login({ ...newUser, uid: firebaseUser.uid });
      showToast("success", "Account created successfully");
      setTimeout(() => navigate(role === "admin" ? "/dashboard" : "/"), 900);

    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showToast("error", "User already exists");
      } else {
        showToast("error", "Something went wrong, try again");
      }
    }
  };

  return (
    <main className="signup-main">
      <Toast message={toast.message} visible={toast.visible} type={toast.type} />
      <div className="Signup container" id="sign">
        <div className="section section-sign">
          <div className="section-content">
            <h1><Link to="/">KHEMET</Link></h1>
            <h2>Start your journey with Khemet</h2>
            <h3>Save places and build your own map of discovery.</h3>
            <div className="section-deco">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <div className="sign">
          <h2>Create Account</h2>
          <div className="form-body">
            <div className="signup-field">
              <input type="text" name="name" id="signName" value={formData.name} onChange={handleChange} placeholder=" " />
              <label htmlFor="signName">Username</label>
            </div>
            <div className="signup-field">
              <input type="email" name="email" id="signEmail" value={formData.email} onChange={handleChange} placeholder=" " />
              <label htmlFor="signEmail">Email</label>
            </div>
            <div className="signup-field">
              <input type="password" name="password" id="signPass" value={formData.password} onChange={handleChange} placeholder=" " />
              <label htmlFor="signPass">Password</label>
            </div>
            <div className="signup-field">
              <input type="password" name="confirm" id="signConfirm" value={formData.confirm} onChange={handleChange} placeholder=" " />
              <label htmlFor="signConfirm">Confirm Password</label>
            </div>
            <button type="button" onClick={handleSignup}>Sign up</button>
            <p>Already have an account? <Link to="/login">Log in</Link></p>
          </div>
        </div>
      </div>
    </main>
  );
}