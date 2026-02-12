import { useEffect, useState } from "react";
import { getAllComplaints, replyComplaint } from "../../api/admin.api";
import {
  MessageSquare,
  Search,
  Clock,
  CheckCircle,
  ShieldAlert,
  User,
  Reply,
  X,
  AlertTriangle,
  Phone,
  Calendar
} from "lucide-react";
import "./styles/AdminTable.css";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const res = await getAllComplaints();
      setComplaints(res.data);
    } catch (err) {
      console.error("Failed to load complaints", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await replyComplaint(replyingTo._id, replyText);
      setReplyingTo(null);
      setReplyText("");
      loadComplaints();
    } catch (err) {
      console.error("Failed to send reply", err);
    }
  };

  const filteredComplaints = complaints.filter(c =>
    c.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = complaints.filter(c => !c.reply).length;

  if (loading && complaints.length === 0) return (
    <div className="admin-page-container">
      <div className="loading-state">
        <div className="loader"></div>
        <p>Analyzing Security Reports...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-page-container">
      {/* HEADER */}
      <div className="page-header">
        <div className="header-content">
          <h1>Support & Complaints</h1>
          <p>Monitor and resolve user issues to maintain ecosystem integrity.</p>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <AlertTriangle size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending Reviews</span>
            <span className="stat-value">{pendingCount} Action Required</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Logs</span>
            <span className="stat-value">{complaints.length} Reported Cases</span>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Issuer Profile</th>
                <th>Report Details</th>
                <th>Status & Timeline</th>
                <th>Resolution Status</th>
                <th style={{ textAlign: 'right' }}>Management</th>
              </tr>
            </thead>

            <tbody>
              {filteredComplaints.map((c) => {
                const isResolved = !!c.reply;

                return (
                  <tr key={c._id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #ef4444, #991b1b)' }}>
                          <User size={20} />
                        </div>
                        <div className="user-details">
                          <span className="user-name">{c.userId?.name}</span>
                          <div className="contact-item" style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                            <Phone size={12} />
                            <span>{c.userId?.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', maxWidth: '300px', lineHeight: 1.5 }}>
                        {c.message}
                      </p>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span className={`badge ${isResolved ? 'badge-active' : 'badge-blocked'}`}>
                          {isResolved ? <CheckCircle size={14} style={{ marginRight: '6px' }} /> : <Clock size={14} style={{ marginRight: '6px' }} />}
                          {isResolved ? 'RESOLVED' : 'PENDING'}
                        </span>
                        <div className="contact-item" style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                          <Calendar size={12} />
                          <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      {c.reply ? (
                        <div className="contact-item" style={{ opacity: 0.8 }}>
                          <MessageSquare size={14} />
                          <span style={{ fontSize: '0.85rem' }}>"{c.reply.slice(0, 30)}..."</span>
                        </div>
                      ) : (
                        <span style={{ opacity: 0.4, fontStyle: 'italic', fontSize: '0.8rem' }}>Waiting for Admin Action</span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          className="action-btn"
                          style={{ background: isResolved ? '#f1f5f9' : 'var(--deep-green)', color: isResolved ? '#64748b' : 'white' }}
                          onClick={() => {
                            setReplyingTo(c);
                            setReplyText(c.reply || "");
                          }}
                        >
                          <Reply size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredComplaints.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '5rem' }}>
                    <div style={{ opacity: 0.5 }}>
                      <ShieldAlert size={48} style={{ marginBottom: '1.5rem', color: 'var(--dark-green)' }} />
                      <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--deep-green)' }}>No security reports found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REPLY MODAL */}
      {replyingTo && (
        <div className="modal-overlay">
          <div className="premium-modal" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>Security Resolution</h2>
              <button className="close-btn" onClick={() => setReplyingTo(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleReply} className="premium-form">
              <div className="modal-body">
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fef2f2', borderRadius: '14px', border: '1px solid #fee2e2' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#991b1b', fontWeight: 700 }}>
                    <AlertTriangle size={16} />
                    <span>Report Summary</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#b91c1c', lineHeight: 1.5 }}>
                    {replyingTo.message}
                  </p>
                </div>

                <div className="form-group">
                  <label>Official Resolution Message</label>
                  <textarea
                    className="premium-input"
                    style={{ minHeight: '150px', resize: 'vertical', paddingTop: '10px' }}
                    placeholder="Provide a resolution or explanation to the user..."
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="action-btn btn-block"
                  style={{ background: '#f1f5f9', color: '#64748b', boxShadow: 'none' }}
                  onClick={() => setReplyingTo(null)}
                >
                  Discard
                </button>
                <button type="submit" className="action-btn btn-unblock">
                  <CheckCircle size={18} />
                  Deploy Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
