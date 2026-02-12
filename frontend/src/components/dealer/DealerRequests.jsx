import { useEffect, useState } from "react";
import { cancelDealerRequest, getDealerRequests, markDelivered } from "../../api/dealer.api";
import "../styles/UserPremium.css";
import {
  History,
  Package,
  Weight,
  IndianRupee,
  ArrowRight,
  XCircle,
  CheckCircle,
  FileText,
  Clock,
  CheckCircle2,
  XCircle as XIcon
} from "lucide-react";

export default function DealerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await getDealerRequests();
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (id) => {
    if (!window.confirm("Cancel this procurement offer?")) return;
    try {
      await cancelDealerRequest(id);
      loadRequests();
    } catch {
      alert("Cancellation failed");
    }
  };

  const deliverRequest = async (id) => {
    if (!window.confirm("Confirm material acquisition?")) return;
    try {
      await markDelivered(id);
      loadRequests();
    } catch {
      alert("Update failed");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock size={16} />;
      case "approved": return <CheckCircle2 size={16} />;
      case "delivered": return <Package size={16} />;
      case "cancelled": return <XIcon size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="user-premium-container">
      <div className="user-premium-header">
        <div className="user-header-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <History size={20} color="#059669" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--user-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Ledger</span>
          </div>
          <h1>Marketplace History</h1>
          <p>Review your historical procurement orders and market interactions.</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Auditing ledger...</div>
      ) : requests.length === 0 ? (
        <div className="user-empty-state">
          <FileText size={48} color="#cbd5e1" />
          <h3 style={{ marginTop: '1.5rem', color: 'var(--user-text-main)' }}>History is Empty</h3>
          <p style={{ color: 'var(--user-text-muted)' }}>You haven't made any offers on the waste market yet.</p>
        </div>
      ) : (
        <div className="user-premium-card-list">
          {requests.map((r) => (
            <div key={r._id} className="user-pickup-card">
              <div className="pickup-main-info">
                <div className="pickup-icon" style={{ background: 'rgba(5, 150, 105, 0.1)', color: '#059669' }}>
                  <Package size={24} />
                </div>
                <div className="pickup-details">
                  <h4>{r.wastePostId?.wasteType || 'Unknown'}</h4>
                  <p><Weight size={14} /> {r.requiredWeight} kg Ordered</p>
                  <p><IndianRupee size={14} /> ₹{r.wastePostId?.pricePerKg} <span style={{ fontSize: '0.75rem' }}>/ kg</span></p>
                  <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Post ID: #{r.wastePostId?._id?.slice(-6)}</p>
                </div>
              </div>

              <div className="pickup-status-section">
                <span className={`user-status-badge status-badge-${r.status === 'delivered' ? 'completed' : r.status}`}>
                  {getStatusIcon(r.status)}
                  <span style={{ marginLeft: '4px' }}>{r.status}</span>
                </span>

                <div className="user-actions-group">
                  {r.status === "pending" && (
                    <button
                      onClick={() => cancelRequest(r._id)}
                      className="icon-btn danger"
                      title="Retract Offer"
                    >
                      <XCircle size={18} />
                    </button>
                  )}

                  {r.status === "approved" && (
                    <button
                      onClick={() => deliverRequest(r._id)}
                      className="user-btn-premium user-btn-primary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                    >
                      <CheckCircle size={14} />
                      <span>Log Delivery</span>
                    </button>
                  )}

                  {!(r.status === "pending" || r.status === "approved") && (
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>Archived</span>
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
