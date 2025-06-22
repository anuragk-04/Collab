const express = require("express");
const mongoose = require("mongoose");
const app = express();
const http = require("http");
const cors = require("cors");
const cron = require('node-cron');
require("dotenv").config();
const { MONGO_URL, PORT } = process.env;

const authRoute = require("./routes/authRoutes");
const roomRoute = require("./routes/roomRoutes");
const userRoute = require("./routes/userRoutes");

const { verifyAuthHeaderAndRole } = require("./middlewares/authMiddlewares");
const Roles = require("./constants/Roles");

const { initSocket } = require("./handler/socketHandler");
const { processCacheToDBStoreForBoardElements } = require("./utils/cronjobs");

const server = http.createServer(app);

app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is connected successfully"))
  .catch((err) => console.error(err));

  setTimeout(() => {
  initSocket(server); // Initialize socket.io
}, 1000)

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello server is working");
});

app.use("/", authRoute);
app.use("/room", roomRoute) // Todo: Authentication to be added after Auth Implementation on UI side: verifyAuthHeaderAndRole([Roles.USER]),
app.use("/user", userRoute)

/*
  Testing route for authentication header
*/
app.post("/test", verifyAuthHeaderAndRole([Roles.USER]), async (req, res) => {
  return res.json({ message: 'success'});
})

server.listen(PORT, () => {
  console.log("server is running on port", PORT);
});
