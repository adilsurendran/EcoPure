import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/user.api";
import "../styles/auth.css";

export default function UserRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pin: "",
    lat: "",
    lng: "",
    password: "",
    confirmPassword: "",
  });

  const [photo, setPhoto] = useState(null);
  const [useLocation, setUseLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📍 Get current location
  const handleLocationCheck = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setUseLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        }));
      },
      () => {
        setUseLocation(false);
        setError("Location access denied. Please enter manually.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔍 Strict field validation
    const requiredFields = ["name", "email", "phone", "address", "pin", "lat", "lng", "password", "confirmPassword"];
    for (const field of requiredFields) {
      if (!form[field] || form[field].trim() === "") {
        setError(`Please fill in the ${field} field`);
        return;
      }
    }

    // 📧 Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // 📱 Phone validation (Exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    // 📍 PIN validation (Exactly 6 digits)
    const pinRegex = /^\d{6}$/;
    if (!pinRegex.test(form.pin)) {
      setError("Please enter a valid 6-digit PIN code");
      return;
    }

    if (!photo) {
      setError("Please upload a photo");
      return;
    }

    // 🔐 Password validation
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("email", form.email);
      data.append("phone", form.phone);
      data.append("address", form.address);
      data.append("pin", form.pin);
      data.append("lat", form.lat);
      data.append("lng", form.lng);
      data.append("password", form.password);

      if (photo) data.append("photo", photo);

      await registerUser(data);

      alert("User registered successfully");

      // Clear form and navigate
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        pin: "",
        lat: "",
        lng: "",
        password: "",
        confirmPassword: "",
      });
      setPhoto(null);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-left">
          <h1>EcoPure</h1>
          <p>User Registration</p>
        </div>

        <div className="auth-right">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p className="subtitle">Register as a Citizen</p>
          </div>

          {error && <div className="error-box">{error}</div>}

          <div className="form-scroll-container">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input name="email" value={form.email} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input name="address" value={form.address} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>PIN Code</label>
                <input name="pin" value={form.pin} onChange={handleChange} />
              </div>

              {/* 🔐 PASSWORD */}
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* 📍 LOCATION */}
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={useLocation}
                    onChange={handleLocationCheck}
                  />
                  Use current location
                </label>
              </div>

              <div className="form-group">
                <label>Latitude</label>
                <input
                  name="lat"
                  value={form.lat}
                  onChange={handleChange}
                  placeholder="Auto-filled or manual"
                />
              </div>

              <div className="form-group">
                <label>Longitude</label>
                <input
                  name="lng"
                  value={form.lng}
                  onChange={handleChange}
                  placeholder="Auto-filled or manual"
                />
              </div>

              {/* 📷 PHOTO */}
              <div className="form-group">
                <label>Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
              </div>

              <button className="submit-btn" disabled={loading}>
                {loading ? "Submitting..." : "Register"}
              </button>

              <div className="auth-footer">
                <span>Already have an account?</span>
                <Link to="/login" className="auth-link">Login here</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
