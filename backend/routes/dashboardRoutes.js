const express = require("express");
const router = express.Router();
const { getDB } = require("../config/db");

// GET /api/dashboard
// Returns aggregated stats: total users, employees, service requests (by status), feedbacks
router.get("/", async (req, res) => {
  try {
    const db = getDB();

    const [
      totalUsers,
      totalEmployees,
      totalServices,
      pendingServices,
      approvedServices,
      rejectedServices,
      totalFeedbacks,
      recentServices,
    ] = await Promise.all([
      db.collection("userdata").countDocuments({ role: "user" }),
      db.collection("userdata").countDocuments({ role: "employee" }),
      db.collection("service_requests").countDocuments(),
      db.collection("service_requests").countDocuments({ status: "Pending" }),
      db.collection("service_requests").countDocuments({ status: "Approved" }),
      db.collection("service_requests").countDocuments({ status: "Rejected" }),
      db.collection("feedback").countDocuments(),
      db
        .collection("service_requests")
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalEmployees,
        totalServices,
        servicesByStatus: {
          pending: pendingServices,
          approved: approvedServices,
          rejected: rejectedServices,
        },
        totalFeedbacks,
        recentServices,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
