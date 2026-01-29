import { useEffect, useState } from "react";
import { createPickupRequest } from "../../api/pickup.api";

export default function PickupRequest({ onClose }) {
  const [form, setForm] = useState({
    wasteType: "plastic",
    address: "",
    lat: "",
    lng: "",
  });

  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState("");

  /* ---------------- GET CURRENT LOCATION ---------------- */
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

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await createPickupRequest({
      wasteType: form.wasteType,
      address: form.address,
      location: {
        lat: Number(form.lat),
        lng: Number(form.lng),
      },
    });
console.log(res);

    onClose();
  };

  return (
    <div className="pickup-form">
      <div className="pickup-card-form">
        <h2>Create Waste Pickup Request</h2>

        <form onSubmit={handleSubmit}>
          {/* Waste Type */}
          <label>Waste Type</label>
          <select
            value={form.wasteType}
            onChange={(e) =>
              setForm({ ...form, wasteType: e.target.value })
            }
          >
            <option value="plastic">Plastic</option>
            <option value="organic">Organic</option>
            <option value="e-waste">E-Waste</option>
            <option value="metal">Metal</option>
            <option value="mixed">Mixed</option>
          </select>

          {/* Address */}
          <label>Pickup Address</label>
          <textarea
            placeholder="Enter complete pickup address"
            required
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />

          {/* Location */}
          <div className="location-header">
            <label>Pickup Location</label>
            <button
              type="button"
              className="btn btn-outline"
              onClick={getCurrentLocation}
              disabled={locLoading}
            >
              {locLoading ? "Detecting..." : "Use Current Location"}
            </button>
          </div>

          {locError && (
            <p className="error-text">{locError}</p>
          )}

          <div className="location-grid">
            <input
              placeholder="Latitude"
              required
              value={form.lat}
              onChange={(e) =>
                setForm({ ...form, lat: e.target.value })
              }
            />

            <input
              placeholder="Longitude"
              required
              value={form.lng}
              onChange={(e) =>
                setForm({ ...form, lng: e.target.value })
              }
            />
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button className="btn btn-primary">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
