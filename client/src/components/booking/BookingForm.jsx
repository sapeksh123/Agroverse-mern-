"use client"

import { useState, useContext } from "react"
import { Calendar, DollarSign, Clock } from "lucide-react"
import { AuthContext } from "../../context/AuthContext"
import { formatCurrency } from "../../utils/format"
import axios from "axios"
import { API_URL } from "../../config"

const BookingForm = ({ equipment, onBookingComplete }) => {
  const { user, isAuthenticated } = useContext(AuthContext)
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Calculate number of days and total price
  const calculateDays = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0

    const start = new Date(bookingData.startDate)
    const end = new Date(bookingData.endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays || 1 // Minimum 1 day
  }

  const totalDays = calculateDays()
  const totalPrice = totalDays * equipment.pricePerDay

  const handleChange = (e) => {
    const { name, value } = e.target
    setBookingData({
      ...bookingData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      setError("Please login to book equipment")
      return
    }

    if (!bookingData.startDate || !bookingData.endDate) {
      setError("Please select start and end dates")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const res = await axios.post(`${API_URL}/api/bookings`, {
        equipment: equipment._id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        message: bookingData.message,
        totalPrice,
      })

      setSuccess(true)
      setBookingData({
        startDate: "",
        endDate: "",
        message: "",
      })

      if (onBookingComplete) {
        onBookingComplete(res.data)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking")
    } finally {
      setLoading(false)
    }
  }

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Book This Equipment</h3>

      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>Booking successful! The owner will contact you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar size={16} className="inline mr-2" />
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={bookingData.startDate}
              onChange={handleChange}
              min={today}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar size={16} className="inline mr-2" />
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={bookingData.endDate}
              onChange={handleChange}
              min={bookingData.startDate || today}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Message to Owner (Optional)</label>
            <textarea
              name="message"
              value={bookingData.message}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Any special requirements or questions..."
            ></textarea>
          </div>

          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">
                <Clock size={16} className="inline mr-1" /> Duration:
              </span>
              <span className="font-medium">
                {totalDays} day{totalDays !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-700">
                <DollarSign size={18} className="inline mr-1" /> Total Price:
              </span>
              <span className="text-green-700">{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !equipment.isAvailable}
            className={`w-full py-2 px-4 rounded font-bold ${
              equipment.isAvailable
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-400 cursor-not-allowed text-white"
            }`}
          >
            {loading ? "Processing..." : equipment.isAvailable ? "Book Now" : "Not Available"}
          </button>

          {!isAuthenticated && (
            <p className="text-center mt-3 text-sm text-gray-600">
              Please{" "}
              <a href="/login" className="text-green-600 hover:underline">
                login
              </a>{" "}
              to book this equipment
            </p>
          )}
        </form>
      )}
    </div>
  )
}

export default BookingForm
