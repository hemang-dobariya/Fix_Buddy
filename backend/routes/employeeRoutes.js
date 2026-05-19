const express = require("express");
const   router = express.Router();
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const COLLECTION = "userdata";

// GET employee by email
router.get("/email/:email", async (req, res) => {
  try {
    const db = getDB();
    const emailRegex = new RegExp(`^${req.params.email}$`, "i");
    
    const employee = await db
      .collection(COLLECTION)
      .findOne(
        { email: emailRegex, role: "employee" },
        { projection: { password: 0 } }
      );

    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    res.json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all employees (with pagination)
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { role: "employee" };

    const [employees, total] = await Promise.all([
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
      data: employees,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single employee
router.get("/:id", async (req, res) => {
  try {
    const db = getDB();
    const employee = await db
      .collection(COLLECTION)
      .findOne(
        { _id: new ObjectId(req.params.id), role: "employee" },
        // { projection: { password: 0 } },
      );

    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    res.json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create employee
router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const { name, email, password, phone, department, } =
      req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "name, email, password are required",
        });
    }

    const exists = await db.collection(COLLECTION).findOne({ email });
    if (exists)
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });

    const employee = {
      name,
      email,
      password,
      phone: phone || null,
      department: department || null,
      role: "employee",
      createdAt: new Date(),
    };

    const result = await db.collection(COLLECTION).insertOne(employee);
    const { password: _, ...data } = employee;

    res
      .status(201)
      .json({ success: true, data: { _id: result.insertedId, ...data } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update employee
router.put("/:id", async (req, res) => {
  try {
    const db = getDB();
    const { name, email, phone, department } = req.body;

    const update = { updatedAt: new Date() };
    if (name) update.name = name;
    if (email) update.email = email;
    if (phone) update.phone = phone;
    if (department) update.department = department;

    const result = await db
      .collection(COLLECTION)
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id), role: "employee" },
        { $set: update },
        { returnDocument: "after", projection: { password: 0 } },
      );

    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE employee
router.delete("/:id", async (req, res) => {
  try {
    const db = getDB();
    const result = await db
      .collection(COLLECTION)
      .deleteOne({ _id: new ObjectId(req.params.id), role: "employee" });

    if (result.deletedCount === 0)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    res.json({ success: true, message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
