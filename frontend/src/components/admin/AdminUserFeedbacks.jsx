import { useEffect, useState } from "react";
import { getAllUserFeedbacks } from "../../api/admin.api";

export default function AdminUserFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getAllUserFeedbacks();
    setFeedbacks(res.data);
  };

  return (
    <div style={{ maxWidth: 700, margin: "30px auto" }}>
      <h2>User Feedbacks</h2>

      {feedbacks.map((f) => (
        <div key={f._id} style={card}>
          <p>{f.message}</p>

          <p>
            User: <b>{f.userId?.name}</b> (
            {f.userId?.phone})
          </p>

          <small>
            {new Date(f.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  padding: 12,
  borderRadius: 8,
  marginTop: 12,
};
