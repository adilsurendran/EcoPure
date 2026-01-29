import DealerSidebar from "./DealerSidebar";
import DealerTopbar from "./DealerTopbar";
import "../../styles/dealer.css";

export default function DealerLayout({ children }) {
  return (
    <div className="dealer-container">
      <DealerSidebar />
      <div className="dealer-main">
        <DealerTopbar />
        <div className="dealer-content">{children}</div>
      </div>
    </div>
  );
}
