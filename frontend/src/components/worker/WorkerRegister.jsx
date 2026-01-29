import React, { useState } from "react";
import { registerWorker } from "../../api/worker.api";
import "../styles/auth.css";

export default function WorkerRegister() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    lat: "",
    lng: "",
  });

  const [proof, setProof] = useState(null);
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
    setLoading(true);
    setError("");

    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("phone", form.phone);
      data.append("email", form.email);
      data.append("age", form.age);
      data.append("gender", form.gender);
      data.append("lat", form.lat);
      data.append("lng", form.lng);

      if (proof) data.append("proof", proof);
      if (photo) data.append("photo", photo);

      await registerWorker(data);

      alert("Worker registered successfully (pending admin approval)");
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
          <p>Worker Registration</p>
        </div>

        <div className="auth-right">
          <h2>Join as Worker</h2>
          <p className="subtitle">Register to start working with EcoPure</p>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
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

            {/* 📄 PROOF */}
            <div className="form-group">
              <label>ID Proof (Aadhaar / ID)</label>
              <input
                type="file"
                onChange={(e) => setProof(e.target.files[0])}
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
