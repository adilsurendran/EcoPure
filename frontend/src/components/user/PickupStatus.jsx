import { useEffect, useState } from "react";
import PickupRequest from "./PickupRequest";
import "./pickup.css";

import {
  fetchMyPickupRequests,
  cancelPickupRequest,
  collectPickupRequest,
} from "../../api/pickup.api";

export default function PickupStatus() {
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const res = await fetchMyPickupRequests();
      setRequests(res.data);
    } catch (err) {
      alert("Failed to load pickup requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  /* ======================
     ACTION HANDLERS
  ====================== */

  const handleCancel = async (id) => {
    if (!confirm("Cancel this pickup request?")) return;

    await cancelPickupRequest(id);

    // Optimistic UI
    setRequests((prev) =>
      prev.map((req) =>
        req._id === id
          ? { ...req, status: "cancelled" }
          : req
      )
    );
  };

  const handleCollected = async (id) => {
    if (!confirm("Mark pickup as collected?")) return;

    await collectPickupRequest(id);

    // Optimistic UI
    setRequests((prev) =>
      prev.map((req) =>
        req._id === id
          ? { ...req, status: "collected" }
          : req
      )
    );
  };

  /* ======================
     FORM VIEW
  ====================== */

  if (showForm) {
    return (
      <PickupRequest
        onClose={() => {
          setShowForm(false);
          loadRequests();
        }}
      />
    );
  }

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  /* ======================
     MAIN UI
  ====================== */

  return (
    <div className="pickup-status">
      <div className="page-header">
        <h1>Pickup Status</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + New Pickup Request
        </button>
      </div>

      {requests.length === 0 && (
        <p>No pickup requests yet</p>
      )}

      {requests.map((req) => {
        const canCancel =
          req.status === "pending" ||
          req.status === "assigned";

        const canCollect = req.status === "assigned";

        return (
          <div
            key={req._id}
            className="pickup-card"
            data-status={req.status}
          >
            <div className="pickup-card-header">
              <span className="waste-type">
                {req.wasteType}
              </span>

              <div className="pickup-actions">
                <span
                  className={`status-pill ${req.status}`}
                >
                  {req.status}
                </span>

                {canCollect && (
                  <button
                    className="btn-collect"
                    onClick={() =>
                      handleCollected(req._id)
                    }
                  >
                    Collected
                  </button>
                )}

                {canCancel && (
                  <button
                    className="btn-cancel"
                    onClick={() =>
                      handleCancel(req._id)
                    }
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <p className="pickup-address">
              {req.address}
            </p>

            {req.workerId && (
              <p className="pickup-worker">
                Worker: {req.workerId.name} (
                {req.workerId.phone})
              </p>
            )}

            <p className="pickup-date">
              {new Date(
                req.createdAt
              ).toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}
