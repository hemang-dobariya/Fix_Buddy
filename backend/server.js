require("dotenv").config();

const express = require("express");

const cors = require("cors");

const { connectDB } = require("./config/db");

const authRoutes = require("./routes/auth");
const serviceRoutes = require("./routes/serviceRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();

app.use(cors());

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/feedback", feedbackRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});