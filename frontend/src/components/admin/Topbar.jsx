// import { useNavigate } from "react-router-dom";
// import { logoutUser } from "../../api/auth.api";

// export default function Topbar() {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await logoutUser();
//       setUser(null);
//     } catch (err) {
//       console.error("Logout failed", err);
//     } finally {
//       // Always redirect
//       navigate("/");
//       window.location.reload(); // optional but recommended
//     }
//   };

//   return (
//     <header className="topbar">
//       <span>Admin Dashboard</span>
//       <button className="logout-btn" onClick={handleLogout}>
//         Logout
//       </button>
//     </header>
//   );
// }

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      navigate("/");
    }
  };

  return (
    <header className="topbar">
      <span>Admin Dashboard</span>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}
