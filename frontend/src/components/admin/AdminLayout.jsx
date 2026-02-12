
import "../styles/admin.css";
import Sidebar from "./Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-main">
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}

