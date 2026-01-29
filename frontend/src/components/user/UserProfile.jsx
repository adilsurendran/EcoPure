import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../../api/user.api";


export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        setPhotoPreview(
          `http://localhost:8000/uploads/user/${data.photo}`
        );
      }
    } catch {
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
      alert("Profile updated");
      loadProfile();
    } catch {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2>My Profile</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.avatarWrap}>
          <img
            src={photoPreview || "/default-avatar.png"}
            alt="User"
            style={styles.avatar}
          />
          <input type="file" onChange={handlePhotoChange} />
        </div>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />

        <input value={form.email} disabled />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
        />

        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
        />

        <input
          name="pin"
          value={form.pin}
          onChange={handleChange}
          placeholder="PIN Code"
        />

        <div style={{ display: "flex", gap: 10 }}>
          <input
            name="lat"
            value={form.lat}
            onChange={handleChange}
            placeholder="Latitude"
          />
          <input
            name="lng"
            value={form.lng}
            onChange={handleChange}
            placeholder="Longitude"
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}

/* =====================
   Styles
===================== */

const styles = {
  container: {
    maxWidth: 420,
    margin: "40px auto",
    padding: 20,
    border: "1px solid #ddd",
    borderRadius: 10,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  avatarWrap: {
    textAlign: "center",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: 8,
  },
};
