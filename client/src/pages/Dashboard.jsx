"use client"

import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"
import { API_URL } from "../config"
import { Tractor, Calendar, DollarSign, Users, Plus, MapPin } from "lucide-react"
import BookingCard from "../components/booking/BookingCard"

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalEquipment: 0,
    totalEarnings: 0,
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const statsRes = await axios.get(`${API_URL}/api/dashboard/stats`)
        const bookingsRes = await axios.get(`${API_URL}/api/bookings/recent`)

        setStats(statsRes.data)
        setRecentBookings(bookingsRes.data)
        setError(null)
      } catch (err) {
        setError("Failed to load dashboard data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.put(`${API_URL}/api/bookings/${bookingId}/cancel`)
      // Update the booking status in the UI
      setRecentBookings(
        recentBookings.map((booking) => (booking._id === bookingId ? { ...booking, status: "cancelled" } : booking)),
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
      setRecentBookings(
        recentBookings.map((booking) => (booking._id === bookingId ? { ...booking, status: "approved" } : booking)),
      )
    } catch (err) {
      setError("Failed to approve booking")
      console.error(err)
    }
  }

  const handleRejectBooking = async (bookingId) => {
    try {
      await axios.put(`${API_URL}/api/bookings/${bookingId}/reject`)
      // Update the booking status in the UI
      setRecentBookings(
        recentBookings.map((booking) => (booking._id === bookingId ? { ...booking, status: "rejected" } : booking)),
      )
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
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">
          {user?.role === "farmer"
            ? "Manage your equipment rentals and bookings"
            : "Manage your equipment listings and rental requests"}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-semibold">{stats.totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Bookings</p>
              <p className="text-2xl font-semibold">{stats.pendingBookings}</p>
            </div>
          </div>
        </div>

        {user?.role === "owner" ? (
          <>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <Tractor className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">My Equipment</p>
                  <p className="text-2xl font-semibold">{stats.totalEquipment}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-semibold">${stats.totalEarnings.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available Near You</p>
                  <p className="text-2xl font-semibold">{stats.totalEquipment}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Equipment Owners</p>
                  <p className="text-2xl font-semibold">24</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
        <Link to="/my-bookings" className="text-green-600 hover:text-green-800 text-sm font-medium">
          View All
        </Link>
      </div>

      {recentBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentBookings.map((booking) => (
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
          <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
          {user?.role === "farmer" ? (
            <Link to="/equipment" className="btn-primary inline-block">
              Browse Equipment
            </Link>
          ) : (
            <Link to="/add-equipment" className="btn-primary inline-block">
              <Plus className="h-4 w-4 inline mr-1" />
              Add Equipment
            </Link>
          )}
        </div>
      )}

      {user?.role === "owner" && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Equipment</h2>
            <Link to="/my-equipment" className="text-green-600 hover:text-green-800 text-sm font-medium">
              View All
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Link
              to="/add-equipment"
              className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Equipment
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
