const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")
const User = require("../models/User")

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post("/", async (req, res) => {
  const { name, email, password, phone, role } = req.body

  try {
    // Check if user already exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      phone,
      role: role || "farmer",
    })

    // Save user to database
    await user.save()

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    }

    // Sign and return JWT
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err) throw err
      res.json({ token })
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
  const { name, phone } = req.body

  try {
    // Find user
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update fields
    if (name) user.name = name
    if (phone !== undefined) user.phone = phone

    // Save user
    await user.save()

    res.json({ message: "Profile updated successfully" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   PUT api/users/password
// @desc    Update user password
// @access  Private
router.put("/password", auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body

  try {
    // Find user
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    // Update password
    user.password = newPassword

    // Save user
    await user.save()

    res.json({ message: "Password updated successfully" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router
