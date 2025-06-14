const express = require("express");
const mongoose = require("mongoose");
const app = express();
const http = require("http");
const cors = require("cors");
const cron = require('node-cron');
require("dotenv").config();
const { MONGO_URL, PORT } = process.env;

const authRoute = require("./routes/authRoutes");
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

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello server is working");
});

app.use("/", authRoute);

server.listen(PORT, () => {
  console.log("server is running on port", PORT);
});
