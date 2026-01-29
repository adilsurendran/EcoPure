import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">EcoPure</h2>

      <nav>
        <NavLink to="/admin" end>Dashboard</NavLink>
        <NavLink to="/admin/users">View Users</NavLink>
        <NavLink to="/admin/workers">Manage Workers</NavLink>
        <NavLink to="/admin/dealers">Dealers</NavLink>
        <NavLink to="/admin/assign">Assign Pickups</NavLink>
        <NavLink to="/admin/post">My posts</NavLink>
        <NavLink to="/admin/waste/request">Dealers post Requests</NavLink>
        <NavLink to="/admin/waste/dealer/request">Delears direct Requests</NavLink>
        <NavLink to="/admin/complaints">Complaints</NavLink>
        <NavLink to="/admin/feedback">Feedback</NavLink>
      </nav>
    </aside>
  );
}
