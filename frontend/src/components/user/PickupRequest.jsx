import { useState } from "react";
import { createPickupRequest } from "../../api/pickup.api";
import "../styles/UserPremium.css";
import { MapPin, Navigation, Send, X } from "lucide-react";

export default function PickupRequest({ onClose }) {
  const [form, setForm] = useState({
    wasteType: "plastic",
    address: "",
    lat: "",
    lng: "",
  });

  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocError("Geolocation not supported");
      return;
    }

    setLocLoading(true);
    setLocError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        }));
        setLocLoading(false);
      },
      () => {
        setLocError("Location permission denied");
        setLocLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createPickupRequest({
        wasteType: form.wasteType,
        address: form.address,
        location: {
          lat: Number(form.lat),
          lng: Number(form.lng),
        },
      });
      onClose();
    } catch (err) {
      alert("Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="user-form-overlay">
      <div className="user-form-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2>New Pickup</h2>
            <p className="subtitle" style={{ margin: 0 }}>Schedule a waste collection</p>
          </div>
          <button onClick={onClose} className="icon-btn" style={{ background: '#f8fafc' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="user-field-group">
            <label>What kind of waste is it?</label>
            <select
              value={form.wasteType}
              onChange={(e) => setForm({ ...form, wasteType: e.target.value })}
            >
              <option value="plastic">Plastic</option>
              <option value="organic">Organic</option>
              <option value="e-waste">E-Waste</option>
              <option value="metal">Metal</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <div className="user-field-group">
            <label>Pickup Location Address</label>
            <textarea
              placeholder="House #, Street, City..."
              required
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div className="user-field-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ margin: 0 }}>Coordinates</label>
              <button
                type="button"
                className="user-btn-premium"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd' }}
                onClick={getCurrentLocation}
                disabled={locLoading}
              >
                <Navigation size={14} />
                {locLoading ? "Detecting..." : "Auto-detect"}
              </button>
            </div>
            {locError && <p className="error-text" style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '-0.25rem', marginBottom: '0.5rem' }}>{locError}</p>}

            <div className="user-form-row">
              <input
                placeholder="Latitude"
                required
                value={form.lat}
                onChange={(e) => setForm({ ...form, lat: e.target.value })}
              />
              <input
                placeholder="Longitude"
                required
                value={form.lng}
                onChange={(e) => setForm({ ...form, lng: e.target.value })}
              />
            </div>
          </div>

          <div className="user-form-actions">
            <button
              type="button"
              className="btn-secondary-user"
              onClick={onClose}
            >
              Cancel
            </button>

            <button className="user-btn-premium user-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : (
                <>
                  <Send size={18} />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
