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



// GET USER REQUESTS

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

module.exports = router;