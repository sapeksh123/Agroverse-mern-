const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const Equipment = require("../models/Equipment");
const User = require("../models/User");

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/equipment";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter,
});

// ✅ Moved my-equipment ABOVE /:id route
router.get("/my-equipment", auth, async (req, res) => {
  try {
    const equipment = await Equipment.find({ owner: req.user.id });
    res.json(equipment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all equipment
router.get("/", async (req, res) => {
  try {
    const equipment = await Equipment.find().populate("owner", "name");
    res.json(equipment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get equipment by ID
router.get("/:id", async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate("owner", "name");
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    res.json(equipment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Equipment not found" });
    }
    res.status(500).send("Server error");
  }
});

// Create new equipment (Owner only)
router.post("/", [auth, upload.single("image")], async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "owner") {
      return res.status(403).json({ message: "Only equipment owners can create listings" });
    }

    const { name, category, description, pricePerDay, location, isAvailable, specifications, terms } = req.body;

    const newEquipment = new Equipment({
      owner: req.user.id,
      name,
      category,
      description,
      pricePerDay,
      location,
      isAvailable: isAvailable === "true",
      specifications: specifications ? JSON.parse(specifications) : {},
      terms,
    });

    if (req.file) {
      newEquipment.image = `/uploads/equipment/${req.file.filename}`;
    }

    const equipment = await newEquipment.save();
    res.json(equipment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update equipment (Owner only)
router.put("/:id", [auth, upload.single("image")], async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    if (equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this equipment" });
    }

    const { name, category, description, pricePerDay, location, isAvailable, specifications, terms } = req.body;

    if (name) equipment.name = name;
    if (category) equipment.category = category;
    if (description) equipment.description = description;
    if (pricePerDay) equipment.pricePerDay = pricePerDay;
    if (location) equipment.location = location;
    if (isAvailable !== undefined) equipment.isAvailable = isAvailable === "true";
    if (specifications) equipment.specifications = JSON.parse(specifications);
    if (terms !== undefined) equipment.terms = terms;

    if (req.file) {
      if (equipment.image) {
        const oldImagePath = path.join(__dirname, "..", equipment.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      equipment.image = `/uploads/equipment/${req.file.filename}`;
    }

    await equipment.save();
    res.json(equipment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Toggle availability (Owner only)
router.put("/:id/toggle-availability", auth, async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    if (equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this equipment" });
    }

    equipment.isAvailable = req.body.isAvailable;
    await equipment.save();
    res.json(equipment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Delete equipment (Owner only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    if (equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this equipment" });
    }

    if (equipment.image) {
      const imagePath = path.join(__dirname, "..", equipment.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await equipment.remove();
    res.json({ message: "Equipment removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
