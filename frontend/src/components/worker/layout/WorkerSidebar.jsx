import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  LayoutDashboard,
  Truck,
  History,
  LogOut
} from "lucide-react";

export default function WorkerSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <aside className="worker-sidebar">
      <div className="sidebar-header">
        <h2 className="logo">EcoPure</h2>
      </div>

      <nav>
        {/* <NavLink to="/worker" end>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink> */}
        <NavLink to="/worker/assigned">
          <Truck size={20} />
          <span>Assigned Pickups</span>
        </NavLink>
        <NavLink to="/worker/history">
          <History size={20} />
          <span>Pickup History</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
