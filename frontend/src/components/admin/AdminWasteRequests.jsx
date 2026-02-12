import { useEffect, useState } from "react";
import { approveWasteRequest, getAllWasteRequests, rejectWasteRequest } from "../../api/admin.api";
import {
  Store,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Archive,
  Weight,
  ClipboardList,
  Check,
  X,
  Phone
} from "lucide-react";
import "./styles/AdminTable.css";

export default function AdminWasteRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await getAllWasteRequests();
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to load requests", err);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    if (!window.confirm("Authorize this procurement request?")) return;
    try {
      await approveWasteRequest(id);
      loadRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Approval process failed");
    }
  };

  const reject = async (id) => {
    if (!window.confirm("Reject this procurement request?")) return;
    try {
      await rejectWasteRequest(id);
      loadRequests();
    } catch (err) {
      console.error("Rejection failed", err);
    }
  };

  const filteredRequests = requests.filter(r =>
    r.dealerId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.wastePostId?.wasteType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const totalVolume = requests.reduce((acc, r) => acc + (Number(r.requiredWeight) || 0), 0);

  if (loading && requests.length === 0) return (
    <div className="admin-page-container">
      <div className="loading-state">
        <div className="loader"></div>
        <p>Processing Dealer Requests...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-page-container">
      {/* HEADER */}
      <div className="page-header">
        <div className="header-content">
          <h1>Procurement Requests</h1>
          <p>Review and authorize waste procurement requests from registered dealers.</p>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search dealers or categories..."
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
            <Clock size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending Reviews</span>
            <span className="stat-value">{pendingCount} Action Required</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <Weight size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Request Volume</span>
            <span className="stat-value">{totalVolume} kg Total Demand</span>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Dealer Information</th>
                <th>Requested Asset</th>
                <th>Weight Metrics</th>
                <th>Current Status</th>
                <th style={{ textAlign: 'right' }}>Authorization</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((r) => {
                const statusBadgeClass = {
                  pending: 'badge-blocked',
                  approved: 'badge-active',
                  rejected: 'badge-dark'
                }[r.status] || 'badge-active';

                return (
                  <tr key={r._id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #4f46e5, #4338ca)' }}>
                          <User size={20} />
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
                        <span className="username-tag" style={{ background: '#f8fafc', color: 'var(--deep-green)', border: '1px solid #e2e8f0' }}>
                          {r.wastePostId?.wasteType}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div className="contact-item">
                          <Weight size={14} />
                          <span style={{ fontWeight: 700 }}>{r.requiredWeight} kg</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Stock: {r.wastePostId?.availableWeight} kg</div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${statusBadgeClass}`}>
                        {r.status === 'pending' && <Clock size={14} style={{ marginRight: '6px' }} />}
                        {r.status === 'approved' && <CheckCircle size={14} style={{ marginRight: '6px' }} />}
                        {r.status === 'rejected' && <XCircle size={14} style={{ marginRight: '6px' }} />}
                        {r.status.toUpperCase()}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {r.status === "pending" ? (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button className="action-btn btn-unblock" onClick={() => approve(r._id)}>
                            <Check size={16} /> Approve
                          </button>
                          <button className="action-btn btn-block" onClick={() => reject(r._id)}>
                            <X size={16} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.85rem' }}>Transaction Finalized</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '5rem' }}>
                    <div style={{ opacity: 0.5 }}>
                      <ClipboardList size={48} style={{ marginBottom: '1.5rem', color: 'var(--dark-green)' }} />
                      <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--deep-green)' }}>No procurement requests found</p>
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
