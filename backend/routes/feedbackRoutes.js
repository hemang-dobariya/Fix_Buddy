const express = require("express");
const router = express.Router();

const { createFeedback } = require("../models/Feedback");

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

module.exports = router;