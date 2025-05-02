const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const Booking = require("../models/Booking")
const Equipment = require("../models/Equipment")
const User = require("../models/User")

// @route   GET api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get("/stats", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    let stats = {}

    if (user.role === "farmer") {
      // Farmer stats
      const bookings = await Booking.find({ user: req.user.id })

      stats = {
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((booking) => booking.status === "pending").length,
        totalEquipment: await Equipment.countDocuments({ isAvailable: true }),
        totalEarnings: 0, // Not applicable for farmers
      }
    } else {
      // Owner stats
      const equipment = await Equipment.find({ owner: req.user.id })
      const equipmentIds = equipment.map((item) => item._id)

      const bookings = await Booking.find({ equipment: { $in: equipmentIds } })
      const approvedBookings = bookings.filter(
        (booking) => booking.status === "approved" || booking.status === "completed",
      )

      const totalEarnings = approvedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)

      stats = {
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((booking) => booking.status === "pending").length,
        totalEquipment: equipment.length,
        totalEarnings,
      }
    }

    res.json(stats)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router
