import { NavLink } from "react-router-dom";

export default function DealerSidebar() {
  return (
    <aside className="dealer-sidebar">
      <h2 className="logo">EcoPure</h2>

      <nav>
        <NavLink to="/dealer" end>Dashboard</NavLink>
        <NavLink to="/dealer/profile">My Profile</NavLink>
        <NavLink to="/dealer/request">Waste Requests</NavLink>
        <NavLink to="/dealer/status">Request Status</NavLink>
        <NavLink to="/dealer/posts">Waste posts</NavLink>
        <NavLink to="/dealer/requests">My waste requests</NavLink>
      </nav>
    </aside>
  );
}
