import React, { useState } from "react";
import { registerUser } from "../../api/user.api";
import "../styles/auth.css";

export default function UserRegister() {
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

      const res = await registerUser(data);
      console.log(res);

      alert("User registered successfully");
    } catch (err) {
      console.log(err);
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
          <h2>Create Account</h2>
          <p className="subtitle">Register as a Citizen</p>

          {error && <div className="error-box">{error}</div>}

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
              <label>
                <input
                  type="checkbox"
                  checked={useLocation}
                  onChange={handleLocationCheck}
                  style={{ marginRight: "8px" }}
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
                placeholder="Auto-filled or enter manually"
              />
            </div>

            <div className="form-group">
              <label>Longitude</label>
              <input
                name="lng"
                value={form.lng}
                onChange={handleChange}
                placeholder="Auto-filled or enter manually"
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
          </form>
        </div>
      </div>
    </div>
  );
}
