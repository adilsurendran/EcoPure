import { useEffect, useState } from "react";
import {
  fetchDealers,
  toggleDealerStatus,
} from "../../api/admin.api";
import {
  Store,
  Search,
  Phone,
  Mail,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserMinus,
  MapPin
} from "lucide-react";
import "./styles/AdminTable.css";

export default function Dealers() {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  /* ---------------- LOAD DEALERS ---------------- */
  const loadDealers = async () => {
    setLoading(true);
    try {
      const res = await fetchDealers();
      setDealers(res.data);
    } catch (err) {
      console.error("Failed to load dealers", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- TOGGLE STATUS (OPTIMISTIC) ---------------- */
  const handleToggle = async (authId) => {
    try {
      await toggleDealerStatus(authId);

      setDealers((prev) =>
        prev.map((dealer) =>
          dealer.authId?._id === authId
            ? {
              ...dealer,
              authId: {
                ...dealer.authId,
                isActive: !dealer.authId.isActive,
              },
            }
            : dealer
        )
      );
    } catch (err) {
      console.error("Failed to update dealer status", err);
    }
  };

  useEffect(() => {
    loadDealers();
  }, []);

  const filteredDealers = dealers.filter(dealer =>
    dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dealer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dealer.phone.includes(searchTerm)
  );

  if (loading) return (
    <div className="admin-page-container">
      <div className="loading-state">
        <div className="loader"></div>
        <p>Fetching Partner Network...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-page-container">
      {/* HEADER */}
      <div className="page-header">
        <div className="header-content">
          <h1>Dealers Management</h1>
          <p>Collaborate with your waste collection and recycling partners.</p>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search dealers, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <Store size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Registered Partners</span>
            <span className="stat-value">{dealers.length} Active Dealers</span>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Partner Entity</th>
                <th>Contact Channels</th>
                <th>Details</th>
                <th>Validation</th>
                <th style={{ textAlign: 'right' }}>Management</th>
              </tr>
            </thead>

            <tbody>
              {filteredDealers.map((dealer) => {
                const isActive = dealer.authId?.isActive;

                return (
                  <tr key={dealer._id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                          <Store size={20} />
                        </div>
                        <div className="user-details">
                          <span className="user-name">{dealer.name}</span>
                          <span className="user-email">DID: {dealer._id.slice(-8).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div className="contact-item">
                          <Phone size={14} />
                          <span>{dealer.phone}</span>
                        </div>
                        <div className="contact-item" style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                          <Mail size={14} />
                          <span>{dealer.email || "No email"}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-item">
                        <MapPin size={14} />
                        <span className="username-tag">Authorized Partner</span>
                      </div>
                    </td>
                    <td>
                      {isActive ? (
                        <span className="badge badge-active">
                          <ShieldCheck size={14} style={{ marginRight: '6px' }} />
                          Approved
                        </span>
                      ) : (
                        <span className="badge badge-blocked">
                          <ShieldAlert size={14} style={{ marginRight: '6px' }} />
                          Suspended
                        </span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          className={`action-btn ${isActive ? "btn-block" : "btn-unblock"}`}
                          onClick={() => handleToggle(dealer.authId._id)}
                        >
                          {isActive ? <><UserMinus size={16} /> Block</> : <><UserCheck size={16} /> Approve</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredDealers.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '5rem' }}>
                    <div style={{ opacity: 0.5 }}>
                      <Store size={48} style={{ marginBottom: '1.5rem', color: 'var(--dark-green)' }} />
                      <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--deep-green)' }}>No dealers found</p>
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
