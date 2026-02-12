import { useEffect, useState } from "react";
import {
  addWorker,
  fetchWorkers,
  toggleWorkerStatus,
} from "../../api/admin.api";
import {
  HardHat,
  UserPlus,
  Search,
  Phone,
  Mail,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserMinus,
  X,
  Target,
  User
} from "lucide-react";
import "./styles/AdminTable.css";

export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    password: "",
    name: "",
    phone: "",
    email: "",
    age: "",
    gender: "male",
  });

  /* ---------------- LOAD WORKERS ---------------- */
  const loadWorkers = async () => {
    setLoading(true);
    try {
      const res = await fetchWorkers();
      setWorkers(res.data);
    } catch (err) {
      console.error("Failed to load workers", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- TOGGLE STATUS (OPTIMISTIC) ---------------- */
  const handleToggle = async (authId) => {
    try {
      await toggleWorkerStatus(authId);

      // Optimistic UI update
      setWorkers((prev) =>
        prev.map((worker) =>
          worker.authId?._id === authId
            ? {
              ...worker,
              authId: {
                ...worker.authId,
                isActive: !worker.authId.isActive,
              },
            }
            : worker
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  /* ---------------- ADD WORKER ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔍 Strict field validation
    const requiredFields = ["name", "phone", "password", "email", "age"];
    for (const field of requiredFields) {
      if (!form[field] || String(form[field]).trim() === "") {
        alert(`Please fill in the ${field} field`);
        return;
      }
    }

    // 📧 Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // 📱 Phone validation (Exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    // 🔐 Password validation
    if (form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      await addWorker(form);
      setShowModal(false);
      setForm({
        password: "",
        name: "",
        phone: "",
        email: "",
        age: "",
        gender: "male",
      });
      loadWorkers();
    } catch (err) {
      console.error("Failed to add worker", err);
    }
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  const filteredWorkers = workers.filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.phone.includes(searchTerm)
  );

  if (loading) return (
    <div className="admin-page-container">
      <div className="loading-state">
        <div className="loader"></div>
        <p>Accessing Worker Records...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-page-container">
      {/* HEADER */}
      <div className="page-header">
        <div className="header-content">
          <h1>Workers Management</h1>
          <p>Supervise and coordinate your technical field team.</p>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search name, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="action-btn btn-unblock"
            onClick={() => setShowModal(true)}
          >
            <UserPlus size={22} />
            <span>Add Worker</span>
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <HardHat size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Field Staff</span>
            <span className="stat-value">{workers.length} Members</span>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Field Worker</th>
                <th>Contact Info</th>
                <th>Details</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredWorkers.map((worker) => {
                const isActive = worker.authId?.isActive;

                return (
                  <tr key={worker._id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar" style={{ borderRadius: '12px' }}>
                          {worker.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                          <span className="user-name">{worker.name}</span>
                          <span className="user-email">WID: {worker._id.slice(-8).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div className="contact-item">
                          <Phone size={14} />
                          <span>{worker.phone}</span>
                        </div>
                        <div className="contact-item" style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                          <Mail size={14} />
                          <span>{worker.email || "No email"}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span className="username-tag">{worker.gender}</span>
                        <span className="username-tag">{worker.age} Yrs</span>
                      </div>
                    </td>
                    <td>
                      {isActive ? (
                        <span className="badge badge-active">
                          <ShieldCheck size={14} style={{ marginRight: '6px' }} />
                          Verified
                        </span>
                      ) : (
                        <span className="badge badge-blocked">
                          <ShieldAlert size={14} style={{ marginRight: '6px' }} />
                          Disabled
                        </span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          className={`action-btn ${isActive ? "btn-block" : "btn-unblock"}`}
                          onClick={() => handleToggle(worker.authId._id)}
                        >
                          {isActive ? <><UserMinus size={16} /> Block</> : <><UserCheck size={16} /> Approve</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredWorkers.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '5rem' }}>
                    <div style={{ opacity: 0.5 }}>
                      <HardHat size={48} style={{ marginBottom: '1.5rem', color: 'var(--dark-green)' }} />
                      <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--deep-green)' }}>No workers found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD WORKER MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="premium-modal">
            <div className="modal-header">
              <h2>Register New Worker</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="premium-form">
                  <div className="form-group">
                    <label>Worker Details</label>
                    <input
                      className="premium-input"
                      placeholder="Full Name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        className="premium-input"
                        placeholder="Mobile"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        className="premium-input"
                        type="password"
                        placeholder="Security Key"
                        required
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      className="premium-input"
                      placeholder="worker@ecopure.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Age</label>
                      <input
                        className="premium-input"
                        type="number"
                        placeholder="Years"
                        value={form.age}
                        onChange={(e) => setForm({ ...form, age: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <select
                        className="premium-select"
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
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
                  Save Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

