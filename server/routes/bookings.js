const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const Booking = require("../models/Booking")
const Equipment = require("../models/Equipment")
const User = require("../models/User")

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { equipment: equipmentId, startDate, endDate, message, totalPrice } = req.body

    // Check if equipment exists and is available
    const equipment = await Equipment.findById(equipmentId)
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" })
    }

    if (!equipment.isAvailable) {
      return res.status(400).json({ message: "Equipment is not available for booking" })
    }

    // Create new booking
    const newBooking = new Booking({
      user: req.user.id,
      equipment: equipmentId,
      startDate,
      endDate,
      totalPrice,
      message,
    })

    const booking = await newBooking.save()

    // Populate equipment and user details
    await booking.populate("equipment")
    await booking.populate("user", "name email")

    res.json(booking)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET api/bookings/my-bookings
// @desc    Get all bookings for the logged in user
// @access  Private
router.get("/my-bookings", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    let bookings

    if (user.role === "farmer") {
      // If user is a farmer, get bookings made by the user
      bookings = await Booking.find({ user: req.user.id }).populate("equipment").sort({ createdAt: -1 })
    } else {
      // If user is an owner, get bookings for equipment owned by the user
      const equipment = await Equipment.find({ owner: req.user.id })
      const equipmentIds = equipment.map((item) => item._id)

      bookings = await Booking.find({ equipment: { $in: equipmentIds } })
        .populate("equipment")
        .populate("user", "name email")
        .sort({ createdAt: -1 })
    }

    res.json(bookings)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET api/bookings/recent
// @desc    Get recent bookings for the logged in user
// @access  Private
router.get("/recent", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    let bookings

    if (user.role === "farmer") {
      // If user is a farmer, get recent bookings made by the user
      bookings = await Booking.find({ user: req.user.id }).populate("equipment").sort({ createdAt: -1 }).limit(3)
    } else {
      // If user is an owner, get recent bookings for equipment owned by the user
      const equipment = await Equipment.find({ owner: req.user.id })
      const equipmentIds = equipment.map((item) => item._id)

      bookings = await Booking.find({ equipment: { $in: equipmentIds } })
        .populate("equipment")
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(3)
    }

    res.json(bookings)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("equipment").populate("user", "name email")

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    // Check if user is authorized to view this booking
    const user = await User.findById(req.user.id)
    const equipment = await Equipment.findById(booking.equipment)

    if (user.role === "farmer" && booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this booking" })
    }

    if (user.role === "owner" && equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this booking" })
    }

    res.json(booking)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Booking not found" })
    }
    res.status(500).send("Server error")
  }
})

// @route   PUT api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private (user who made the booking)
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    // Check if user is authorized to cancel this booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" })
    }

    // Check if booking can be cancelled
    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be cancelled" })
    }

    booking.status = "cancelled"
    await booking.save()

    res.json(booking)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   PUT api/bookings/:id/approve
// @desc    Approve a booking
// @access  Private (equipment owner)
router.put("/:id/approve", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("equipment")

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    // Check if user is the equipment owner
    const equipment = await Equipment.findById(booking.equipment)
    if (equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to approve this booking" })
    }

    // Check if booking can be approved
    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be approved" })
    }

    booking.status = "approved"
    await booking.save()

    res.json(booking)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   PUT api/bookings/:id/reject
// @desc    Reject a booking
// @access  Private (equipment owner)
router.put("/:id/reject", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("equipment")

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    // Check if user is the equipment owner
    const equipment = await Equipment.findById(booking.equipment)
    if (equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to reject this booking" })
    }

    // Check if booking can be rejected
    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be rejected" })
    }

    booking.status = "rejected"
    await booking.save()

    res.json(booking)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   PUT api/bookings/:id/complete
// @desc    Mark a booking as completed
// @access  Private (equipment owner)
router.put("/:id/complete", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("equipment")

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    // Check if user is the equipment owner
    const equipment = await Equipment.findById(booking.equipment)
    if (equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to complete this booking" })
    }

    // Check if booking can be completed
    if (booking.status !== "approved") {
      return res.status(400).json({ message: "Only approved bookings can be marked as completed" })
    }

    booking.status = "completed"
    await booking.save()

    res.json(booking)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router
