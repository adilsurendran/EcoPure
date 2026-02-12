import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Clock,
  LogOut,
  Package,
  ListChecks,
  Bell
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function DealerSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout from Dealer Portal?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <aside className="user-sidebar">
      <h2 className="logo">EcoPure</h2>

      <nav>
        <NavLink to="/dealer" end title="Dashboard">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/dealer/profile" title="Profile">
          <User size={20} />
          <span>My Profile</span>
        </NavLink>

        <NavLink to="/dealer/posts" title="Waste Market">
          <ShoppingBag size={20} />
          <span>Waste Market</span>
        </NavLink>

        <NavLink to="/dealer/request" title="Custom Procurement">
          <Package size={20} />
          <span>Indirect Request</span>
        </NavLink>

        <NavLink to="/dealer/status" title="Request Status">
          <Clock size={20} />
          <span>Pipeline Status</span>
        </NavLink>

        <NavLink to="/dealer/requests" title="Transaction History">
          <ListChecks size={20} />
          <span>Market History</span>
        </NavLink>
      </nav>

      <div className="user-sidebar-footer">
        <button onClick={handleLogout} className="logout-btn-premium">
          <LogOut size={20} />
          <span>Logout Portal</span>
        </button>
      </div>
    </aside>
  );
}
