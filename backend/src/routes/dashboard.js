import express from "express";
import { connectDB } from "../db.js";

const router = express.Router();

// -----------------------------------------------------------------------------
// Government Dashboard
// -----------------------------------------------------------------------------
// GET /api/dashboard/government
// -----------------------------------------------------------------------------

router.get("/government", async (req, res) => {
  try {
    const db = await connectDB();

    const dashboard = await db
      .collection("governmentDash")
      .findOne({});

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: "Government dashboard data not found",
      });
    }

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error("Government dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;