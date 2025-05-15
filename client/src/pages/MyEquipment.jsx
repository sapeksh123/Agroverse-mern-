"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"
import { API_URL } from "../config"
import { AlertCircle, Plus, Edit, Trash2, Eye, MapPin } from "lucide-react"
import { formatCurrency } from "../utils/format"

const MyEquipment = () => {
  const { user } = useContext(AuthContext)
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    const fetchMyEquipment = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${API_URL}/api/equipment/my-equipment`)
        setEquipment(res.data)
        setError(null)
      } catch (err) {
        setError("Failed to load your equipment")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMyEquipment()
  }, [])

  // Check if user is an equipment owner
  if (user?.role !== "owner") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">Only equipment owners can access this page.</p>
          </div>
        </div>
        <Link to="/dashboard" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const openDeleteModal = (id) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setDeleteId(null)
    setShowDeleteModal(false)
  }

  const handleDeleteEquipment = async () => {
    if (!deleteId) return

    try {
      await axios.delete(`${API_URL}/api/equipment/${deleteId}`)
      setEquipment(equipment.filter((item) => item._id !== deleteId))
      closeDeleteModal()
    } catch (err) {
      setError("Failed to delete equipment")
      console.error(err)
    }
  }

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await axios.put(`${API_URL}/api/equipment/${id}/toggle-availability`, {
        isAvailable: !currentStatus,
      })

      // Update the equipment status in the UI
      setEquipment(equipment.map((item) => (item._id === id ? { ...item, isAvailable: !currentStatus } : item)))
    } catch (err) {
      setError("Failed to update availability")
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Equipment</h1>
          <p className="text-gray-600">Manage your equipment listings</p>
        </div>
        <Link
          to="/add-equipment"
          className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          <Plus className="h-5 w-5 mr-1" />
          Add Equipment
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {equipment.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Equipment
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Details
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {equipment.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={`http://localhost:5000${item.image || "placeholder.svg?height=400&width=800"}`}
                          alt={item.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                      {item.location}
                    </div>
                    <div className="text-sm text-gray-900 flex items-center">
                      
                      {formatCurrency(item.pricePerDay)}/day
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleAvailability(item._id, item.isAvailable)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.isAvailable
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {item.isAvailable ? "Available" : "Not Available"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link to={`/equipment/${item._id}`} className="text-blue-600 hover:text-blue-900" title="View">
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/edit-equipment/${item._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => openDeleteModal(item._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">You haven't added any equipment yet.</p>
          <Link to="/add-equipment" className="btn-primary inline-block">
            <Plus className="h-4 w-4 inline mr-1" />
            Add Equipment
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this equipment? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEquipment}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyEquipment
