import { Link } from "react-router-dom"
import { Tractor, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white pt-10 pb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Tractor className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">AgroVerse</span>
            </div>
            <p className="text-green-100 mb-4">
              Empowering farmers with accessible agricultural equipment rental solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-green-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-green-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-green-200">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-green-100 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/equipment" className="text-green-100 hover:text-white">
                  Equipment
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-green-100 hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-green-100 hover:text-white">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-green-100">Equipment Rental</li>
              <li className="text-green-100">Booking Management</li>
              <li className="text-green-100">Secure Payments</li>
              <li className="text-green-100">Equipment Listing</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-green-100">
                <MapPin size={18} className="mr-2" />
                123 Farm Road, Rural District
              </li>
              <li className="flex items-center text-green-100">
                <Phone size={18} className="mr-2" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center text-green-100">
                <Mail size={18} className="mr-2" />
                info@agroverse.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-6 text-center text-green-200">
          <p>&copy; {new Date().getFullYear()} AgroVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
