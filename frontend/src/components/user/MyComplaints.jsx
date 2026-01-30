import { useEffect, useState } from "react";
import { getMyComplaints } from "../../api/user.api";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getMyComplaints();
    setComplaints(res.data);
  };

  return (
    <div style={{ maxWidth: 650, margin: "30px auto" }}>
      <h2>My Complaints</h2>

      {complaints.length === 0 && <p>No complaints yet</p>}

      {complaints.map((c) => (
        <div key={c._id} style={card}>
          <p><b>Complaint:</b> {c.message}</p>

          {c.reply ? (
            <p style={{ color: "green" }}>
              <b>Admin Reply:</b> {c.reply}
            </p>
          ) : (
            <p style={{ color: "#999" }}>
              Awaiting admin reply
            </p>
          )}

          <small>
            {new Date(c.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  padding: 14,
  borderRadius: 8,
  marginTop: 12,
};
