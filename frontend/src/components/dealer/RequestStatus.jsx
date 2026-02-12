import { useEffect, useState } from "react";
import { cancelDirectRequest, getDealerDirectRequests, markDirectRequestDelivered } from "../../api/dealer.api";
import "../styles/UserPremium.css";
import {
  Clock,
  CheckCircle,
  XCircle,
  PackageCheck,
  Calendar,
  IndianRupee,
  Weight,
  AlertCircle,
  CheckCircle2,
  Package,
  XCircle as XIcon
} from "lucide-react";

export default function RequestStatus() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await getDealerDirectRequests();
      setRequests(res.data);
    } catch {
      console.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this procurement request?")) return;

    try {
      await cancelDirectRequest(id);
      loadRequests();
    } catch {
      alert("Cancellation failed. Please contact support.");
    }
  };

  const deliverRequest = async (id) => {
    if (!window.confirm("Confirm material delivery status?")) return;

    try {
      await markDirectRequestDelivered(id);
      loadRequests();
    } catch {
      alert("Status update failed");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock size={16} />;
      case "accepted": return <CheckCircle2 size={16} />;
      case "delivered": return <Package size={16} />;
      case "rejected":
      case "cancelled": return <XIcon size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="user-premium-container">
      <div className="user-premium-header">
        <div className="user-header-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Clock size={20} color="#059669" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--user-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Tracking Portal</span>
          </div>
          <h1>Request Pipeline</h1>
          <p>Monitor the status of your procurement and sales transactions.</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Retrieving transaction logs...</div>
      ) : requests.length === 0 ? (
        <div className="user-empty-state">
          <PackageCheck size={48} color="#cbd5e1" />
          <h3 style={{ marginTop: '1.5rem', color: 'var(--user-text-main)' }}>No Transactions Found</h3>
          <p style={{ color: 'var(--user-text-muted)' }}>You haven't initiated any requests yet.</p>
        </div>
      ) : (
        <div className="user-premium-card-list">
          {requests.map((r) => (
            <div key={r._id} className="user-pickup-card">
              <div className="pickup-main-info">
                <div className="pickup-icon" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
                  <Package size={24} />
                </div>
                <div className="pickup-details">
                  <h4>{r.wasteType}</h4>
                  <p><Weight size={14} /> {r.quantityKg} kg Quantity</p>
                  <p><IndianRupee size={14} /> ₹{r.amountPerKg} <span style={{ fontSize: '0.75rem' }}>/ kg</span></p>
                  <p><Calendar size={14} /> Ordered: {new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="pickup-status-section">
                <span className={`user-status-badge status-badge-${r.status === 'delivered' ? 'completed' : r.status === 'accepted' ? 'assigned' : (r.status === 'rejected' || r.status === 'cancelled') ? 'cancelled' : 'pending'}`}>
                  {getStatusIcon(r.status)}
                  <span style={{ marginLeft: '4px' }}>{r.status}</span>
                </span>

                <div className="user-actions-group">
                  {r.status === "pending" && (
                    <button
                      onClick={() => cancelRequest(r._id)}
                      className="icon-btn danger"
                      title="Cancel Request"
                    >
                      <XCircle size={18} />
                    </button>
                  )}

                  {r.status === "accepted" && (
                    <button
                      onClick={() => deliverRequest(r._id)}
                      className="user-btn-premium user-btn-primary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                    >
                      <CheckCircle size={14} />
                      <span>Confirm Delivery</span>
                    </button>
                  )}

                  {!(r.status === "pending" || r.status === "accepted") && (
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>No actions</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
