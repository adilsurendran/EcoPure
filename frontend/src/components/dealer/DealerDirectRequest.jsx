import { useState } from "react";
import { createDirectRequest } from "../../api/dealer.api";
import "../styles/UserPremium.css";
import {
  PlusCircle,
  Package,
  Weight,
  IndianRupee,
  FileText,
  Send,
  AlertCircle
} from "lucide-react";

export default function DealerDirectRequest() {
  const [form, setForm] = useState({
    wasteType: "",
    quantityKg: "",
    amountPerKg: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.wasteType || !form.quantityKg || !form.amountPerKg) {
      return alert("All required fields must be filled");
    }

    try {
      setLoading(true);

      await createDirectRequest({
        wasteType: form.wasteType,
        quantityKg: Number(form.quantityKg),
        amountPerKg: Number(form.amountPerKg),
        description: form.description,
      });

      alert("Procurement request successfully transmitted to administration.");

      setForm({
        wasteType: "",
        quantityKg: "",
        amountPerKg: "",
        description: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to transmit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-premium-container">
      <div className="user-premium-header">
        <div className="user-header-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <PlusCircle size={20} color="#059669" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--user-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Custom Procurement</span>
          </div>
          <h1>Indirect Request</h1>
          <p>Request specific waste materials directly from the administration network.</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <div className="user-stat-card" style={{ padding: '2.5rem', width: '100%', maxWidth: '600px', flexDirection: 'column', alignItems: 'stretch' }}>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="user-field-group">
              <label><Package size={14} style={{ marginRight: '6px' }} /> Waste Material Type</label>
              <input
                name="wasteType"
                placeholder="e.g. Industrial Plastic, Scrap Metal"
                value={form.wasteType}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="user-field-group">
                <label><Weight size={14} style={{ marginRight: '6px' }} /> Target Quantity (kg)</label>
                <input
                  type="number"
                  name="quantityKg"
                  placeholder="0.00"
                  value={form.quantityKg}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="user-field-group">
                <label><IndianRupee size={14} style={{ marginRight: '6px' }} /> Proposed Price / kg</label>
                <input
                  type="number"
                  name="amountPerKg"
                  placeholder="0.00"
                  value={form.amountPerKg}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="user-field-group">
              <label><FileText size={14} style={{ marginRight: '6px' }} /> Additional Specifications</label>
              <textarea
                name="description"
                placeholder="Enter detailed material requirements or logistical constraints..."
                value={form.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div style={{ background: 'rgba(14, 165, 233, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(14, 165, 233, 0.1)', display: 'flex', gap: '0.75rem' }}>
              <AlertCircle size={20} color="#0ea5e9" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                This request will be reviewed by administrators. You will be notified once a match is found in the logistics network.
              </p>
            </div>

            <button
              type="submit"
              className="user-btn-premium user-btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
            >
              {loading ? "Transmitting..." : (
                <>
                  <Send size={18} />
                  <span>Transmit Procurement Request</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
