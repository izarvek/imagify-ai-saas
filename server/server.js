require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");
const userRoutes = require("./routes/user.routes");
const imageRoutes = require("./routes/image.routes");

const app = express();
const PORT = process.env.PORT || 8080;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["https://imagify-ai-saas-client.vercel.app", "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Server is Working!");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/images", imageRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port:${PORT}`);
});
