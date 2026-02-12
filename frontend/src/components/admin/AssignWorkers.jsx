import { useEffect, useState } from "react";
import { assignWorker, completePickup, fetchAvailableWorkers, fetchPickups } from "../../api/pickup.api";
import {
  Truck,
  User,
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
  X,
  UserPlus,
  Phone,
  HardHat
} from "lucide-react";
import "./styles/AdminTable.css";

export default function AssignWorkers() {
  const [pickups, setPickups] = useState([]);
  const [status, setStatus] = useState("pending");
  const [workers, setWorkers] = useState([]);
  const [assignFor, setAssignFor] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPickups = async () => {
    setLoading(true);
    try {
      const res = await fetchPickups(status);
      console.log(res);
      
      setPickups(res.data);
    } catch (err) {
      console.error("Failed to load pickups", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPickups();
  }, [status]);

  const openAssign = async (pickupId) => {
    try {
      const res = await fetchAvailableWorkers();
      setWorkers(res.data);
      setAssignFor(pickupId);
    } catch (err) {
      console.error("Failed to fetch available workers", err);
    }
  };

  const handleAssign = async (workerId) => {
    try {
      await assignWorker({ pickupId: assignFor, workerId });
      setAssignFor(null);
      loadPickups();
    } catch (err) {
      console.error("Failed to assign worker", err);
    }
  };

  const handleComplete = async (id) => {
    try {
      await completePickup(id);
      loadPickups();
    } catch (err) {
      console.error("Failed to complete pickup", err);
    }
  };

  const statusIcons = {
    all: <ClipboardList size={20} />,
    pending: <Clock size={20} />,
    assigned: <HardHat size={20} />,
    completed: <CheckCircle size={20} />,
    cancelled: <XCircle size={20} />
  };

  if (loading && pickups.length === 0) return (
    <div className="admin-page-container">
      <div className="loading-state">
        <div className="loader"></div>
        <p>Orchestrating Pickup Requests...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-page-container">
      {/* HEADER */}
      <div className="page-header">
        <div className="header-content">
          <h1>Pickup Coordination</h1>
          <p>Assign field staff to handle pending waste collection requests.</p>
        </div>

        <div className="header-actions">
          <div className="stat-card" style={{ padding: '0.75rem 1.5rem', marginBottom: 0, minWidth: '200px' }}>
            <div className="stat-icon green" style={{ width: '40px', height: '40px' }}>
              <Truck size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Logs</span>
              <span className="stat-value" style={{ fontSize: '1rem' }}>{pickups.length} Requests</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="table-card" style={{ marginBottom: '2rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {["all", "pending", "assigned", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              className={`action-btn ${status === s ? "btn-unblock" : ""}`}
              style={{
                background: status === s ? 'var(--deep-green)' : '#f1f5f9',
                color: status === s ? 'white' : '#64748b',
                padding: '0.8rem 1.5rem',
                border: '1px solid ' + (status === s ? 'var(--deep-green)' : '#e2e8f0'),
                boxShadow: status === s ? '0 4px 12px rgba(20, 90, 50, 0.2)' : 'none'
              }}
              onClick={() => setStatus(s)}
            >
              {statusIcons[s]}
              <span style={{ fontWeight: 700 }}>{s.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Customer / Origin</th>
                <th>Collection Type</th>
                <th>Request Status</th>
                <th>Assigned Operative</th>
                <th style={{ textAlign: 'right' }}>Logistics Control</th>
              </tr>
            </thead>

            <tbody>
              {pickups.map((p) => {
                const badgeClass = {
                  pending: 'badge-blocked',
                  assigned: 'badge-active',
                  completed: 'badge-active',
                  cancelled: 'badge-dark'
                }[p.status] || 'badge-active';

                return (
                  <tr key={p._id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                          <User size={20} />
                        </div>
                        <div className="user-details">
                          <span className="user-name">{p.userId?.name || "Guest User"}</span>
                          <span className="user-email">UID: {p.userId?._id?.slice(-8).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-item">
                        <Truck size={16} />
                        <span className="username-tag" style={{ background: '#f8fafc', color: 'var(--deep-green)', border: '1px solid #e2e8f0' }}>
                          {p.wasteType}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${badgeClass}`}>
                        {p.status === 'pending' && <Clock size={14} style={{ marginRight: '6px' }} />}
                        {p.status === 'assigned' && <HardHat size={14} style={{ marginRight: '6px' }} />}
                        {p.status === 'completed' && <CheckCircle size={14} style={{ marginRight: '6px' }} />}
                        {p.status === 'cancelled' && <XCircle size={14} style={{ marginRight: '6px' }} />}
                        {p.status}
                      </span>
                    </td>
                    <td>
                      {p.workerId ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div className="contact-item">
                            <HardHat size={14} />
                            <span style={{ fontWeight: 700 }}>{p.workerId.name}</span>
                          </div>
                          <div className="contact-item" style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                            <Phone size={14} />
                            <span>{p.workerId.phone}</span>
                          </div>
                        </div>
                      ) : (
                        <span style={{ opacity: 0.5, fontStyle: 'italic' }}>Deployment Pending</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        {p.status === "pending" && (
                          <button className="action-btn btn-unblock" onClick={() => openAssign(p._id)}>
                            <UserPlus size={16} /> Assign Worker
                          </button>
                        )}

                        {p.status === "assigned" && (
                          <button className="action-btn btn-unblock" style={{ background: '#0ea5e9', color: 'white' }} onClick={() => handleComplete(p._id)}>
                            <CheckCircle size={16} /> Mark Complete
                          </button>
                        )}

                        {p.status === "completed" && (
                          <span className="badge badge-active">Archive Ready</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {pickups.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '5rem' }}>
                    <div style={{ opacity: 0.5 }}>
                      <ClipboardList size={48} style={{ marginBottom: '1.5rem', color: 'var(--dark-green)' }} />
                      <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--deep-green)' }}>No requests found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSIGN MODAL */}
      {assignFor && (
        <div className="modal-overlay">
          <div className="premium-modal" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>Deployment Hub</h2>
              <button className="close-btn" onClick={() => setAssignFor(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ marginBottom: '1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Select an available field worker for this collection.
              </p>

              {workers.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <XCircle size={40} style={{ color: '#ef4444', marginBottom: '1rem' }} />
                  <p style={{ color: '#ef4444', fontWeight: 700 }}>No workers available.</p>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {workers.map((w) => (
                  <div
                    key={w._id}
                    className="stat-card"
                    style={{
                      cursor: 'pointer',
                      padding: '1rem 1.5rem',
                      border: '2px solid transparent',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-green)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                    onClick={() => handleAssign(w._id)}
                  >
                    <div className="stat-icon green" style={{ width: '40px', height: '40px' }}>
                      <HardHat size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 800, color: 'var(--text-dark)', marginBottom: '2px' }}>{w.name}</p>
                      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={10} /> {w.phone}
                        </span>
                      </div>
                    </div>
                    <UserPlus size={18} style={{ color: 'var(--primary-green)' }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="action-btn btn-block"
                style={{ background: '#f1f5f9', color: '#64748b', boxShadow: 'none' }}
                onClick={() => setAssignFor(null)}
              >
                Cancel Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
