import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function DealerTopbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="dealer-topbar">
      <span>Dealer Panel</span>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}
