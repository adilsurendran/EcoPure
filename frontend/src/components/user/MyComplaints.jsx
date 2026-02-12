import { useEffect, useState } from "react";
import { getMyComplaints } from "../../api/user.api";
import "../styles/UserPremium.css";
import { AlertCircle, Clock, MessageSquare, CheckCircle } from "lucide-react";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getMyComplaints();
      setComplaints(res.data);
    } catch (err) {
      console.error("Failed to load complaints", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-premium-container">
      <div className="user-premium-header">
        <div className="user-header-title">
          <h1>My Complaints</h1>
          <p>History and status of your reported issues</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading your complaints...</div>
      ) : complaints.length === 0 ? (
        <div className="user-empty-state">
          <AlertCircle size={48} />
          <h3>No Complaints Found</h3>
          <p>You haven't reported any issues yet. We're happy everything is going smoothly!</p>
        </div>
      ) : (
        <div className="user-premium-card-list">
          {complaints.map((c) => (
            <div key={c._id} className="user-pickup-card" style={{ display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div className="pickup-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0 }}>Complaint</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--user-text-muted)' }}>
                      {new Date(c.createdAt).toLocaleDateString()} at {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <span className={`user-status-badge ${c.reply ? 'status-badge-completed' : 'status-badge-pending'}`}>
                  {c.reply ? <CheckCircle size={14} /> : <Clock size={14} />}
                  <span style={{ marginLeft: '6px' }}>{c.reply ? 'Resolved' : 'Pending'}</span>
                </span>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--user-text-main)' }}>
                  <b>Issue:</b> {c.message}
                </p>

                {c.reply && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1.5px dashed #cbd5e1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--user-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                      <MessageSquare size={14} />
                      Admin Response
                    </div>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#064e3b' }}>
                      {c.reply}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
