import { useEffect, useState } from "react";
import { createWastePost, deleteWastePost, getAdminWastePosts, updateWastePost } from "../../api/admin.api";
import {
  Plus,
  Trash2,
  Edit3,
  Search,
  Package,
  Weight,
  IndianRupee,
  FileText,
  X,
  Image as ImageIcon,
  CheckCircle,
  Archive
} from "lucide-react";
import "./styles/AdminTable.css";

export default function AdminWaste() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    wasteType: "",
    totalWeight: "",
    pricePerKg: "",
    description: "",
  });

  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await getAdminWastePosts();
      console.log(res.data);
      
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load waste posts", err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingPost(null);
    setForm({
      wasteType: "",
      totalWeight: "",
      pricePerKg: "",
      description: "",
    });
    setPhoto(null);
    setShowModal(true);
  };

  const openEdit = (post) => {
    setEditingPost(post);
    setForm({
      wasteType: post.wasteType,
      totalWeight: post.totalWeight,
      pricePerKg: post.pricePerKg,
      description: post.description,
    });
    setPhoto(null);
    setShowModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (photo) fd.append("photo", photo);

    try {
      if (editingPost) {
        await updateWastePost(editingPost._id, fd);
      } else {
        await createWastePost(fd);
      }
      setShowModal(false);
      loadPosts();
    } catch (err) {
      console.error("Submission failed", err);
    }
  };

  const remove = async (id) => {
    if (window.confirm("Are you sure you want to remove this waste category from inventory?")) {
      try {
        await deleteWastePost(id);
        loadPosts();
      } catch (err) {
        console.error("Deletion failed", err);
      }
    }
  };

  const filteredPosts = posts.filter(p =>
    p.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInventoryWeight = posts.reduce((acc, p) => acc + (Number(p.totalWeight) || 0), 0);

  if (loading && posts.length === 0) return (
    <div className="admin-page-container">
      <div className="loading-state">
        <div className="loader"></div>
        <p>Analyzing Waste Inventory...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-page-container">
      {/* HEADER */}
      <div className="page-header">
        <div className="header-content">
          <h1>Inventory Management</h1>
          <p>Manage and price waste categories for dealer procurement.</p>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="action-btn btn-unblock"
            onClick={openAdd}
          >
            <Plus size={22} />
            <span>List Waste</span>
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <Package size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Stocked Categories</span>
            <span className="stat-value">{posts.length} Active Listings</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <Weight size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Volume</span>
            <span className="stat-value">{totalInventoryWeight} kg Handled</span>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Waste Category</th>
                <th>Pricing Structure</th>
                <th>Weight Metrics</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPosts.map((p) => {
                const isOutOfStock = p.availableWeight <= 0;

                return (
                  <tr key={p._id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #059669, #064e3b)' }}>
                          {p.photo ? (
                            <img
                              src={`http://localhost:8000/uploads/waste/${p.photo}`}
                              alt={p.wasteType}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                            />
                          ) : (
                            <Archive size={20} />
                          )}
                        </div>
                        <div className="user-details">
                          <span className="user-name">{p.wasteType}</span>
                          <span className="user-email" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.description || "No specific details provided."}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-item">
                        <IndianRupee size={14} style={{ color: 'var(--primary-green)' }} />
                        <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{p.pricePerKg}</span>
                        <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>/ kg</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div className="contact-item">
                          <Weight size={14} />
                          <span style={{ fontWeight: 700 }}>{p.availableWeight} kg</span>
                          <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>(Available)</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Total Entry: {p.totalWeight} kg</div>
                      </div>
                    </td>
                    <td>
                      {isOutOfStock ? (
                        <span className="badge badge-blocked">Out of Stock</span>
                      ) : (
                        <span className="badge badge-active">In Stock</span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button className="action-btn" style={{ background: '#f1f5f9', color: 'var(--deep-green)' }} onClick={() => openEdit(p)}>
                          <Edit3 size={16} />
                        </button>
                        <button className="action-btn btn-block" onClick={() => remove(p._id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '5rem' }}>
                    <div style={{ opacity: 0.5 }}>
                      <Archive size={48} style={{ marginBottom: '1.5rem', color: 'var(--dark-green)' }} />
                      <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--deep-green)' }}>Inventory is empty</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="premium-modal">
            <div className="modal-header">
              <h2>{editingPost ? "Refine Inventory" : "New Waste Listing"}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submit} className="premium-form">
              <div className="modal-body">
                <div className="premium-form">
                  <div className="form-group">
                    <label>Category Details</label>
                    <input
                      className="premium-input"
                      placeholder="e.g. Plastic Bottles, Scrap Metal"
                      required
                      value={form.wasteType}
                      onChange={(e) => setForm({ ...form, wasteType: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Total Logistics (kg)</label>
                      <input
                        className="premium-input"
                        type="number"
                        placeholder="Quantity"
                        required
                        value={form.totalWeight}
                        onChange={(e) => setForm({ ...form, totalWeight: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Market Price (₹)</label>
                      <input
                        className="premium-input"
                        type="number"
                        placeholder="Price per Kg"
                        required
                        value={form.pricePerKg}
                        onChange={(e) => setForm({ ...form, pricePerKg: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Internal Description</label>
                    <textarea
                      className="premium-input"
                      style={{ resize: 'vertical', paddingTop: '10px' }}
                      placeholder="Provide additional details for dealers..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Visual Reference</label>
                    <div className="file-upload-mock" style={{ position: 'relative' }}>
                      <input
                        type="file"
                        id="waste-photo"
                        style={{ display: 'none' }}
                        onChange={(e) => setPhoto(e.target.files[0])}
                      />
                      <label
                        htmlFor="waste-photo"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '1rem',
                          background: '#f8fafc',
                          border: '2px dashed #cbd5e1',
                          borderRadius: '14px',
                          cursor: 'pointer',
                          color: '#64748b'
                        }}
                      >
                        <ImageIcon size={20} />
                        <span style={{ textTransform: 'none', letterSpacing: 'normal' }}>
                          {photo ? photo.name : "Capture or Upload Image"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="action-btn btn-block"
                  style={{ background: '#f1f5f9', color: '#64748b', boxShadow: 'none' }}
                  onClick={() => setShowModal(false)}
                >
                  Discard
                </button>
                <button type="submit" className="action-btn btn-unblock">
                  <CheckCircle size={18} />
                  {editingPost ? "Update Record" : "Deploy Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
