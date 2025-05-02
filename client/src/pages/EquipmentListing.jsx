"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../config"
import EquipmentCard from "../components/equipment/EquipmentCard"
import EquipmentFilter from "../components/equipment/EquipmentFilter"

const EquipmentListing = () => {
  const [equipment, setEquipment] = useState([])
  const [filteredEquipment, setFilteredEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentFilters, setCurrentFilters] = useState({
    search: "",
    category: "",
    location: "",
    priceMin: "",
    priceMax: "",
    availability: false,
  })

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${API_URL}/api/equipment`)
        setEquipment(res.data)
        setFilteredEquipment(res.data)
        setError(null)
      } catch (err) {
        setError("Failed to load equipment data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchEquipment()
  }, [])

  const handleFilter = (filters) => {
    setCurrentFilters(filters)

    let filtered = [...equipment]

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(
        (item) => item.name.toLowerCase().includes(searchTerm) || item.description.toLowerCase().includes(searchTerm),
      )
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter((item) => item.category === filters.category)
    }

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter((item) => item.location === filters.location)
    }

    // Filter by price range
    if (filters.priceMin) {
      filtered = filtered.filter((item) => item.pricePerDay >= Number.parseFloat(filters.priceMin))
    }

    if (filters.priceMax) {
      filtered = filtered.filter((item) => item.pricePerDay <= Number.parseFloat(filters.priceMax))
    }

    // Filter by availability
    if (filters.availability) {
      filtered = filtered.filter((item) => item.isAvailable)
    }

    setFilteredEquipment(filtered)
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agricultural Equipment</h1>
        <p className="text-gray-600">Browse and rent from our wide selection of farming equipment</p>
      </div>

      <EquipmentFilter onFilter={handleFilter} />

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {filteredEquipment.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => (
            <EquipmentCard key={item._id} equipment={item} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">No equipment found matching your filters.</p>
          <button
            onClick={() =>
              handleFilter({
                search: "",
                category: "",
                location: "",
                priceMin: "",
                priceMax: "",
                availability: false,
              })
            }
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default EquipmentListing
