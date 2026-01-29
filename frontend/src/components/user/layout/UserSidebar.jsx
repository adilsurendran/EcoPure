import { NavLink } from "react-router-dom";

export default function UserSidebar() {
  return (
    <aside className="user-sidebar">
      <h2 className="logo">EcoPure</h2>

      <nav>
        <NavLink to="/user" end>Dashboard</NavLink>
        {/* <NavLink to="/user/request">Pickup Request</NavLink> */}
        <NavLink to="/user/status">Pickup Status</NavLink>
        <NavLink to="/user/feedback">Feedback</NavLink>
        <NavLink to="/user/complaints">Complaints</NavLink>
        <NavLink to="/user/profile">Profile</NavLink>
      </nav>
    </aside>
  );
}
