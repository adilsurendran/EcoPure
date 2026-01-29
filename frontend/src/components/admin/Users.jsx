import { useEffect, useState } from "react";
import { fetchUsers, toggleUserStatus } from "../../api/admin.api";
import "./styles/admin.user.css"
export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="loading-text">Loading users...</p>;

  return (
    <div className="admin-users">
      <h1 className="page-title">Registered Users</h1>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.authId.username}</td>
                <td>{user.phone}</td>
                <td>
                  <span
                    className={`status ${
                      user.authId.isActive ? "active" : "blocked"
                    }`}
                  >
                    {user.authId.isActive ? "Active" : "Blocked"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleToggle(user.authId._id)}
                    className={`btn ${
                      user.authId.isActive
                        ? "btn-danger"
                        : "btn-success"
                    }`}
                  >
                    {user.authId.isActive ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
