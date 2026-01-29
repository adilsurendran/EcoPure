import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";


// Connect Database
connectDB();

// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
