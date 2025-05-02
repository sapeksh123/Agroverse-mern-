const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const auth = require("../middleware/auth")
const Equipment = require("../models/Equipment")
const User = require("../models/User")

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/equipment"
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Invalid file type. Only JPEG, JPG and PNG are allowed."), false)
  }
}

// Set up multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB
  },
  fileFilter: fileFilter,
})

// @route   GET api/equipment
// @desc    Get all equipment
// @access  Public
router.get("/", async (req, res) => {
  try {
    const equipment = await Equipment.find().populate("owner", "name")
    res.json(equipment)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET api/equipment/:id
// @desc    Get equipment by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate("owner", "name")

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" })
    }

    res.json(equipment)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Equipment not found" })
    }
    res.status(500).send("Server error")
  }
})

// @route   POST api/equipment
// @desc    Create a new equipment listing
// @access  Private (owner only)
router.post("/", [auth, upload.single("image")], async (req, res) => {
  try {
    // Check if user is an owner
    const user = await User.findById(req.user.id)
    if (user.role !== "owner") {
      return res.status(403).json({ message: "Only equipment owners can create listings" })
    }

    const { name, category, description, pricePerDay, location, isAvailable, specifications, terms } = req.body

    // Create new equipment
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
    })

    // Add image if uploaded
    if (req.file) {
      newEquipment.image = `/uploads/equipment/${req.file.filename}`
    }

    const equipment = await newEquipment.save()
    res.json(equipment)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   PUT api/equipment/:id
// @desc    Update equipment
// @access  Private (owner only)
router.put("/:id", [auth, upload.single("image")], async (req, res) => {
  try {
    // Find equipment
    const equipment = await Equipment.findById(req.params.id)

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" })
    }

    // Check ownership
    if (equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this equipment" })
    }

    const { name, category, description, pricePerDay, location, isAvailable, specifications, terms } = req.body

    // Update fields
    if (name) equipment.name = name
    if (category) equipment.category = category
    if (description) equipment.description = description
    if (pricePerDay) equipment.pricePerDay = pricePerDay
    if (location) equipment.location = location
    if (isAvailable !== undefined) equipment.isAvailable = isAvailable === "true"
    if (specifications) equipment.specifications = JSON.parse(specifications)
    if (terms !== undefined) equipment.terms = terms

    // Update image if uploaded
    if (req.file) {
      // Delete old image if exists
      if (equipment.image) {
        const oldImagePath = path.join(__dirname, "..", equipment.image)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }

      equipment.image = `/uploads/equipment/${req.file.filename}`
    }

    await equipment.save()
    res.json(equipment)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   PUT api/equipment/:id/toggle-availability
// @desc    Toggle equipment availability
// @access  Private (owner only)
router.put("/:id/toggle-availability", auth, async (req, res) => {
  try {
    // Find equipment
    const equipment = await Equipment.findById(req.params.id)

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" })
    }

    // Check ownership
    if (equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this equipment" })
    }

    // Toggle availability
    equipment.isAvailable = req.body.isAvailable

    await equipment.save()
    res.json(equipment)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   DELETE api/equipment/:id
// @desc    Delete equipment
// @access  Private (owner only)
router.delete("/:id", auth, async (req, res) => {
  try {
    // Find equipment
    const equipment = await Equipment.findById(req.params.id)

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" })
    }

    // Check ownership
    if (equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this equipment" })
    }

    // Delete image if exists
    if (equipment.image) {
      const imagePath = path.join(__dirname, "..", equipment.image)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    await equipment.remove()
    res.json({ message: "Equipment removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET api/equipment/my-equipment
// @desc    Get all equipment owned by the user
// @access  Private (owner only)
router.get("/my-equipment", auth, async (req, res) => {
  try {
    const equipment = await Equipment.find({ owner: req.user.id })
    res.json(equipment)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router
