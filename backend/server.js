const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { connectDB } = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  res.send("Backend running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);