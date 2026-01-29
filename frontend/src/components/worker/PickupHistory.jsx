import { useEffect, useState } from "react";
import { fetchPickupHistory } from "../../api/pickup.api";

export default function PickupHistory() {
  const [pickups, setPickups] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const res = await fetchPickupHistory();
    setPickups(res.data);
  };

  return (
    <div className="worker-page">
      <h1>Pickup History</h1>

      {pickups.length === 0 && (
        <p>No completed pickups</p>
      )}

      {pickups.map((p) => (
        <div key={p._id} className="pickup-card completed">
          <p><strong>User:</strong> {p.userId.name}</p>
          <p><strong>Phone:</strong> {p.userId.phone}</p>
          <p><strong>Waste:</strong> {p.wasteType}</p>
          <p><strong>Address:</strong> {p.address}</p>
          <p><strong>Status:</strong> {p.status}</p>
          <p><strong>Status Time:</strong> {new Date(p.updatedAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
