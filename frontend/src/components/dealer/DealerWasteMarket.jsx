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

export default function DealerWasteMarket() {
  const [posts, setPosts] = useState([]);
  const [weight, setWeight] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const res = await getAllWastePosts();
    setPosts(res.data);
  };

  const handleWeightChange = (post, value) => {
    const num = Number(value);

    if (num > post.availableWeight) {
      setErrors({
        ...errors,
        [post._id]: `Max available is ${post.availableWeight} kg`,
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

      alert("Request sent");
      setWeight({});
    } catch (err) {
      alert(err.response?.data?.message || "Request failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Available Waste</h2>

      {posts.map((p) => {
        const hasError = !!errors[p._id];

        return (
          <div key={p._id} style={card}>
            <h4>{p.wasteType}</h4>
            <p>Total: {p.totalWeight} kg</p>
            <p>Available: {p.availableWeight} kg</p>
            <p>₹ {p.pricePerKg} / kg</p>

            <input
              type="number"
              min="1"
              max={p.availableWeight}
              placeholder="Required kg"
              value={weight[p._id] || ""}
              onChange={(e) =>
                handleWeightChange(p, e.target.value)
              }
              style={{
                borderColor: hasError ? "red" : "#ccc",
              }}
            />

            {hasError && (
              <small style={{ color: "red" }}>
                {errors[p._id]}
              </small>
            )}

            <br />

            <button
              onClick={() => sendRequest(p)}
              disabled={hasError || !weight[p._id]}
            >
              Send Request
            </button>
          </div>
        );
      })}
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  padding: 15,
  borderRadius: 8,
  marginTop: 10,
};
