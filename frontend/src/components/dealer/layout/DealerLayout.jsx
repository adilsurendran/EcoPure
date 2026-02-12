import DealerSidebar from "./DealerSidebar";
import "../../styles/user.css";
import "../../styles/UserPremium.css";

export default function DealerLayout({ children }) {
  return (
    <div className="user-container">
      <DealerSidebar />
      <main className="user-main">
        <div className="user-content">
          {children}
        </div>
      </main>
    </div>
  );
}
