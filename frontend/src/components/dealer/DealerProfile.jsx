import { useEffect, useState } from "react";
import { getDealerProfile, updateDealerProfile } from "../../api/dealer.api";
import "../styles/UserPremium.css";
import {
  Pencil,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  User,
  Navigation,
  Camera,
  Briefcase
} from "lucide-react";

export default function DealerProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    lat: "",
    lng: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const api = 'http://localhost:8000/uploads/dealer/';

  const loadProfile = async () => {
    try {
      const res = await getDealerProfile();
      const data = res.data;

      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        lat: data.location?.lat || "",
        lng: data.location?.lng || "",
      });

      if (data.photo) {
        setPhotoPreview(`${api}${data.photo}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load profile");
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
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      formData.append("lat", form.lat);
      formData.append("lng", form.lng);

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      await updateDealerProfile(formData);
      alert("Business profile updated successfully");
      setIsEditing(false);
      loadProfile();
    } catch (err) {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading business profile...</div>;

  return (
    <div className="user-premium-container">
      <div className="user-premium-header">
        <div className="user-header-title">
          <h1>Business Account</h1>
          <p>Manage your organizational identity and operational preferences</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="user-stat-card" style={{ maxWidth: '600px', width: '100%', flexDirection: 'column', alignItems: 'stretch', padding: '2.5rem', position: 'relative' }}>

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
                  src={photoPreview || `https://ui-avatars.com/api/?name=${form.name}&background=059669&color=fff`}
                  alt="Dealer"
                  style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: 'var(--user-shadow-md)' }}
                />
                {isEditing && (
                  <label className="icon-btn" style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'var(--user-primary)', color: 'white', cursor: 'pointer', boxShadow: 'var(--user-shadow-sm)' }}>
                    <Camera size={18} />
                    <input type="file" onChange={handlePhotoChange} style={{ display: 'none' }} accept="image/*" />
                  </label>
                )}
              </div>
              <p style={{ marginTop: '1rem', color: 'var(--user-text-main)', fontSize: '1.25rem', fontWeight: 700 }}>{form.name}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div className="user-field-group">
                <label><User size={14} style={{ marginRight: '6px' }} /> Business Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Legal business name"
                  required
                  disabled={!isEditing}
                  style={!isEditing ? { background: '#f8fafc', borderColor: 'transparent' } : {}}
                />
              </div>
              <div className="user-field-group">
                <label><Mail size={14} style={{ marginRight: '6px' }} /> Email Address</label>
                <input value={form.email} disabled style={{ background: '#f8fafc', cursor: 'not-allowed', borderColor: 'transparent' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div className="user-field-group">
                <label><Phone size={14} style={{ marginRight: '6px' }} /> Contact Number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Business phone"
                  required
                  disabled={!isEditing}
                  style={!isEditing ? { background: '#f8fafc', borderColor: 'transparent' } : {}}
                />
              </div>
            </div>

            <div className="user-field-group" style={{ marginTop: '1.5rem' }}>
              <label><MapPin size={14} style={{ marginRight: '6px' }} /> Business Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Complete business address..."
                rows={3}
                disabled={!isEditing}
                style={!isEditing ? { background: '#f8fafc', borderColor: 'transparent', resize: 'none' } : {}}
              />
            </div>

            <div className="user-field-group" style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ margin: 0 }}><Navigation size={14} style={{ marginRight: '6px' }} /> GPS Coordinates</label>
                {isEditing && (
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="user-btn-premium"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: '#eff6ff', color: '#0369a1', border: '1px solid #bae6fd' }}
                  >
                    <Navigation size={14} />
                    <span>Get Current Location</span>
                  </button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                <input
                  name="lat"
                  value={form.lat}
                  onChange={handleChange}
                  placeholder="Latitude"
                  disabled={!isEditing}
                  style={!isEditing ? { background: '#f8fafc', borderColor: 'transparent' } : {}}
                />
                <input
                  name="lng"
                  value={form.lng}
                  onChange={handleChange}
                  placeholder="Longitude"
                  disabled={!isEditing}
                  style={!isEditing ? { background: '#f8fafc', borderColor: 'transparent' } : {}}
                />
              </div>
            </div>

            {isEditing && (
              <button type="submit" className="user-btn-premium user-btn-primary" disabled={saving} style={{ width: '100%', justifyContent: 'center', marginTop: '2rem' }}>
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
