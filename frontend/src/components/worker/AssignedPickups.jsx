import { useEffect, useState } from "react";
import { fetchAssignedPickups } from "../../api/pickup.api";

export default function AssignedPickups() {
  const [pickups, setPickups] = useState([]);

  useEffect(() => {
    loadPickups();
  }, []);

  const loadPickups = async () => {
    const res = await fetchAssignedPickups();
    setPickups(res.data);
  };

  const openMap = (lat, lng) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="worker-page">
      <h1>Assigned Pickup Requests</h1>

      {pickups.length === 0 && (
        <p>No assigned pickups</p>
      )}

      {pickups.map((p) => {
        const hasLocation =
          p.location?.lat && p.location?.lng;

        return (
          <div key={p._id} className="pickup-card">
            <p>
              <strong>User:</strong> {p.userId.name}
            </p>
            <p>
              <strong>Phone:</strong> {p.userId.phone}
            </p>
            <p>
              <strong>Waste:</strong> {p.wasteType}
            </p>
            <p>
              <strong>Address:</strong> {p.address}
            </p>
            <p>
              <strong>Status:</strong> {p.status}
            </p>

            {/* MAP ACTION */}
            {hasLocation && (
              <button
                className="map-btn"
                onClick={() =>
                  openMap(
                    p.location.lat,
                    p.location.lng
                  )
                }
              >
                📍 Open in Maps
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
