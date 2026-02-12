import { useEffect, useState } from "react";
import PickupRequest from "./PickupRequest";
import "../styles/UserPremium.css";
import {
  Package,
  MapPin,
  Calendar,
  User,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Activity,
  ArrowRight
} from "lucide-react";

import {
  fetchMyPickupRequests,
  cancelPickupRequest,
  collectPickupRequest,
} from "../../api/pickup.api";

export default function PickupStatus() {
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const res = await fetchMyPickupRequests();
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to load pickup requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this pickup request?")) return;
    try {
      await cancelPickupRequest(id);
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: "cancelled" } : req
        )
      );
    } catch (err) {
      alert("Error cancelling request");
    }
  };

  const handleCollected = async (id) => {
    if (!confirm("Confirm that your waste has been collected?")) return;
    try {
      await collectPickupRequest(id);
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: "collected" } : req
        )
      );
    } catch (err) {
      alert("Error updating status");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock size={16} />;
      case "assigned": return <Activity size={16} />;
      case "collected": return <CheckCircle size={16} />;
      case "cancelled": return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStats = () => {
    const active = requests.filter(r => r.status === 'pending' || r.status === 'assigned').length;
    const completed = requests.filter(r => r.status === 'collected').length;
    return { active, completed };
  };

  if (showForm) {
    return (
      <PickupRequest
        onClose={() => {
          setShowForm(false);
          loadRequests();
        }}
      />
    );
  }

  const { active, completed } = getStats();

  return (
    <div className="user-premium-container">
      <div className="user-premium-header">
        <div className="user-header-title">
          <h1>Pickup Status</h1>
          <p>Track and manage your waste collection requests</p>
        </div>
        <button
          className="user-btn-premium user-btn-primary"
          onClick={() => setShowForm(true)}
        >
          <Plus size={20} />
          <span>New Request</span>
        </button>
      </div>

      <div className="user-stats-grid">
        <div className="user-stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(5, 150, 105, 0.1)', color: '#059669' }}>
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <h3>Active Requests</h3>
            <p>{loading ? "..." : active}</p>
          </div>
        </div>
        <div className="user-stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>Completed Pickups</h3>
            <p>{loading ? "..." : completed}</p>
          </div>
        </div>
        <div className="user-stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#d97706' }}>
            <Package size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Waste Managed</h3>
            <p>{loading ? "..." : requests.length}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading your requests...</div>
      ) : requests.length === 0 ? (
        <div className="user-empty-state">
          <Package size={48} />
          <h3>No Pickup Requests</h3>
          <p>You haven't made any cleanup requests yet. Click "New Request" to get started!</p>
        </div>
      ) : (
        <div className="user-premium-card-list">
          {requests.map((req) => {
            const canCancel = req.status === "pending";
            const canCollect = req.status === "assigned";

            return (
              <div key={req._id} className="user-pickup-card">
                <div className="pickup-main-info">
                  <div className="pickup-icon">
                    <Package size={24} />
                  </div>
                  <div className="pickup-details">
                    <h4>{req.wasteType} Collection</h4>
                    <p><MapPin size={14} /> {req.address}</p>
                    <p><Calendar size={14} /> {new Date(req.createdAt).toLocaleDateString()} at {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    {req.workerId && (
                      <p className="worker-assignment">
                        <User size={14} /> <b>Worker:</b> {req.workerId.name} ({req.workerId.phone})
                      </p>
                    )}
                  </div>
                </div>

                <div className="pickup-status-section">
                  <span className={`user-status-badge status-badge-${req.status}`}>
                    {getStatusIcon(req.status)}
                    <span style={{ marginLeft: '4px' }}>{req.status}</span>
                  </span>

                  <div className="user-actions-group">
                    {canCancel && (
                      <button
                        className="icon-btn danger"
                        onClick={() => handleCancel(req._id)}
                        title="Cancel Request"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    {/* <button className="icon-btn" title="View Details">
                      <ArrowRight size={18} />
                    </button> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
