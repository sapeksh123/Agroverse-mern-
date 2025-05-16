'use client'

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"
import { MapPin, DollarSign, User, Clock, ChevronLeft, Tractor } from "lucide-react"
import BookingForm from "../components/booking/BookingForm"
import { formatCurrency } from "../utils/format"
import { FaWhatsapp } from "react-icons/fa"


const EquipmentDetail = () => {
  const { id } = useParams()
  const [equipment, setEquipment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEquipmentDetail = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${API_URL}/api/equipment/${id}`)
        setEquipment(res.data)
        setError(null)
      } catch (err) {
        setError("Failed to load equipment details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchEquipmentDetail()
  }, [id])


 
  
  // ✅ WhatsApp Message Function
  const handleMessageOwner = (phoneNumber) => {
    if (!phoneNumber) {
      alert("Owner phone number not available")
      return
    }
  
    // Remove +91, leading 0, and any non-digit characters
    const formattedNumber = phoneNumber.replace(/[^\d]/g, '').replace(/^91/, '').replace(/^0/, '')
    const message = encodeURIComponent(
      `Hello, I'm interested in renting your equipment listed on AgroVerse. Is it available?`
    )
    const whatsappURL = `https://wa.me/91${formattedNumber}?text=${message}`
    window.open(whatsappURL, '_blank')
  }
  

  if (error || !equipment) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error || "Equipment not found"}</p>
        </div>
        <Link to="/equipment" className="text-green-600 hover:text-green-800 flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Equipment
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/equipment" className="text-green-600 hover:text-green-800 flex items-center mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Equipment
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={`http://localhost:5000${equipment.image || "placeholder.svg?height=400&width=800"}`}
                alt={equipment.name}
                className="w-full h-96 object-cover"
              />

              {!equipment.isAvailable && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Not Available
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                {equipment.category}
              </div>
            </div>

            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{equipment.name}</h1>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  <span>{equipment.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                  <span>{formatCurrency(equipment.pricePerDay)}/day</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-2 text-green-600" />
                  <span>Owner: {equipment.owner?.name || "Anonymous"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2 text-green-600" />
                  <span>Listed {new Date(equipment.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{equipment.description}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {equipment.specifications &&
                    Object.entries(equipment.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <Tractor className="h-5 w-5 mr-2 text-green-600" />
                        <span className="text-gray-700">
                          <strong>{key}:</strong> {value}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {equipment.terms && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Terms & Conditions</h2>
                  <p className="text-gray-700 whitespace-pre-line">{equipment.terms}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <BookingForm equipment={equipment} />

          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">Contact Owner</h3>
            <p className="text-gray-600 mb-4">
              Have questions about this equipment? Contact the owner directly.
            </p>
            <button
  onClick={() => handleMessageOwner(equipment.owner.phone)}
  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors"
>
  <FaWhatsapp className="text-xl" />
  Message Owner on WhatsApp
</button>

          </div>
        </div>
      </div>
    </div>
    
  )
}

export default EquipmentDetail
