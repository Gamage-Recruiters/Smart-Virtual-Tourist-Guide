const express = require("express");
const cors = require("cors");

const budgetRoutes = require("./src/routes/budgetRoutes");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Backend is running" });
});

app.use("/api/budget", budgetRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error("[backend] Unhandled error:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
