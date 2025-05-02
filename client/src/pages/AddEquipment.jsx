"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"
import { API_URL } from "../config"
import { AlertCircle, Upload, Plus, Minus } from "lucide-react"

const AddEquipment = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    pricePerDay: "",
    location: "",
    image: "",
    isAvailable: true,
    specifications: [{ key: "", value: "" }],
    terms: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  // Check if user is an equipment owner
  if (user?.role !== "owner") {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">Only equipment owners can add equipment listings.</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        image: file,
      })

      // Create a preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecs = [...formData.specifications]
    updatedSpecs[index] = {
      ...updatedSpecs[index],
      [field]: value,
    }
    setFormData({
      ...formData,
      specifications: updatedSpecs,
    })
  }

  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { key: "", value: "" }],
    })
  }

  const removeSpecification = (index) => {
    const updatedSpecs = [...formData.specifications]
    updatedSpecs.splice(index, 1)
    setFormData({
      ...formData,
      specifications: updatedSpecs,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Basic validation
    if (!formData.name || !formData.category || !formData.description || !formData.pricePerDay || !formData.location) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    // Filter out empty specifications
    const filteredSpecs = formData.specifications.filter((spec) => spec.key.trim() !== "" && spec.value.trim() !== "")

    // Convert specifications array to object
    const specificationsObj = {}
    filteredSpecs.forEach((spec) => {
      specificationsObj[spec.key] = spec.value
    })

    try {
      // Create FormData for file upload
      const data = new FormData()
      data.append("name", formData.name)
      data.append("category", formData.category)
      data.append("description", formData.description)
      data.append("pricePerDay", formData.pricePerDay)
      data.append("location", formData.location)
      data.append("isAvailable", formData.isAvailable)
      data.append("specifications", JSON.stringify(specificationsObj))
      data.append("terms", formData.terms)

      if (formData.image) {
        data.append("image", formData.image)
      }

      const res = await axios.post(`${API_URL}/api/equipment`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      navigate(`/equipment/${res.data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add equipment")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const categories = ["Tractor", "Harvester", "Planter", "Sprayer", "Tiller", "Irrigation", "Other"]

  const locations = ["North Region", "South Region", "East Region", "West Region", "Central Region"]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Equipment</h1>
        <p className="text-gray-600">List your agricultural equipment for rent on AgroVerse</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Equipment Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. John Deere 5075E Tractor"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="form-input"
            placeholder="Provide detailed information about your equipment..."
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700 mb-1">
              Price Per Day (USD) *
            </label>
            <input
              type="number"
              id="pricePerDay"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="form-input"
              placeholder="e.g. 150.00"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select Location</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <div>
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Equipment preview"
                    className="mx-auto h-48 w-auto object-cover mb-4"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null)
                      setFormData({
                        ...formData,
                        image: "",
                      })
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
                    >
                      <span>Upload an image</span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Specifications</label>
            <button
              type="button"
              onClick={addSpecification}
              className="inline-flex items-center text-sm text-green-600 hover:text-green-800"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Specification
            </button>
          </div>

          {formData.specifications.map((spec, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <input
                type="text"
                value={spec.key}
                onChange={(e) => handleSpecificationChange(index, "key", e.target.value)}
                className="form-input flex-1"
                placeholder="e.g. Horsepower"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
                className="form-input flex-1"
                placeholder="e.g. 75 HP"
              />
              <button
                type="button"
                onClick={() => removeSpecification(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Minus className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-1">
            Terms & Conditions
          </label>
          <textarea
            id="terms"
            name="terms"
            value={formData.terms}
            onChange={handleChange}
            rows="3"
            className="form-input"
            placeholder="Any specific terms for renting this equipment..."
          ></textarea>
        </div>

        <div className="mb-6">
          <div className="flex items-center">
            <input
              id="isAvailable"
              name="isAvailable"
              type="checkbox"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700">
              Equipment is available for rent
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded mr-4 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Equipment"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddEquipment
