import { useEffect, useState } from "react";
import { fetchUsers, toggleUserStatus } from "../../api/admin.api";
import { Users as UsersIcon, ShieldCheck, ShieldAlert, Phone, Mail, UserCheck, UserMinus, Search } from "lucide-react";
import "./styles/AdminTable.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadUsers = async () => {
    try {
      const res = await fetchUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (authId) => {
    try {
      await toggleUserStatus(authId);
      loadUsers();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.authId.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  if (loading) return (
    <div className="admin-page-container">
      <div className="loading-state">
        <div className="loader"></div>
        <p>Fetching Users...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Registered Users</h1>
          <p>Overview and management of ECO-PURE platform members.</p>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by name, username or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <UsersIcon size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Members </span>
            <span className="stat-value">{users.length} Users</span>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-responsive">
          <table className="premium-table">
            <thead>
              <tr>
                <th>User Identity</th>
                <th>Account Info</th>
                <th>Contact Details</th>
                <th>Access Status</th>
                <th style={{ textAlign: 'right' }}>Management</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-details">
                        <span className="user-name">{user.name}</span>
                        <span className="user-email">UID: {user._id.slice(-8).toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="username-tag">
                      @{user.authId.username}
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <div className="contact-item">
                        <Phone size={14} />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    {user.authId.isActive ? (
                      <span className="badge badge-active">
                        <ShieldCheck size={14} style={{ marginRight: '6px' }} />
                        Active Member
                      </span>
                    ) : (
                      <span className="badge badge-blocked">
                        <ShieldAlert size={14} style={{ marginRight: '6px' }} />
                        Restricted
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button
                        onClick={() => handleToggle(user.authId._id)}
                        className={`action-btn ${user.authId.isActive ? "btn-block" : "btn-unblock"
                          }`}
                        title={user.authId.isActive ? "Restrict User Access" : "Grant User Access"}
                      >
                        {user.authId.isActive ? (
                          <><UserMinus size={16} /> Block</>
                        ) : (
                          <><UserCheck size={16} /> Unblock</>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '5rem' }}>
                    <div style={{ opacity: 0.5 }}>
                      <UsersIcon size={48} style={{ marginBottom: '1.5rem', color: 'var(--dark-green)' }} />
                      <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--deep-green)' }}>No users found</p>
                      <p style={{ fontSize: '0.95rem' }}>Try searching with different keywords.</p>
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


