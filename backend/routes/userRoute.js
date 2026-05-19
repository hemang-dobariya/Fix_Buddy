const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const { getDB } = require("../config/db");

const COLLECTION = "userdata";

router.get('/',  async(req, res) => {
  try {
    const db = getDB();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { role: "user" };

    const [user, total] = await Promise.all([
      db
        .collection(COLLECTION)
        .find(filter, { projection: { password: 0 } })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection(COLLECTION).countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: user,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });


} catch (error) {
    res.status(500).json({ success: false, message: error.message });
}
})

module.exports = router;