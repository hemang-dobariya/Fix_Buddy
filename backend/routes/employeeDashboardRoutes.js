const express = require("express");
const router = express.Router();
const { getDB } = require("../config/db");

/**
 * GET /api/employee-dashboard?email=<employeeEmail>
 * Returns:
 *  - employee info (name, department)
 *  - totalRequests    – all requests for that department
 *  - pendingRequests  – status === "Pending"
 *  - approvedRequests – status === "Approved"
 *  - rejectedRequests – status === "Rejected"
 *  - recentRequests   – last 5 requests for the department
 */
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const { email } = req.query;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Employee email is required" });
    }

    // 1. Fetch employee record to get their department
    const emailRegex = new RegExp(`^${email}$`, "i");
    const employee = await db
      .collection("userdata")
      .findOne(
        { email: emailRegex, role: "employee" },
        { projection: { password: 0 } }
      );

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    const department = employee.department;

    if (!department) {
      return res.status(200).json({
        success: true,
        data: {
          employee,
          department: null,
          totalRequests: 0,
          pendingRequests: 0,
          approvedRequests: 0,
          rejectedRequests: 0,
          recentRequests: [],
        },
      });
    }

    // 2. Aggregate stats for the department
    const deptFilter = { service: department };

    const [
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      recentRequests,
    ] = await Promise.all([
      db.collection("service_requests").countDocuments(deptFilter),
      db
        .collection("service_requests")
        .countDocuments({ ...deptFilter, status: "Pending" }),
      db
        .collection("service_requests")
        .countDocuments({ ...deptFilter, status: "Approved" }),
      db
        .collection("service_requests")
        .countDocuments({ ...deptFilter, status: "Rejected" }),
      db
        .collection("service_requests")
        .find(deptFilter)
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        employee,
        department,
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        recentRequests,
      },
    });
  } catch (error) {
    console.error("Employee dashboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
