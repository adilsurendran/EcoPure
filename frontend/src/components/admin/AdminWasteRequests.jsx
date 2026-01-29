import { useEffect, useState } from "react";
import { approveWasteRequest, getAllWasteRequests, rejectWasteRequest } from "../../api/admin.api";


export default function AdminWasteRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const res = await getAllWasteRequests();
    setRequests(res.data);
  };

  const approve = async (id) => {
    if (!confirm("Approve this request?")) return;
    try {
      await approveWasteRequest(id);
      loadRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Approval failed");
    }
  };

  const reject = async (id) => {
    if (!confirm("Reject this request?")) return;
    await rejectWasteRequest(id);
    loadRequests();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Dealer Waste Requests</h2>

      {requests.length === 0 && <p>No requests found</p>}

      {requests.map((r) => (
        <div key={r._id} style={card}>
          <h4>{r.wastePostId?.wasteType}</h4>

          <p>
            Dealer: <b>{r.dealerId?.name}</b> (
            {r.dealerId?.phone})
          </p>

          <p>Requested: {r.requiredWeight} kg</p>
          <p>
            Available:{" "}
            {r.wastePostId?.availableWeight} kg
          </p>

          <p>Status: <b>{r.status}</b></p>

          {r.status === "pending" && (
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => approve(r._id)}>
                Approve
              </button>
              <button onClick={() => reject(r._id)}>
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  padding: 15,
  borderRadius: 8,
  marginTop: 12,
};
