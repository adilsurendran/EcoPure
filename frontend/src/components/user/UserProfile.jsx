import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../../api/user.api";
import "../styles/UserPremium.css";
import { User, Phone, MapPin, Mail, Camera, Save, Map, Pencil, X } from "lucide-react";

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pin: "",
    lat: "",
    lng: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getUserProfile();
      const data = res.data;

      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        pin: data.pin || "",
        lat: data.location?.lat || "",
        lng: data.location?.lng || "",
      });

      if (data.photo) {
        setPhotoPreview(`http://localhost:8000/uploads/user/${data.photo}`);
      }
    } catch {
      console.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm({
            ...form,
            lat: position.coords.latitude.toFixed(6),
            lng: position.coords.longitude.toFixed(6)
          });
          alert("Location captured successfully!");
        },
        (error) => {
          alert("Unable to retrieve location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("phone", form.phone);
      fd.append("address", form.address);
      fd.append("pin", form.pin);
      fd.append("lat", form.lat);
      fd.append("lng", form.lng);

      if (photoFile) {
        fd.append("photo", photoFile);
      }

      await updateUserProfile(fd);
      alert("Profile updated successfully!");
      setIsEditing(false);
      loadProfile();
    } catch {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading profile...</div>;

  return (
    <div className="user-premium-container">
      <div className="user-premium-header">
        <div className="user-header-title">
          <h1>My Account</h1>
          <p>Manage your personal information and preferences</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="user-form-card" style={{ maxWidth: '600px', boxShadow: 'var(--user-shadow-md)', animation: 'none', position: 'relative' }}>

          <button
            type="button"
            className="icon-btn"
            style={{ position: 'absolute', top: '20px', right: '20px', background: isEditing ? '#fef2f2' : '#f0fdf4', color: isEditing ? '#ef4444' : '#059669', zIndex: 10 }}
            onClick={() => setIsEditing(!isEditing)}
            title={isEditing ? "Cancel Editing" : "Edit Profile"}
          >
            {isEditing ? <X size={18} /> : <Pencil size={18} />}
          </button>

          <form onSubmit={handleSubmit}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={photoPreview || "https://ui-avatars.com/api/?name=" + form.name + "&background=059669&color=fff"}
                  alt="User"
                  style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: 'var(--user-shadow-md)' }}
                />
                {isEditing && (
                  <label className="icon-btn" style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'var(--user-primary)', color: 'white', cursor: 'pointer', boxShadow: 'var(--user-shadow-sm)' }}>
                    <Camera size={18} />
                    <input type="file" onChange={handlePhotoChange} style={{ display: 'none' }} />
                  </label>
                )}
              </div>
              <h3 style={{ marginTop: '1rem', color: 'var(--user-text-main)' }}>{form.name}</h3>
              <p style={{ color: 'var(--user-text-muted)', fontSize: '0.85rem' }}>{form.email}</p>
            </div>

            <div className="user-form-row">
              <div className="user-field-group">
                <label><User size={14} style={{ marginRight: '6px' }} /> Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  disabled={!isEditing}
                  style={!isEditing ? { background: '#f8fafc', border: '1px transparent' } : {}}
                />
              </div>
              <div className="user-field-group">
                <label><Mail size={14} style={{ marginRight: '6px' }} /> Email Address</label>
                <input value={form.email} disabled style={{ background: '#f8fafc', cursor: 'not-allowed', border: '1px transparent' }} />
              </div>
            </div>

            <div className="user-form-row">
              <div className="user-field-group">
                <label><Phone size={14} style={{ marginRight: '6px' }} /> Phone Number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  required
                  disabled={!isEditing}
                  style={!isEditing ? { background: '#f8fafc', border: '1px transparent' } : {}}
                />
              </div>
              <div className="user-field-group">
                <label><MapPin size={14} style={{ marginRight: '6px' }} /> PIN Code</label>
                <input
                  name="pin"
                  value={form.pin}
                  onChange={handleChange}
                  placeholder="6-digit PIN"
                  disabled={!isEditing}
                  style={!isEditing ? { background: '#f8fafc', border: '1px transparent' } : {}}
                />
              </div>
            </div>

            <div className="user-field-group">
              <label><MapPin size={14} style={{ marginRight: '6px' }} /> Residential Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Full address for pickups..."
                rows={3}
                disabled={!isEditing}
                style={!isEditing ? { background: '#f8fafc', border: '1px transparent', resize: 'none' } : {}}
              />
            </div>

            <div className="user-field-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ margin: 0 }}><Map size={14} style={{ marginRight: '6px' }} /> Precise Location (GPS)</label>
                {isEditing && (
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="user-btn-premium"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: '#f0fdf4', color: '#059669', border: '1px solid #bbf7d0' }}
                  >
                    <Map size={14} />
                    <span>Get Current Location</span>
                  </button>
                )}
              </div>
              <div className="user-form-row">
                <input
                  name="lat"
                  value={form.lat}
                  onChange={handleChange}
                  placeholder="Latitude"
                  disabled={!isEditing}
                  style={!isEditing ? { background: '#f8fafc', border: '1px transparent' } : {}}
                />
                <input
                  name="lng"
                  value={form.lng}
                  onChange={handleChange}
                  placeholder="Longitude"
                  disabled={!isEditing}
                  style={!isEditing ? { background: '#f8fafc', border: '1px transparent' } : {}}
                />
              </div>
            </div>

            {isEditing && (
              <button type="submit" className="user-btn-premium user-btn-primary" disabled={saving} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                {saving ? "Saving Changes..." : (
                  <>
                    <Save size={18} />
                    <span>Update Profile</span>
                  </>
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
