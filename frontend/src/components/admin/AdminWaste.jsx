import { useEffect, useState } from "react";
import { createWastePost, deleteWastePost, getAdminWastePosts, updateWastePost } from "../../api/admin.api";


export default function AdminWaste() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [form, setForm] = useState({
    wasteType: "",
    totalWeight: "",
    pricePerKg: "",
    description: "",
  });

  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const res = await getAdminWastePosts();
    setPosts(res.data);
  };

  const openAdd = () => {
    setEditingPost(null);
    setForm({
      wasteType: "",
      totalWeight: "",
      pricePerKg: "",
      description: "",
    });
    setShowModal(true);
  };

  const openEdit = (post) => {
    setEditingPost(post);
    setForm(post);
    setShowModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (photo) fd.append("photo", photo);

    if (editingPost) {
      await updateWastePost(editingPost._id, fd);
    } else {
      await createWastePost(fd);
    }

    setShowModal(false);
    loadPosts();
  };

  const remove = async (id) => {
    if (confirm("Delete this post?")) {
      await deleteWastePost(id);
      loadPosts();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Waste Management</h2>
        <button onClick={openAdd}>+ Add Waste</button>
      </div>

      {posts.map((p) => (
        <div key={p._id} style={card}>
          <h4>{p.wasteType}</h4>
          <p>Total: {p.totalWeight} kg</p>
          <p>Available: {p.availableWeight} kg</p>
          <p>₹ {p.pricePerKg}/kg</p>

          <button onClick={() => openEdit(p)}>Edit</button>
          <button onClick={() => remove(p._id)}>Delete</button>
        </div>
      ))}

      {showModal && (
        <div style={modal}>
          <form onSubmit={submit} style={modalBox}>
            <h3>{editingPost ? "Edit Waste" : "Add Waste"}</h3>

            <input
              placeholder="Waste Type"
              value={form.wasteType}
              onChange={(e) =>
                setForm({ ...form, wasteType: e.target.value })
              }
              required
            />

            <input
              type="number"
              placeholder="Total Weight (kg)"
              value={form.totalWeight}
              onChange={(e) =>
                setForm({ ...form, totalWeight: e.target.value })
              }
              required
            />

            <input
              type="number"
              placeholder="Price / kg"
              value={form.pricePerKg}
              onChange={(e) =>
                setForm({ ...form, pricePerKg: e.target.value })
              }
              required
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />

            <button type="submit">Save</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  padding: 15,
  marginTop: 10,
  borderRadius: 8,
};

const modal = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalBox = {
  background: "#fff",
  padding: 20,
  width: 350,
  borderRadius: 10,
};
