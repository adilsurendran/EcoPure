import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  MessageSquare,
  AlertCircle,
  User as UserIcon,
  LogOut,
  Send
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function UserSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <aside className="user-sidebar">
      <h2 className="logo">EcoPure</h2>

      <nav>
        <NavLink title="Dashboard" to="/user" end>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink title="Pickup Status" to="/user/status">
          <MapPin size={20} />
          <span>Pickup Status</span>
        </NavLink>
        <NavLink title="Feedback" to="/user/feedback">
          <MessageSquare size={20} />
          <span>Feedback</span>
        </NavLink>
        <NavLink title="My Complaints" to="/user/complaints">
          <AlertCircle size={20} />
          <span>My Complaints</span>
        </NavLink>
        <NavLink title="Send Complaint" to="/user/sendcomplaints">
          <Send size={20} />
          <span>Send Complaint</span>
        </NavLink>
        <NavLink title="Profile" to="/user/profile">
          <UserIcon size={20} />
          <span>Profile</span>
        </NavLink>
      </nav>

      <div className="user-sidebar-footer">
        <button className="logout-btn-premium" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
