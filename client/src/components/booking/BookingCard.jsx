"use client"
import { Calendar, MapPin, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react"
import { formatCurrency } from "../../utils/format"

const BookingCard = ({ booking, onCancel, onApprove, onReject, isOwner }) => {
  const { equipment, startDate, endDate, status, totalPrice, createdAt } = booking

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{equipment?.name}</h3>
            <p className="text-gray-600 flex items-center mt-1">
              <MapPin size={16} className="mr-1" />
              {equipment?.location}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-medium flex items-center">
              <Calendar size={16} className="mr-1 text-green-600" />
              {formatDate(startDate)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="font-medium flex items-center">
              <Calendar size={16} className="mr-1 text-green-600" />
              {formatDate(endDate)}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center py-2 border-t border-gray-200">
          <div className="flex items-center">
            <Clock size={16} className="mr-1 text-gray-500" />
            <span className="text-sm text-gray-500">Booked on {formatDate(createdAt)}</span>
          </div>
          <div className="font-bold text-green-700 flex items-center">
           
            {formatCurrency(totalPrice)}
          </div>
        </div>

        {status === "pending" && (
          <div className="mt-4 flex flex-wrap gap-2">
            {isOwner ? (
              <>
                <button
                  onClick={() => onApprove(booking._id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center justify-center"
                >
                  <CheckCircle size={16} className="mr-1" />
                  Approve
                </button>
                <button
                  onClick={() => onReject(booking._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center"
                >
                  <XCircle size={16} className="mr-1" />
                  Reject
                </button>
              </>
            ) : (
              <button
                onClick={() => onCancel(booking._id)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
              >
                Cancel Booking
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingCard
