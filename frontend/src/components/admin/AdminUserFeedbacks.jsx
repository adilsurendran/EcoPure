import { useEffect, useState } from "react";
import { getAllUserFeedbacks } from "../../api/admin.api";
import {
  BarChart3,
  Search,
  User,
  MessageSquare,
  Clock,
  CheckCircle,
  Archive,
  TrendingUp,
  Mail,
  Phone,
  Calendar
} from "lucide-react";
import "./styles/AdminTable.css";

export default function AdminUserFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await getAllUserFeedbacks();
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Failed to load feedbacks", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter(f =>
    f.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && feedbacks.length === 0) return (
    <div className="admin-page-container">
      <div className="loading-state">
        <div className="loader"></div>
        <p>Crunching User Feedback...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-page-container">
      {/* HEADER */}
      <div className="page-header">
        <div className="header-content">
          <h1>Experience Insights</h1>
          <p>Analyze user testimonials and feedback to refine the platform experience.</p>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search feedback..."
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
            <TrendingUp size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Engagement Level</span>
            <span className="stat-value">{feedbacks.length} Submissions</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green" style={{ background: 'var(--primary-light)' }}>
            <MessageSquare size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Feedback Velocity</span>
            <span className="stat-value">Active Community</span>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Contributor Identity</th>
                <th>Experience Details</th>
                <th>Validation Status</th>
                <th style={{ textAlign: 'right' }}>Logged Session</th>
              </tr>
            </thead>

            <tbody>
              {filteredFeedbacks.map((f) => (
                <tr key={f._id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #064e3b)' }}>
                        <User size={20} />
                      </div>
                      <div className="user-details">
                        <span className="user-name">{f.userId?.name}</span>
                        <div className="contact-item" style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                          <Phone size={12} />
                          <span>{f.userId?.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ maxWidth: '400px' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
                      "{f.message}"
                    </p>
                  </td>
                  <td>
                    <span className="badge badge-active">
                      <CheckCircle size={14} style={{ marginRight: '6px' }} />
                      VERIFIED
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="contact-item" style={{ justifyContent: 'flex-end', opacity: 0.6 }}>
                      <Calendar size={14} />
                      <span style={{ fontSize: '0.85rem' }}>{new Date(f.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredFeedbacks.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '5rem' }}>
                    <div style={{ opacity: 0.5 }}>
                      <Archive size={48} style={{ marginBottom: '1.5rem', color: 'var(--dark-green)' }} />
                      <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--deep-green)' }}>No experience insights available</p>
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
