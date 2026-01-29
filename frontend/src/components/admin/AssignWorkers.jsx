import { useEffect, useState } from "react";

import "./styles/assignWorkers.css";
import { assignWorker, completePickup, fetchAvailableWorkers, fetchPickups } from "../../api/pickup.api";

export default function AssignWorkers() {
  const [pickups, setPickups] = useState([]);
  const [status, setStatus] = useState("pending");
  const [workers, setWorkers] = useState([]);
  const [assignFor, setAssignFor] = useState(null);

  const loadPickups = async () => {
    const res = await fetchPickups(status);
    setPickups(res.data);
  };

  useEffect(() => {
    loadPickups();
  }, [status]);

  const openAssign = async (pickupId) => {
    const res = await fetchAvailableWorkers();
    setWorkers(res.data);
    setAssignFor(pickupId);
  };

  const handleAssign = async (workerId) => {
    await assignWorker({ pickupId: assignFor, workerId });
    setAssignFor(null);
    loadPickups();
  };

  const handleComplete = async (id) => {
    await completePickup(id);
    loadPickups();
  };

  return (
    <div className="admin-pickups">
      <h1>Pickup Requests</h1>

      {/* FILTER */}
      <div className="filter-bar">
        {["all", "pending", "assigned", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            className={status === s ? "active" : ""}
            onClick={() => setStatus(s)}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <table className="pickup-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Waste</th>
            <th>Status</th>
            <th>Worker</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {pickups.map((p) => (
            <tr key={p._id}>
              <td>{p.userId?.name}</td>
              <td>{p.wasteType}</td>
              <td>{p.status}</td>
              <td>
                {p.workerId
                  ? `${p.workerId.name} (${p.workerId.phone})`
                  : "-"}
              </td>
              <td>
                {p.status === "pending" && (
                  <>
                    <button onClick={() => openAssign(p._id)}>
                      Assign
                    </button>
                  </>
                )}

                {p.status === "assigned" && (
                  <button onClick={() => handleComplete(p._id)}>
                    Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ASSIGN MODAL */}
      {assignFor && (
  <div className="modal-backdrop">
    <div className="modal-card">
      <div className="modal-header">
        <h3>Assign Worker</h3>
        <button
          className="modal-close"
          onClick={() => setAssignFor(null)}
        >
          ✕
        </button>
      </div>

      <div className="modal-body">
        {workers.length === 0 && (
          <p className="empty-text">
            No available workers
          </p>
        )}

        {workers.map((w) => (
          <div
            key={w._id}
            className="worker-row"
            onClick={() => handleAssign(w._id)}
          >
            <div className="worker-info">
              <p className="worker-name">{w.name}</p>
              <p className="worker-phone">{w.phone}</p>
            </div>

            <span className="assign-tag">Assign</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

    </div>
  );
}
