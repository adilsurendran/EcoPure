import { useState } from "react";
import { sendUserFeedback } from "../../api/user.api";

export default function UserFeedback() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      return alert("Message is required");
    }

    try {
      setLoading(true);
      await sendUserFeedback({ message });
      alert("Feedback sent");
      setMessage("");
    } catch {
      alert("Failed to send feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Send Feedback</h2>

      <form onSubmit={submit} style={styles.form}>
        <textarea
          placeholder="Write your feedback..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 420,
    margin: "40px auto",
    padding: 20,
    border: "1px solid #ddd",
    borderRadius: 10,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
};
