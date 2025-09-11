const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const cron = require("node-cron");
require("dotenv").config();
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const FRONTEND_URL = "https://dapper-lamingt.netlify.app";

const {
  MONGO_URL,
  PORT,
  AGORA_APP_ID,
  AGORA_APP_CERTIFICATE,
} = process.env;

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
const corsOptions= {
  origin: FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

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

/* 
  🎤 Agora Token Generation Route
*/
app.get("/agora/token", (req, res) => {
  const channelName = req.query.channelName;
  const uid = req.query.uid || 0;

  if (!channelName) {
    return res.status(400).json({ error: "channelName is required" });
  }

  try {
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600; // 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      AGORA_APP_ID,
      AGORA_APP_CERTIFICATE,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    return res.json({ token });
  } catch (err) {
    console.error("❌ Error generating Agora token:", err);
    return res.status(500).json({ error: "Failed to generate token" });
  }
});

// Start server
const PORT_USED = PORT || 5000;
server.listen(PORT_USED, () => {
  console.log(`🚀 Server running on port ${PORT_USED}`);
});
