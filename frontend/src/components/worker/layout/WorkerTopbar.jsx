import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function WorkerTopbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="worker-topbar">
      <span>Worker Panel</span>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}
