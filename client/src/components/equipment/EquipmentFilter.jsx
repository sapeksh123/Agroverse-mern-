"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"

const EquipmentFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    priceMin: "",
    priceMax: "",
    availability: false,
  })

  const [showFilters, setShowFilters] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onFilter(filters)
  }

  const handleReset = () => {
    setFilters({
      search: "",
      category: "",
      location: "",
      priceMin: "",
      priceMax: "",
      availability: false,
    })
    onFilter({
      search: "",
      category: "",
      location: "",
      priceMin: "",
      priceMax: "",
      availability: false,
    })
  }

  const categories = ["Tractor", "Harvester", "Planter", "Sprayer", "Tiller", "Irrigation", "Other"]

  const locations = ["North Region", "South Region", "East Region", "West Region", "Central Region"]

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="flex-grow relative">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search equipment..."
              className="w-full p-2 pl-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="md:w-auto flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded transition-colors"
          >
            <Filter size={18} />
            <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
          </button>

          <button
            type="submit"
            className="md:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
          >
            Apply Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                name="location"
                value={filters.location}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  name="priceMin"
                  value={filters.priceMin}
                  onChange={handleChange}
                  placeholder="Min"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  name="priceMax"
                  value={filters.priceMax}
                  onChange={handleChange}
                  placeholder="Max"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="md:col-span-3 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="availability"
                  name="availability"
                  checked={filters.availability}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="availability" className="ml-2 block text-sm text-gray-700">
                  Show only available equipment
                </label>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default EquipmentFilter
