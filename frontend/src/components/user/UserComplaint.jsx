import { useState } from "react";
import { sendComplaint } from "../../api/user.api";

export default function UserComplaint() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!message.trim()) return alert("Message required");

    try {
      setLoading(true);
      await sendComplaint({ message });
      alert("Complaint submitted");
      setMessage("");
    } catch {
      alert("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={box}>
      <h2>Submit Complaint</h2>

      <form onSubmit={submit} style={form}>
        <textarea
          placeholder="Describe your issue..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

const box = {
  maxWidth: 420,
  margin: "40px auto",
  padding: 20,
  border: "1px solid #ddd",
  borderRadius: 10,
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};
