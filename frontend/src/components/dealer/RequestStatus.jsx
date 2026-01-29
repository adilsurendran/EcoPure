import { useEffect, useState } from "react";
import { cancelDirectRequest, getDealerDirectRequests, markDirectRequestDelivered } from "../../api/dealer.api";


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
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (id) => {
    if (!confirm("Cancel this request?")) return;

    try {
      await cancelDirectRequest(id);
      loadRequests();
    } catch {
      alert("Cancel failed");
    }
  };

  const deliverRequest = async (id) => {
    if (!confirm("Mark as delivered?")) return;

    try {
      await markDirectRequestDelivered(id);
      loadRequests();
    } catch {
      alert("Update failed");
    }
  };

  if (loading) return <p>Loading requests...</p>;

  return (
    <div style={styles.container}>
      <h2>My Requests</h2>

      {requests.length === 0 && <p>No requests found</p>}

      {requests.map((r) => (
        <div key={r._id} style={styles.card}>
          <div style={styles.row}>
            <strong>{r.wasteType}</strong>
            <span style={badge(r.status)}>
              {r.status.toUpperCase()}
            </span>
          </div>

          <p>Quantity: {r.quantityKg} kg</p>
          <p>Price: ₹{r.amountPerKg} / kg</p>

          {r.description && (
            <p>Description: {r.description}</p>
          )}

          <p>
            Requested on:{" "}
            {new Date(r.createdAt).toLocaleDateString()}
          </p>

          {/* ACTIONS */}
          <div style={styles.actions}>
            {r.status === "pending" && (
              <button
                style={styles.cancelBtn}
                onClick={() => cancelRequest(r._id)}
              >
                Cancel
              </button>
            )}

            {r.status === "accepted" && (
              <button
                style={styles.deliverBtn}
                onClick={() => deliverRequest(r._id)}
              >
                Mark Delivered
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* =====================
   Styles
===================== */

const styles = {
  container: {
    maxWidth: 600,
    margin: "30px auto",
    padding: 20,
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    background: "#fff",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actions: {
    marginTop: 10,
    display: "flex",
    gap: 10,
  },
  cancelBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer",
  },
  deliverBtn: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer",
  },
};

/* =====================
   Status Badge
===================== */

const badge = (status) => ({
  padding: "4px 10px",
  borderRadius: 12,
  fontSize: 12,
  color: "#fff",
  background:
    status === "pending"
      ? "#f59e0b"
      : status === "accepted"
      ? "#2563eb"
      : status === "rejected"
      ? "#6b7280"
      : status === "cancelled"
      ? "#dc2626"
      : "#16a34a",
});
