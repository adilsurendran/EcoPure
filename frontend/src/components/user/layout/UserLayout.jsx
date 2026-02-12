import UserSidebar from "./UserSidebar";
import "../../styles/user.css";

export default function UserLayout({ children }) {
  return (
    <div className="user-container">
      <UserSidebar />
      <main className="user-main">
        <div className="user-content">{children}</div>
      </main>
    </div>
  );
}
