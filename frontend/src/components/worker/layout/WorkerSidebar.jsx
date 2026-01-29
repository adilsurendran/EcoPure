import { NavLink } from "react-router-dom";

export default function WorkerSidebar() {
  return (
    <aside className="worker-sidebar">
      <h2 className="logo">EcoPure</h2>

      <nav>
        <NavLink to="/worker" end>Dashboard</NavLink>
        <NavLink to="/worker/assigned">Assigned Pickups</NavLink>
        <NavLink to="/worker/history">Pickup History</NavLink>
      </nav>
    </aside>
  );
}
