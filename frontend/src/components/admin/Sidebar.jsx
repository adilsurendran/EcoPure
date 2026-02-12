import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  HardHat,
  Store,
  Truck,
  FileText,
  ClipboardList,
  ArrowRightLeft,
  AlertCircle,
  MessageSquare,
  LogOut
} from "lucide-react";

export default function Sidebar() {
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
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="logo">EcoPure</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/admin" end>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/users">
          <Users size={20} />
          <span>View Users</span>
        </NavLink>
        <NavLink to="/admin/workers">
          <HardHat size={20} />
          <span>Manage Workers</span>
        </NavLink>
        <NavLink to="/admin/dealers">
          <Store size={20} />
          <span>Dealers</span>
        </NavLink>
        <NavLink to="/admin/assign">
          <Truck size={20} />
          <span>Assign Pickups</span>
        </NavLink>
        <NavLink to="/admin/post">
          <FileText size={20} />
          <span>My posts</span>
        </NavLink>
        <NavLink to="/admin/waste/request">
          <ClipboardList size={20} />
          <span>Dealers post Requests</span>
        </NavLink>
        <NavLink to="/admin/waste/dealer/request">
          <ArrowRightLeft size={20} />
          <span>Delears direct Requests</span>
        </NavLink>
        <NavLink to="/admin/complaints">
          <AlertCircle size={20} />
          <span>Complaints</span>
        </NavLink>
        <NavLink to="/admin/feedback">
          <MessageSquare size={20} />
          <span>Feedback</span>
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
