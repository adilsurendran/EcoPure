import UserSidebar from "./UserSidebar";
import UserTopbar from "./UserTopbar";
import "../../styles/user.css"
export default function UserLayout({ children }) {
  return (
    <div className="user-container">
      <UserSidebar />
      <div className="user-main">
        <UserTopbar />
        <div className="user-content">{children}</div>
      </div>
    </div>
  );
}
