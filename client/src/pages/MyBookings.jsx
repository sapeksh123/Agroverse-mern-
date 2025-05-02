"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"
import { API_URL } from "../config"
import BookingCard from "../components/booking/BookingCard"
import { AlertCircle, Filter } from "lucide-react"

const MyBookings = () => {
  const { user } = useContext(AuthContext)
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${API_URL}/api/bookings/my-bookings`)
        setBookings(res.data)
        setFilteredBookings(res.data)
        setError(null)
      } catch (err) {
        setError("Failed to load bookings")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  useEffect(() => {
    if (filter === "all") {
      setFilteredBookings(bookings)
    } else {
      setFilteredBookings(bookings.filter((booking) => booking.status === filter))
    }
  }, [filter, bookings])

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.put(`${API_URL}/api/bookings/${bookingId}/cancel`)
      // Update the booking status in the UI
      setBookings(
        bookings.map((booking) => (booking._id === bookingId ? { ...booking, status: "cancelled" } : booking)),
      )
    } catch (err) {
      setError("Failed to cancel booking")
      console.error(err)
    }
  }

  const handleApproveBooking = async (bookingId) => {
    try {
      await axios.put(`${API_URL}/api/bookings/${bookingId}/approve`)
      // Update the booking status in the UI
      setBookings(bookings.map((booking) => (booking._id === bookingId ? { ...booking, status: "approved" } : booking)))
    } catch (err) {
      setError("Failed to approve booking")
      console.error(err)
    }
  }

  const handleRejectBooking = async (bookingId) => {
    try {
      await axios.put(`${API_URL}/api/bookings/${bookingId}/reject`)
      // Update the booking status in the UI
      setBookings(bookings.map((booking) => (booking._id === bookingId ? { ...booking, status: "rejected" } : booking)))
    } catch (err) {
      setError("Failed to reject booking")
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600">
          {user?.role === "farmer"
            ? "Manage your equipment rental bookings"
            : "Manage booking requests for your equipment"}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-500 mr-2" />
          <span className="text-gray-700 mr-4">Filter by status:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === "all" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === "pending" ? "bg-yellow-500 text-white" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === "approved" ? "bg-green-600 text-white" : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === "rejected" ? "bg-red-600 text-white" : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              Rejected
            </button>
            <button
              onClick={() => setFilter("cancelled")}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === "cancelled" ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Cancelled
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === "completed" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onCancel={handleCancelBooking}
              onApprove={handleApproveBooking}
              onReject={handleRejectBooking}
              isOwner={user?.role === "owner"}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">You don't have any {filter !== "all" ? filter : ""} bookings yet.</p>
          {user?.role === "farmer" ? (
            <Link to="/equipment" className="btn-primary inline-block">
              Browse Equipment
            </Link>
          ) : (
            <Link to="/dashboard" className="btn-primary inline-block">
              Back to Dashboard
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default MyBookings
