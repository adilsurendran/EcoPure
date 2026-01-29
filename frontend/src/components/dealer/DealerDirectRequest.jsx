import { useState } from "react";
import { createDirectRequest } from "../../api/dealer.api";

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

      alert("Request sent to admin");

      setForm({
        wasteType: "",
        quantityKg: "",
        amountPerKg: "",
        description: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <h2>Send Waste Request to Admin</h2>

      <form onSubmit={submit} style={formStyle}>
        <input
          name="wasteType"
          placeholder="Waste Type (paper, ewaste...)"
          value={form.wasteType}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="quantityKg"
          placeholder="Quantity (kg)"
          value={form.quantityKg}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="amountPerKg"
          placeholder="Amount per kg (₹)"
          value={form.amountPerKg}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Request"}
        </button>
      </form>
    </div>
  );
}

const container = {
  maxWidth: 420,
  margin: "40px auto",
  padding: 20,
  border: "1px solid #ddd",
  borderRadius: 10,
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};
