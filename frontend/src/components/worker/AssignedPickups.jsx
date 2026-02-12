import { useEffect, useState } from "react";
import { fetchAssignedPickups } from "../../api/pickup.api";
import {
  Truck,
  MapPin,
  Phone,
  User,
  Search,
  Clock,
  CheckCircle,
  Navigation,
  Archive,
  Calendar,
  AlertCircle
} from "lucide-react";
import "../admin/styles/AdminTable.css";

export default function AssignedPickups() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPickups();
  }, []);

  const loadPickups = async () => {
    setLoading(true);
    try {
      const res = await fetchAssignedPickups();
      setPickups(res.data);
    } catch (err) {
      console.error("Failed to load pickups", err);
    } finally {
      setLoading(false);
    }
  };

  const openMap = (lat, lng) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const filteredPickups = pickups.filter(p =>
    p.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.wasteType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = pickups.filter(p => p.status === 'assigned' || p.status === 'pending').length;

  if (loading && pickups.length === 0) return (
    <div className="admin-page-container">
      <div className="loading-state">
        <div className="loader"></div>
        <p>Optimizing Pickup Routes...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-page-container">
      {/* HEADER */}
      <div className="page-header">
        <div className="header-content">
          <h1>Route Management</h1>
          <p>Execute and track assigned waste collection tasks across your zone.</p>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search routes or users..."
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
            <Truck size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Missions</span>
            <span className="stat-value">{pendingCount} Pickups Assigned</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <Navigation size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Coverage Zone</span>
            <span className="stat-value">City-wide Logistics</span>
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
                <th>Logistics Address</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Route Control</th>
              </tr>
            </thead>

            <tbody>
              {filteredPickups.map((p) => {
                const hasLocation = p.location?.lat && p.location?.lng;
                const statusBadgeClass = {
                  assigned: 'badge-active',
                  pending: 'badge-blocked',
                  completed: 'badge-active',
                  cancelled: 'badge-dark'
                }[p.status] || 'badge-active';

                return (
                  <tr key={p._id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
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
                        <span className="username-tag" style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #dcfce7' }}>
                          {p.wasteType}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="contact-item" style={{ maxWidth: '250px' }}>
                        <MapPin size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-dark)', lineHeight: 1.4 }}>
                          {p.address}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span className={`badge ${statusBadgeClass}`}>
                          {p.status === 'assigned' && <Clock size={14} style={{ marginRight: '6px' }} />}
                          {p.status === 'completed' && <CheckCircle size={14} style={{ marginRight: '6px' }} />}
                          {p.status.toUpperCase()}
                        </span>
                        <div className="contact-item" style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                          <Calendar size={12} />
                          <span>Assigned Today</span>
                        </div>
                      </div>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {hasLocation ? (
                        <button
                          className="action-btn btn-unblock"
                          style={{ background: 'var(--deep-green)' }}
                          onClick={() => openMap(p.location.lat, p.location.lng)}
                        >
                          <Navigation size={16} />
                          Launch Maps
                        </button>
                      ) : (
                        <span style={{ opacity: 0.4, fontStyle: 'italic', fontSize: '0.85rem' }}>No GPS coordinates</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredPickups.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '5rem' }}>
                    <div style={{ opacity: 0.5 }}>
                      <Truck size={48} style={{ marginBottom: '1.5rem', color: 'var(--dark-green)' }} />
                      <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--deep-green)' }}>No assigned pickups found</p>
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
