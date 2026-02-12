import { useEffect, useState } from "react";
import { getAdminStats } from "../../api/admin.api";
import {
  Users,
  HardHat,
  Store,
  MessageSquareWarning,
  PackageSearch,
  Truck,
  ArrowRight,
  LayoutDashboard,
  ClipboardList,
  UserCheck,
  Megaphone,
  Settings,
  ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./styles/AdminTable.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkers: 0,
    totalDealers: 0,
    pendingComplaints: 0,
    pendingWasteRequests: 0,
    pendingDirectRequests: 0,
    pendingUserPickups: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStats();
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const navCards = [
    { title: "Citizen Network", desc: "Manage registered users", icon: <Users size={24} />, path: "/admin/users", color: "#3b82f6" },
    { title: "Worker Force", desc: "Field team coordination", icon: <HardHat size={24} />, path: "/admin/workers", color: "#f59e0b" },
    { title: "Dealer Portal", desc: "Eco-partner management", icon: <Store size={24} />, path: "/admin/dealers", color: "#10b981" },
    { title: "Waste Market", desc: "Manage inventory posts", icon: <PackageSearch size={24} />, path: "/admin/post", color: "#8b5cf6" },
    { title: "Market Requests", desc: "Review material bids", icon: <ClipboardList size={24} />, path: "/admin/waste/request", color: "#ec4899" },
    { title: "Custom Orders", desc: "Direct procurement", icon: <Truck size={24} />, path: "/admin/waste/dealer/request", color: "#06b6d4" },
    { title: "Complaints", desc: "User grievance center", icon: <MessageSquareWarning size={24} />, path: "/admin/complaints", color: "#ef4444" },
    { title: "User Feedback", desc: "System reviews & ratings", icon: <Megaphone size={24} />, path: "/admin/feedback", color: "#6366f1" },
    { title: "Worker Dispatch", desc: "Assign field tasks", icon: <UserCheck size={24} />, path: "/admin/assign", color: "#22c55e" },
  ];

  if (loading) return (
    <div className="admin-page-container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loader"></div>
    </div>
  );

  return (
    <div className="admin-page-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '1rem', overflowY: 'auto' }}>
      {/* HEADER */}
      <div className="page-header" style={{ marginBottom: '1.5rem', padding: '1.25rem 2rem' }}>
        <div className="header-content">
          <h1>Control Center</h1>
          <p>Real-time system health and operation metrics.</p>
        </div>
        <div className="badge badge-active" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
          <ShieldCheck size={16} style={{ marginRight: '8px' }} />
          System Operational
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div className="stat-card" style={{ padding: '0.75rem 1rem' }}>
          <div className="stat-icon green" style={{ width: '40px', height: '40px', fontSize: '1.25rem' }}>
            <Users size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Users</span>
            <span className="stat-value" style={{ fontSize: '1.25rem' }}>{stats.totalUsers}</span>
          </div>
        </div>

        {/* <div className="stat-card" style={{ padding: '0.75rem 1rem' }}>
          <div className="stat-icon green" style={{ width: '40px', height: '40px', fontSize: '1.25rem' }}>
            <HardHat size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Workers</span>
            <span className="stat-value" style={{ fontSize: '1.25rem' }}>{stats.totalWorkers}</span>
          </div>
        </div> */}

        <div className="stat-card" style={{ padding: '0.75rem 1rem' }}>
          <div className="stat-icon green" style={{ width: '40px', height: '40px', fontSize: '1.25rem' }}>
            <Store size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Dealers</span>
            <span className="stat-value" style={{ fontSize: '1.25rem' }}>{stats.totalDealers}</span>
          </div>
        </div>

        <div className="stat-card" style={{ padding: '0.75rem 1rem', borderLeft: '4px solid #ef4444' }}>
          <div className="stat-info">
            <span className="stat-label" style={{ color: '#ef4444' }}>Complaints</span>
            <span className="stat-value" style={{ fontSize: '1.25rem' }}>{stats.pendingComplaints}</span>
          </div>
          <MessageSquareWarning size={24} color="#ef4444" style={{ opacity: 0.2, marginLeft: 'auto' }} />
        </div>

        <div className="stat-card" style={{ padding: '0.75rem 1rem', borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-info">
            <span className="stat-label" style={{ color: '#f59e0b' }}>Dealer Bids</span>
            <span className="stat-value" style={{ fontSize: '1.25rem' }}>{stats.pendingWasteRequests}</span>
          </div>
          <ClipboardList size={24} color="#f59e0b" style={{ opacity: 0.2, marginLeft: 'auto' }} />
        </div>

        <div className="stat-card" style={{ padding: '0.75rem 1rem', borderLeft: '4px solid #06b6d4' }}>
          <div className="stat-info">
            <span className="stat-label" style={{ color: '#06b6d4' }}>Procurement</span>
            <span className="stat-value" style={{ fontSize: '1.25rem' }}>{stats.pendingDirectRequests}</span>
          </div>
          <Truck size={24} color="#06b6d4" style={{ opacity: 0.2, marginLeft: 'auto' }} />
        </div>

        <div className="stat-card" style={{ padding: '0.75rem 1rem', borderLeft: '4px solid #3b82f6' }}>
          <div className="stat-info">
            <span className="stat-label" style={{ color: '#3b82f6' }}>User Pickups</span>
            <span className="stat-value" style={{ fontSize: '1.25rem' }}>{stats.pendingUserPickups}</span>
          </div>
          <Truck size={24} color="#3b82f6" style={{ opacity: 0.2, marginLeft: 'auto' }} />
        </div>
      </div>

      {/* QUICK LINKS GRID */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--deep-green)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <LayoutDashboard size={20} />
        Module Navigator
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', paddingBottom: '2rem' }}>
        {navCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => navigate(card.path)}
            className="table-card"
            style={{
              padding: '1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              e.currentTarget.style.borderColor = card.color;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)';
            }}
          >
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: `${card.color}15`,
              color: card.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {card.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-dark)' }}>{card.title}</h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{card.desc}</p>
            </div>
            <ArrowRight size={18} color="#cbd5e1" />
          </div>
        ))}
      </div>
    </div>
  );
}
