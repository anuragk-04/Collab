const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const cron = require("node-cron");
require("dotenv").config();

const FRONTEND_URL = "https://dapper-lamingt.netlify.app/";

const { MONGO_URL, PORT} = process.env;

const authRoute = require("./routes/authRoutes");
const roomRoute = require("./routes/roomRoutes");
const userRoute = require("./routes/userRoutes");

const { verifyAuthHeaderAndRole } = require("./middlewares/authMiddlewares");
const Roles = require("./constants/Roles");

const { initSocket } = require("./handler/socketHandler");
const { processCacheToDBStoreForBoardElements } = require("./utils/cronjobs");

const app = express();
const server = http.createServer(app);

// ✅ Robust CORS setup
app.use(
  cors({
    origin: FRONTEND_URL || "*", // fallback to allow all in case env var is missing
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// MongoDB connection
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Initialize socket.io after slight delay (to ensure server is ready)
setTimeout(() => {
  initSocket(server);
}, 1000);

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("🚀 Server is running fine!");
});

app.use("/", authRoute);
app.use("/room", roomRoute); 
app.use("/user", userRoute);

// Test route (protected)
app.post("/test", verifyAuthHeaderAndRole([Roles.USER]), async (req, res) => {
  return res.json({ message: "success" });
});

// Start server
const PORT_USED = PORT || 5000;
server.listen(PORT_USED, () => {
  console.log(`🚀 Server running on port ${PORT_USED}`);
});
