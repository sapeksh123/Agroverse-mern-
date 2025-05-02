import { Link } from "react-router-dom"
import { MapPin } from "lucide-react"
import { formatCurrency } from "../../utils/format"

const EquipmentCard = ({ equipment }) => {
  const { _id, name, image, pricePerDay, location, category, isAvailable } = equipment

  return (
    <div className="equipment-card card">
      <div className="relative">
        <img src={image || "/placeholder.svg?height=200&width=300"} alt={name} className="w-full h-48 object-cover" />
        {!isAvailable && (
          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs font-bold">Not Available</div>
        )}
        <div className="absolute bottom-0 left-0 bg-green-600 text-white px-2 py-1 text-sm">{category}</div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="text-green-700 font-bold">
            {formatCurrency(pricePerDay)}
            <span className="text-gray-500 font-normal text-sm">/day</span>
          </div>
          <Link
            to={`/equipment/${_id}`}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EquipmentCard
