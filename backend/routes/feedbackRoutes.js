const express = require("express");
const router = express.Router();

const { createFeedback } = require("../models/Feedback");
const { getDB } = require("../config/db");

const COLLECTION = "feedback";

router.post("/", async (req, res) => {
  try {
    const feedback = await createFeedback(req.body);

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [feedback, total] = await Promise.all([
      db
      .collection(COLLECTION)
      .find()
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection(COLLECTION).countDocuments(),
    ]);

    res.json({
      success: true,
      data: feedback,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
