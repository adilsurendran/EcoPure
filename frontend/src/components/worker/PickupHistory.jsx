import { useEffect, useState } from "react";
import { fetchPickupHistory } from "../../api/pickup.api";
import {
  History,
  Search,
  User,
  Archive,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  BarChart3,
  Calendar
} from "lucide-react";
import "../admin/styles/AdminTable.css";

export default function PickupHistory() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await fetchPickupHistory();
      setPickups(res.data);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPickups = pickups.filter(p =>
    p.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.wasteType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCompleted = pickups.filter(p => p.status === 'completed').length;

  if (loading && pickups.length === 0) return (
    <div className="admin-page-container">
      <div className="loading-state">
        <div className="loader"></div>
        <p>Retrieving Logistics Records...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-page-container">
      {/* HEADER */}
      <div className="page-header">
        <div className="header-content">
          <h1>Logistics Archive</h1>
          <p>Review and audit your completed waste collection performance logs.</p>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search history..."
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
            <History size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Lifetime Missions</span>
            <span className="stat-value">{pickups.length} Successful Tasks</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green" style={{ background: 'var(--primary-light)' }}>
            <BarChart3 size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Performance Metric</span>
            <span className="stat-value">Consistent Velocity</span>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Citizen Profile</th>
                <th>Asset Detail</th>
                <th>Service Location</th>
                <th>Completion Status</th>
                <th style={{ textAlign: 'right' }}>Logged Session</th>
              </tr>
            </thead>

            <tbody>
              {filteredPickups.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #64748b, #334155)' }}>
                        <User size={20} />
                      </div>
                      <div className="user-details">
                        <span className="user-name">{p.userId?.name}</span>
                        <div className="contact-item" style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                          <Phone size={12} />
                          <span>{p.userId?.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-item">
                      <Archive size={16} />
                      <span className="username-tag" style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>
                        {p.wasteType}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-item" style={{ maxWidth: '250px' }}>
                      <MapPin size={16} style={{ opacity: 0.4 }} />
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {p.address}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span className="badge badge-active">
                        <CheckCircle size={14} style={{ marginRight: '6px' }} />
                        {p.status.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="contact-item" style={{ justifyContent: 'flex-end', opacity: 0.6 }}>
                      <Calendar size={14} />
                      <span style={{ fontSize: '0.85rem' }}>{new Date(p.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPickups.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '5rem' }}>
                    <div style={{ opacity: 0.5 }}>
                      <History size={48} style={{ marginBottom: '1.5rem', color: 'var(--dark-green)' }} />
                      <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--deep-green)' }}>No archived records found</p>
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
