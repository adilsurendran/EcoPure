import { useState } from "react";
import { sendUserFeedback } from "../../api/user.api";
import "../styles/UserPremium.css";
import { MessageSquare, Send } from "lucide-react";

export default function UserFeedback() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      return alert("Message is required");
    }

    try {
      setLoading(true);
      await sendUserFeedback({ message });
      alert("Feedback sent successfully! Thank you for your contribution.");
      setMessage("");
    } catch {
      alert("Failed to send feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-premium-container">
      <div className="user-premium-header">
        <div className="user-header-title">
          <h1>Community Feedback</h1>
          <p>Help us improve by sharing your thoughts and suggestions</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <div className="user-form-card" style={{ boxShadow: 'var(--user-shadow-md)', animation: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
              <MessageSquare size={24} />
            </div>
            <h2 style={{ margin: 0 }}>Send Feedback</h2>
          </div>

          <form onSubmit={submit}>
            <div className="user-field-group">
              <label>Your Message</label>
              <textarea
                placeholder="Share your experience or suggest improvements..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="user-btn-premium user-btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? "Sending..." : (
                <>
                  <Send size={18} />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
