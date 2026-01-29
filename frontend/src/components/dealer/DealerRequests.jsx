import { useEffect, useState } from "react";
import { cancelDealerRequest, getDealerRequests, markDelivered } from "../../api/dealer.api";


export default function DealerRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const res = await getDealerRequests();
    setRequests(res.data);
  };

  const cancelRequest = async (id) => {
    if (!confirm("Cancel this request?")) return;
    await cancelDealerRequest(id);
    loadRequests();
  };

  const deliverRequest = async (id) => {
    if (!confirm("Mark as delivered?")) return;
    await markDelivered(id);
    loadRequests();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>My Requests</h2>

      {requests.length === 0 && <p>No requests found</p>}

      {requests.map((r) => (
        <div key={r._id} style={card}>
          <h4>{r.wastePostId?.wasteType}</h4>
          <p>Weight: {r.requiredWeight} kg</p>
          <p>Price: ₹{r.wastePostId?.pricePerKg} / kg</p>
          <p>
            Status: <strong>{r.status}</strong>
          </p>

          {r.status === "pending" && (
            <button onClick={() => cancelRequest(r._id)}>
              Cancel
            </button>
          )}

          {r.status === "approved" && (
            <button onClick={() => deliverRequest(r._id)}>
              Mark Delivered
            </button>
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
  marginTop: 10,
};
