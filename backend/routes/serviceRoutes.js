const express = require("express");

const router = express.Router();

const { getDB } = require("../config/db");



// CREATE SERVICE REQUEST

router.post("/", async (req, res) => {
  try {
    const db = getDB();

    const serviceCollection = db.collection("service_requests");

    const email = req.body.email?.toLowerCase();

    const serviceData = {
      userEmail: email,

      name: req.body.name,
      email,
      phone: req.body.phone,
      address: req.body.address,
      service: req.body.service,
      date: req.body.date,
      time: req.body.time,
      description: req.body.description,

      status: "Pending",

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await serviceCollection.insertOne(serviceData);

    res.status(201).json({
      success: true,
      message: "Service request submitted successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



// GET ALL SERVICES (with pagination)
// Query params: ?page=1&limit=10

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("service_requests");

    const page = parseInt(req.query.page) || 1;   // current page (default: 1)
    const limit = parseInt(req.query.limit) || 10; // items per page (default: 10)
    const skip = (page - 1) * limit;              // how many to skip

    const [services, total] = await Promise.all([
      collection.find().sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: services,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



// GET USER REQUESTS (by email)

router.get("/:email", async (req, res) => {
  try {
    const db = getDB();

    const serviceCollection = db.collection("service_requests");
    const email = req.params.email;
    const emailRegex = new RegExp(`^${email}$`, "i");

    const requests = await serviceCollection
      .find({
        $or: [
          { userEmail: emailRegex },
          { email: emailRegex },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET SERVICES BY DEPARTMENT (for employee dashboard)
// Route: /api/services/department/:department

router.get("/department/:department", async (req, res) => {
  try {
    const db = getDB();
    const serviceCollection = db.collection("service_requests");
    const department = req.params.department;

    // Fetch services matching the department
    const requests = await serviceCollection
      .find({
        service: department,
        // status: "Pending"
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const db = getDB();
    const { ObjectId } = require("mongodb");

    const { status } = req.body;

    // Only allow these two values
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'Approved' or 'Rejected'",
      });
    }

    const result = await db.collection("service_requests").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Service request not found" });
    }

    res.status(200).json({ success: true, message: `Request ${status} successfully` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;