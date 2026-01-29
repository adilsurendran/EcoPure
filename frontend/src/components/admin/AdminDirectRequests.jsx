import { useEffect, useState } from "react";
import { acceptDirectRequest, getAllDirectRequests, rejectDirectRequest } from "../../api/admin.api";


export default function AdminDirectRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await getAllDirectRequests();
      setRequests(res.data);
    } catch {
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const accept = async (id) => {
    if (!confirm("Accept this request?")) return;
    await acceptDirectRequest(id);
    loadRequests();
  };

  const reject = async (id) => {
    if (!confirm("Reject this request?")) return;
    await rejectDirectRequest(id);
    loadRequests();
  };

  if (loading) return <p>Loading requests...</p>;

  return (
    <div style={styles.container}>
      <h2>Dealer Direct Requests</h2>

      {requests.length === 0 && <p>No requests found</p>}

      {requests.map((r) => (
        <div key={r._id} style={styles.card}>
          <div style={styles.row}>
            <strong>{r.wasteType}</strong>
            <span style={badge(r.status)}>
              {r.status.toUpperCase()}
            </span>
          </div>

          <p>
            Dealer: <b>{r.dealerId?.name}</b> (
            {r.dealerId?.phone})
          </p>

          <p>Quantity: {r.quantityKg} kg</p>
          <p>Price: ₹{r.amountPerKg} / kg</p>

          {r.description && (
            <p>Description: {r.description}</p>
          )}

          <p>
            Requested on:{" "}
            {new Date(r.createdAt).toLocaleDateString()}
          </p>

          {r.status === "pending" && (
            <div style={styles.actions}>
              <button
                style={styles.acceptBtn}
                onClick={() => accept(r._id)}
              >
                Accept
              </button>
              <button
                style={styles.rejectBtn}
                onClick={() => reject(r._id)}
              >
                Reject
              </button>
            </div>
          )}
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
    maxWidth: 700,
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
    marginTop: 12,
    display: "flex",
    gap: 10,
  },
  acceptBtn: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer",
  },
  rejectBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer",
  },
};

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
      ? "#dc2626"
      : "#16a34a",
});
