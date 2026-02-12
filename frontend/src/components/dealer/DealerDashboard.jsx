import { useEffect, useState } from "react";
import { getDealerStats } from "../../api/dealer.api";
import "../styles/UserPremium.css";
import {
  ShoppingBag,
  TrendingUp,
  Package,
  ArrowRight,
  Sparkles,
  ClipboardList,
  User,
  Truck,
  Grid
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DealerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activePosts: 0,
    pendingIndirect: 0,
    pendingDirect: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDealerStats();
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load dealer dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const navCards = [
    { title: "Waste Market", desc: "Browse available waste materials", icon: <ShoppingBag size={24} />, path: "/dealer/posts", color: "#059669" },
    { title: "My Requests", desc: "Track your material bids", icon: <ClipboardList size={24} />, path: "/dealer/requests", color: "#0ea5e9" },
    { title: "Direct Orders", desc: "Manage direct procurement", icon: <Truck size={24} />, path: "/dealer/request", color: "#f59e0b" },
    { title: "Request Status", desc: "View all request updates", icon: <TrendingUp size={24} />, path: "/dealer/status", color: "#8b5cf6" },
    { title: "My Profile", desc: "Manage account settings", icon: <User size={24} />, path: "/dealer/profile", color: "#64748b" },
  ];

  if (loading) return (
    <div className="user-premium-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="loader"></div>
    </div>
  );

  return (
    <div className="user-premium-container">
      <div className="user-premium-header">
        <div className="user-header-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Sparkles size={20} color="#059669" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--user-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Dealer Analytics Portal</span>
          </div>
          <h1>Dashboard Overview</h1>
          <p>Real-time insights into your waste trading activities.</p>
        </div>
      </div>

      <div className="user-stats-grid">
        <div className="user-stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(5, 150, 105, 0.1)', color: '#059669' }}>
            <Package size={24} />
          </div>
          <div className="stat-info">
            <h3>Active Waste Posts</h3>
            <p>{stats.activePosts}</p>
          </div>
        </div>
        <div className="user-stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <h3>Pending Indirect</h3>
            <p>{stats.pendingIndirect}</p>
          </div>
        </div>
        <div className="user-stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Truck size={24} />
          </div>
          <div className="stat-info">
            <h3>Pending Direct</h3>
            <p>{stats.pendingDirect}</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Grid size={20} color="var(--user-primary)" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--user-text-main)', margin: 0 }}>Quick Access</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', paddingBottom: '2rem' }}>
        {navCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => navigate(card.path)}
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: '1px solid var(--user-border)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = card.color;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.borderColor = 'var(--user-border)';
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: `${card.color}15`,
              color: card.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {card.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--user-text-main)' }}>{card.title}</h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--user-text-muted)', lineHeight: 1.4 }}>{card.desc}</p>
            </div>
            <ArrowRight size={18} color="#cbd5e1" />
          </div>
        ))}
      </div>
    </div>
  );
}
