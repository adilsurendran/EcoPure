import { useEffect, useState } from "react";
import { getDealerProfile, updateDealerProfile } from "../../api/dealer.api";
import { 
  Edit, 
  Save, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  User,
  Navigation
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

  const [originalForm, setOriginalForm] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  /* ======================
     Load Profile
  ====================== */
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getDealerProfile();
      const data = res.data;
      
      const profileData = {
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        lat: data.location?.lat || "",
        lng: data.location?.lng || "",
      };

      setForm(profileData);
      setOriginalForm(profileData);

      if (data.photo) {
        setPhotoPreview(`http://localhost:8000/uploads/dealer/${data.photo}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     Handlers
  ====================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit - restore original values
      setForm(originalForm);
      setPhotoFile(null);
      setPhotoPreview(originalForm.photo ? 
        `http://localhost:8000/uploads/dealer/${originalForm.photo}` : null);
    }
    setIsEditing(!isEditing);
  };

  /* ======================
     Submit
  ====================== */
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
      alert("Profile updated successfully");
      
      // Update original form
      setOriginalForm(form);
      setIsEditing(false);
      loadProfile();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ======================
     Loading State
  ====================== */
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Profile Card */}
        <div style={styles.profileCard}>
          {/* Header with Edit Toggle */}
          <div style={styles.header}>
            <h1 style={styles.title}>My Profile</h1>
            <button 
              onClick={handleEditToggle}
              style={isEditing ? styles.cancelButton : styles.editButton}
            >
              {isEditing ? (
                <>
                  <X size={18} style={{ marginRight: 6 }} />
                  Cancel
                </>
              ) : (
                <>
                  <Edit size={18} style={{ marginRight: 6 }} />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Avatar Section */}
            <div style={styles.avatarSection}>
              <div style={styles.avatarWrapper}>
                <img
                  src={photoPreview || "/default-avatar.png"}
                  alt="Profile"
                  style={styles.avatar}
                />
                {isEditing && (
                  <>
                    <label style={styles.photoUpload}>
                      <input
                        type="file"
                        onChange={handlePhotoChange}
                        accept="image/*"
                        style={{ display: "none" }}
                      />
                      <Edit size={20} />
                    </label>
                    <div style={styles.photoHint}>
                      Click to upload new photo
                    </div>
                  </>
                )}
              </div>
              
              <div style={styles.avatarInfo}>
                <h2 style={styles.name}>{form.name}</h2>
                <div style={styles.badge}>Dealer Account</div>
              </div>
            </div>

            {/* Profile Information */}
            <div style={styles.infoGrid}>
              {/* Email */}
              <div style={styles.infoCard}>
                <div style={styles.infoIcon}>
                  <Mail size={20} />
                </div>
                <div style={styles.infoContent}>
                  <label style={styles.infoLabel}>Email Address</label>
                  <div style={styles.infoValue}>
                    {isEditing ? (
                      <input
                        type="email"
                        value={form.email}
                        disabled
                        style={styles.input}
                      />
                    ) : (
                      <p>{form.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div style={styles.infoCard}>
                <div style={styles.infoIcon}>
                  <Phone size={20} />
                </div>
                <div style={styles.infoContent}>
                  <label style={styles.infoLabel}>Phone Number</label>
                  <div style={styles.infoValue}>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        style={styles.input}
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p>{form.phone || "Not provided"}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Name */}
              <div style={styles.infoCard}>
                <div style={styles.infoIcon}>
                  <User size={20} />
                </div>
                <div style={styles.infoContent}>
                  <label style={styles.infoLabel}>Full Name</label>
                  <div style={styles.infoValue}>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        style={styles.input}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p>{form.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div style={styles.infoCard}>
                <div style={styles.infoIcon}>
                  <MapPin size={20} />
                </div>
                <div style={styles.infoContent}>
                  <label style={styles.infoLabel}>Business Address</label>
                  <div style={styles.infoValue}>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        style={styles.textarea}
                        placeholder="Enter your business address"
                        rows="3"
                      />
                    ) : (
                      <p>{form.address || "Not provided"}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Coordinates */}
              <div style={styles.infoCard}>
                <div style={styles.infoIcon}>
                  <Navigation size={20} />
                </div>
                <div style={styles.infoContent}>
                  <label style={styles.infoLabel}>Location Coordinates</label>
                  <div style={styles.coordinateGrid}>
                    {isEditing ? (
                      <>
                        <div>
                          <label style={styles.coordinateLabel}>Latitude</label>
                          <input
                            type="number"
                            name="lat"
                            value={form.lat}
                            onChange={handleChange}
                            style={styles.coordinateInput}
                            placeholder="e.g., 40.7128"
                            step="any"
                          />
                        </div>
                        <div>
                          <label style={styles.coordinateLabel}>Longitude</label>
                          <input
                            type="number"
                            name="lng"
                            value={form.lng}
                            onChange={handleChange}
                            style={styles.coordinateInput}
                            placeholder="e.g., -74.0060"
                            step="any"
                          />
                        </div>
                      </>
                    ) : (
                      <div style={styles.coordinatesDisplay}>
                        <div style={styles.coordinateItem}>
                          <span style={styles.coordinateLabel}>Lat:</span>
                          <span>{form.lat || "Not set"}</span>
                        </div>
                        <div style={styles.coordinateItem}>
                          <span style={styles.coordinateLabel}>Lng:</span>
                          <span>{form.lng || "Not set"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button (Only in Edit Mode) */}
            {isEditing && (
              <div style={styles.actionBar}>
                <button 
                  type="submit" 
                  disabled={saving} 
                  style={styles.saveButton}
                >
                  {saving ? (
                    <>
                      <div style={styles.spinner}></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} style={{ marginRight: 8 }} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f7f0 0%, #e8f5e8 100%)",
    padding: "20px",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f7f0 0%, #e8f5e8 100%)",
  },
  loadingSpinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #e8f5e8",
    borderTop: "4px solid #2e7d32",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  loadingText: {
    color: "#2e7d32",
    fontSize: "16px",
    fontWeight: "500",
  },
  profileCard: {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(46, 125, 50, 0.08)",
    padding: "30px",
    marginTop: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e0e0e0",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1b5e20",
    margin: "0",
  },
  editButton: {
    display: "flex",
    alignItems: "center",
    background: "linear-gradient(135deg, #2e7d32, #4caf50)",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "50px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(46, 125, 50, 0.2)",
  },
  cancelButton: {
    display: "flex",
    alignItems: "center",
    background: "#f5f5f5",
    color: "#666",
    border: "1px solid #ddd",
    padding: "10px 20px",
    borderRadius: "50px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    marginBottom: "40px",
    padding: "20px",
    background: "#f9fdf9",
    borderRadius: "12px",
    border: "1px solid #e8f5e9",
  },
  avatarWrapper: {
    position: "relative",
    marginRight: "20px",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #2e7d32",
    boxShadow: "0 4px 12px rgba(46, 125, 50, 0.2)",
  },
  photoUpload: {
    position: "absolute",
    bottom: "0",
    right: "0",
    background: "#2e7d32",
    color: "white",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "2px solid white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  photoHint: {
    position: "absolute",
    bottom: "-25px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "12px",
    color: "#666",
    whiteSpace: "nowrap",
  },
  avatarInfo: {
    flex: "1",
  },
  name: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1b5e20",
    margin: "0 0 8px 0",
  },
  badge: {
    display: "inline-block",
    background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
    color: "#2e7d32",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  infoCard: {
    background: "#ffffff",
    border: "1px solid #e8f5e9",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    alignItems: "flex-start",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(46, 125, 50, 0.05)",
  },
  infoIcon: {
    background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
    color: "#2e7d32",
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "15px",
    flexShrink: "0",
  },
  infoContent: {
    flex: "1",
  },
  infoLabel: {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "6px",
  },
  infoValue: {
    fontSize: "16px",
    color: "#333",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "all 0.3s ease",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "all 0.3s ease",
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit",
  },
  coordinateGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginTop: "8px",
  },
  coordinateLabel: {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: "#666",
    marginBottom: "4px",
  },
  coordinateInput: {
    width: "100%",
    padding: "10px 12px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "all 0.3s ease",
    outline: "none",
    boxSizing: "border-box",
  },
  coordinatesDisplay: {
    display: "flex",
    gap: "20px",
  },
  coordinateItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  actionBar: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: "20px",
    borderTop: "1px solid #e0e0e0",
  },
  saveButton: {
    display: "flex",
    alignItems: "center",
    background: "linear-gradient(135deg, #2e7d32, #4caf50)",
    color: "white",
    border: "none",
    padding: "12px 30px",
    borderRadius: "50px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(46, 125, 50, 0.3)",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginRight: "8px",
  },
};

// Add CSS animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

// Add hover effects
styleSheet.insertRule(`
  .edit-button:hover, .save-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(46, 125, 50, 0.4);
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  .info-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.1);
    border-color: #c8e6c9;
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  input:focus, textarea:focus {
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }
`, styleSheet.cssRules.length);