const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")
const userRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")
const equipmentRoutes = require("./routes/equipment")
const bookingRoutes = require("./routes/bookings")
const dashboardRoutes = require("./routes/dashboard")

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err)
    process.exit(1)
  })

// Define Routes
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/equipment", equipmentRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/dashboard", dashboardRoutes)

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "../client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
  })
}

// Define port
const PORT = process.env.PORT || 5000

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
