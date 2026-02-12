import { useEffect, useState } from "react";
import { acceptDirectRequest, getAllDirectRequests, rejectDirectRequest } from "../../api/admin.api";
import {
  Store,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Archive,
  Weight,
  IndianRupee,
  Calendar,
  X,
  Check,
  Phone,
  ArrowRight
} from "lucide-react";
import "./styles/AdminTable.css";

export default function AdminDirectRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await getAllDirectRequests();
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to load requests", err);
    } finally {
      setLoading(false);
    }
  };

  const accept = async (id) => {
    if (!window.confirm("Accept this direct procurement offer?")) return;
    try {
      await acceptDirectRequest(id);
      loadRequests();
    } catch (err) {
      console.error("Acceptance failed", err);
    }
  };

  const reject = async (id) => {
    if (!window.confirm("Reject this direct procurement offer?")) return;
    try {
      await rejectDirectRequest(id);
      loadRequests();
    } catch (err) {
      console.error("Rejection failed", err);
    }
  };

  const filteredRequests = requests.filter(r =>
    r.dealerId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.wasteType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const totalVolume = requests.reduce((acc, r) => acc + (Number(r.quantityKg) || 0), 0);

  if (loading && requests.length === 0) return (
    <div className="admin-page-container">
      <div className="loading-state">
        <div className="loader"></div>
        <p>Analyzing Direct Market Demands...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-page-container">
      {/* HEADER */}
      <div className="page-header">
        <div className="header-content">
          <h1>Direct Procurement</h1>
          <p>Manage direct waste buy-back offers from registered dealers.</p>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search offers or partners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <ArrowRight size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending Offers</span>
            <span className="stat-value">{pendingCount} New Proposals</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <Weight size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Volume Offer</span>
            <span className="stat-value">{totalVolume} kg Committed</span>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Partner Profile</th>
                <th>Offered Asset</th>
                <th>Valuation</th>
                <th>Status & Date</th>
                <th style={{ textAlign: 'right' }}>Market Control</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((r) => {
                const statusBadgeClass = {
                  pending: 'badge-blocked',
                  accepted: 'badge-active',
                  rejected: 'badge-dark',
                  completed: 'badge-active'
                }[r.status] || 'badge-active';

                return (
                  <tr key={r._id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
                          <Store size={20} />
                        </div>
                        <div className="user-details">
                          <span className="user-name">{r.dealerId?.name}</span>
                          <div className="contact-item" style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                            <Phone size={12} />
                            <span>{r.dealerId?.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-item">
                        <Archive size={16} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span className="username-tag" style={{ background: '#f8fafc', color: 'var(--deep-green)', border: '1px solid #e2e8f0' }}>
                            {r.wasteType}
                          </span>
                          {r.description && (
                            <span style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '4px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {r.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div className="contact-item">
                          <Weight size={14} />
                          <span style={{ fontWeight: 700 }}>{r.quantityKg} kg</span>
                        </div>
                        <div className="contact-item" style={{ fontSize: '0.85rem' }}>
                          <IndianRupee size={12} style={{ color: 'var(--primary-green)' }} />
                          <span style={{ fontWeight: 800 }}>{r.amountPerKg}</span>
                          <span style={{ opacity: 0.6, fontSize: '0.75rem' }}>/ kg</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span className={`badge ${statusBadgeClass}`}>
                          {r.status === 'pending' && <Clock size={14} style={{ marginRight: '6px' }} />}
                          {r.status === 'accepted' && <CheckCircle size={14} style={{ marginRight: '6px' }} />}
                          {r.status === 'rejected' && <XCircle size={14} style={{ marginRight: '6px' }} />}
                          {r.status.toUpperCase()}
                        </span>
                        <div className="contact-item" style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                          <Calendar size={12} />
                          <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {r.status === "pending" ? (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button className="action-btn btn-unblock" onClick={() => accept(r._id)}>
                            <Check size={16} /> Accept
                          </button>
                          <button className="action-btn btn-block" onClick={() => reject(r._id)}>
                            <X size={16} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.85rem' }}>Offer {r.status}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '5rem' }}>
                    <div style={{ opacity: 0.5 }}>
                      <Store size={48} style={{ marginBottom: '1.5rem', color: 'var(--dark-green)' }} />
                      <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--deep-green)' }}>No direct offers found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
