import { useEffect, useState } from "react";
import { getAllComplaints, replyComplaint } from "../../api/admin.api";


export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [reply, setReply] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getAllComplaints();
    setComplaints(res.data);
  };

  const sendReply = async (id) => {
    if (!reply.trim()) return alert("Reply required");

    await replyComplaint(id, reply);
    setReply("");
    load();
  };

  return (
    <div style={{ maxWidth: 800, margin: "30px auto" }}>
      <h2>Complaint Management</h2>

      {complaints.map((c) => (
        <div key={c._id} style={card}>
          <p><b>User:</b> {c.userId?.name} ({c.userId?.phone})</p>
          <p><b>Complaint:</b> {c.message}</p>

          {c.reply ? (
            <p style={{ color: "green" }}>
              <b>Reply:</b> {c.reply}
            </p>
          ) : (
            <>
              <textarea
                placeholder="Type reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <button onClick={() => sendReply(c._id)}>
                Send Reply
              </button>
            </>
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
  padding: 15,
  borderRadius: 10,
  marginTop: 15,
};
