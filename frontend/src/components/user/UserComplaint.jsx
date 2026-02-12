import { useState } from "react";
import { sendComplaint } from "../../api/user.api";
import "../styles/UserPremium.css";
import { AlertCircle, Send } from "lucide-react";

export default function UserComplaint() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!message.trim()) return alert("Message required");

    try {
      setLoading(true);
      await sendComplaint({ message });
      alert("Complaint submitted successfully. Our team will look into it.");
      setMessage("");
    } catch {
      alert("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-premium-container">
      <div className="user-premium-header">
        <div className="user-header-title">
          <h1>Report an Issue</h1>
          <p>We're here to help. Please describe the problem you're facing.</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <div className="user-form-card" style={{ boxShadow: 'var(--user-shadow-md)', animation: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              <AlertCircle size={24} />
            </div>
            <h2 style={{ margin: 0 }}>Submit Complaint</h2>
          </div>

          <form onSubmit={submit}>
            <div className="user-field-group">
              <label>Description of the problem</label>
              <textarea
                placeholder="Please be specific about the issue, location, or request..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="user-btn-premium user-btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #ef4444, #f87171)' }}>
              {loading ? "Submitting..." : (
                <>
                  <Send size={18} />
                  <span>Send Complaint</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
