import { useEffect, useState } from "react";
import {
  fetchDealers,
  toggleDealerStatus,
} from "../../api/admin.api";
import "./styles/admin.worker.css";

export default function Dealers() {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p className="loading-text">Loading dealers...</p>;
  }

  return (
    <div className="admin-dealers">
      <div className="page-header">
        <h1 className="page-title">Dealers Management</h1>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {dealers.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No dealers found
                </td>
              </tr>
            )}

            {dealers.map((dealer) => {
              const isActive = dealer.authId?.isActive;

              return (
                <tr key={dealer._id}>
                  <td>{dealer.name}</td>
                  <td>{dealer.phone}</td>
                  <td>{dealer.email || "-"}</td>

                  <td>
                    <span
                      className={`status ${
                        isActive ? "active" : "blocked"
                      }`}
                    >
                      {isActive ? "Approved" : "Blocked"}
                    </span>
                  </td>

                  <td>
                    <button
                      className={`btn ${
                        isActive ? "btn-danger" : "btn-success"
                      }`}
                      onClick={() =>
                        handleToggle(dealer.authId._id)
                      }
                    >
                      {isActive ? "Block" : "Approve"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
