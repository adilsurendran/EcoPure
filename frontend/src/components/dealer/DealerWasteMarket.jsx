// import { useEffect, useState } from "react";
// import { createWasteRequest, getAllWastePosts } from "../../api/dealer.api";


// export default function DealerWasteMarket() {
//   const [posts, setPosts] = useState([]);
//   const [weight, setWeight] = useState({});

//   useEffect(() => {
//     loadPosts();
//   }, []);

//   const loadPosts = async () => {
//     const res = await getAllWastePosts();
//     setPosts(res.data);
//   };

//   const sendRequest = async (postId) => {
//     if (!weight[postId]) {
//       return alert("Enter required weight");
//     }

//     try {
//       await createWasteRequest({
//         wastePostId: postId,
//         requiredWeight: Number(weight[postId]),
//       });

//       alert("Request sent");
//       setWeight({});
//     } catch (err) {
//       alert(err.response?.data?.message || "Request failed");
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Available Waste</h2>

//       {posts.map((p) => (
//         <div key={p._id} style={card}>
//           <h4>{p.wasteType}</h4>
//           <p>Total: {p.totalWeight} kg</p>
//           <p>Available: {p.availableWeight} kg</p>
//           <p>₹ {p.pricePerKg} / kg</p>

//           <input
//             type="number"
//             placeholder="Required kg"
//             value={weight[p._id] || ""}
//             onChange={(e) =>
//               setWeight({ ...weight, [p._id]: e.target.value })
//             }
//           />

//           <button onClick={() => sendRequest(p._id)}>
//             Send Request
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

// const card = {
//   border: "1px solid #ddd",
//   padding: 15,
//   borderRadius: 8,
//   marginTop: 10,
// };

import { useEffect, useState } from "react";
import { createWasteRequest, getAllWastePosts } from "../../api/dealer.api";
import "../styles/UserPremium.css";
import {
  ShoppingBag,
  Weight,
  IndianRupee,
  Send,
  Package,
  Info,
  ChevronRight
} from "lucide-react";

export default function DealerWasteMarket() {
  const [posts, setPosts] = useState([]);
  const [weight, setWeight] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await getAllWastePosts();
      console.log(res.data);
      
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWeightChange = (post, value) => {
    const num = Number(value);

    if (num > post.availableWeight) {
      setErrors({
        ...errors,
        [post._id]: `Only ${post.availableWeight}kg available`,
      });
    } else if (num < 0) {
      setErrors({
        ...errors,
        [post._id]: "Invalid amount",
      });
    } else {
      const newErrors = { ...errors };
      delete newErrors[post._id];
      setErrors(newErrors);
    }

    setWeight({ ...weight, [post._id]: value });
  };

  const sendRequest = async (post) => {
    const requested = Number(weight[post._id]);

    if (!requested || requested <= 0) {
      return alert("Enter valid weight");
    }

    if (requested > post.availableWeight) {
      return alert("Requested weight exceeds available");
    }

    try {
      await createWasteRequest({
        wastePostId: post._id,
        requiredWeight: requested,
      });

      alert("Transaction request sent successfully. Awaiting confirmation.");
      setWeight({ ...weight, [post._id]: "" });
      loadPosts();
    } catch (err) {
      alert(err.response?.data?.message || "Request failed");
    }
  };

  return (
    <div className="user-premium-container">
      <div className="user-premium-header">
        <div className="user-header-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <ShoppingBag size={20} color="#059669" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--user-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Market</span>
          </div>
          <h1>Waste Inventory</h1>
          <p>Discover available waste materials for industrial procurement.</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Analyzing market demand...</div>
      ) : posts.length === 0 ? (
        <div className="user-empty-state">
          <Package size={48} color="#cbd5e1" />
          <h3 style={{ marginTop: '1rem', color: 'var(--user-text-main)' }}>Market is empty</h3>
          <p style={{ color: 'var(--user-text-muted)' }}>Check back later for new waste listings.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {posts.map((p) => {
            const hasError = !!errors[p._id];

            return (
              <div key={p._id} className="user-stat-card" style={{ flexDirection: 'column', alignItems: 'stretch', padding: 0, overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '200px', width: '100%', background: '#f1f5f9' }}>
                  {p.photo ? (
                    <img
                      src={`http://localhost:8000/uploads/waste/${p.photo}`}
                      alt={p.wasteType}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={48} color="#94a3b8" />
                    </div>
                  )}
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--user-text-main)', marginBottom: '1rem', textTransform: 'capitalize' }}>{p.wasteType}</h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--user-text-muted)', fontSize: '0.9rem' }}>
                      <Weight size={16} />
                      <span>{p.availableWeight} kg available</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--user-primary)', fontWeight: 600 }}>
                      <IndianRupee size={16} />
                      <span>₹ {p.pricePerKg} / kg</span>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
                      Purchase Order Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={p.availableWeight}
                      placeholder="0.00"
                      value={weight[p._id] || ""}
                      onChange={(e) => handleWeightChange(p, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid ' + (hasError ? '#ef4444' : '#e2e8f0'),
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        outline: 'none',
                        background: 'white',
                        transition: 'all 0.2s'
                      }}
                    />
                    {hasError && (
                      <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Info size={12} />
                        {errors[p._id]}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => sendRequest(p)}
                    disabled={hasError || !weight[p._id]}
                    className="user-btn-premium user-btn-primary"
                    style={{ width: '100%', justifyContent: 'center', opacity: (hasError || !weight[p._id]) ? 0.6 : 1 }}
                  >
                    <Send size={18} />
                    <span>Send Procurement Request</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
