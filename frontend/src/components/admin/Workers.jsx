import { useEffect, useState } from "react";
import {
  addWorker,
  fetchWorkers,
  toggleWorkerStatus,
} from "../../api/admin.api";
import "./styles/admin.worker.css";

export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    password: "",
    name: "",
    phone: "",
    email: "",
    age: "",
    gender: "male",
  });

  /* ---------------- LOAD WORKERS ---------------- */
  const loadWorkers = async () => {
    setLoading(true);
    try {
      const res = await fetchWorkers();
      setWorkers(res.data);
    } catch (err) {
      console.error("Failed to load workers", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- TOGGLE STATUS (OPTIMISTIC) ---------------- */
  const handleToggle = async (authId) => {
    try {
      await toggleWorkerStatus(authId);

      // Optimistic UI update
      setWorkers((prev) =>
        prev.map((worker) =>
          worker.authId?._id === authId
            ? {
                ...worker,
                authId: {
                  ...worker.authId,
                  isActive: !worker.authId.isActive,
                },
              }
            : worker
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  /* ---------------- ADD WORKER ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addWorker(form);
      setShowModal(false);
      setForm({
        password: "",
        name: "",
        phone: "",
        email: "",
        age: "",
        gender: "male",
      });
      loadWorkers();
    } catch (err) {
      console.error("Failed to add worker", err);
    }
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  if (loading) {
    return <p className="loading-text">Loading workers...</p>;
  }

  return (
    <div className="admin-workers">
      {/* HEADER */}
      <div className="page-header">
        <h1 className="page-title">Workers Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Add Worker
        </button>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {workers.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No workers found
                </td>
              </tr>
            )}

            {workers.map((worker) => {
              const isActive = worker.authId?.isActive;

              return (
                <tr key={worker._id}>
                  <td>{worker.name}</td>
                  <td>{worker.phone}</td>
                  <td>{worker.email || "-"}</td>
                  <td>{worker.gender || "-"}</td>
                  <td>{worker.age || "-"}</td>

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
                        handleToggle(worker.authId._id)
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

      {/* ADD WORKER MODAL */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Add Worker</h2>

            <form onSubmit={handleSubmit}>
              <input
                placeholder="Name"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                placeholder="Phone"
                required
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                required
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={(e) =>
                  setForm({ ...form, age: e.target.value })
                }
              />

              <select
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value })
                }
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
