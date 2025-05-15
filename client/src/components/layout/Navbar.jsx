"use client"

import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { Menu, X, User, LogOut, Tractor } from "lucide-react"

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const authLinks = (
    <>
      <li>
        <Link
          to="/dashboard"
          className="block py-2 px-4 hover:bg-green-100 rounded"
          onClick={() => setIsMenuOpen(false)}
        >
          Dashboard
        </Link>
      </li>
      {user?.role === "owner" && (
        <li>
          <Link
            to="/my-equipment"
            className="block py-2 px-4 hover:bg-green-100 rounded"
            onClick={() => setIsMenuOpen(false)}
          >
            My Equipment
          </Link>
        </li>
      )}
      <li>
        <Link
          to="/my-bookings"
          className="block py-2 px-4 hover:bg-green-100 rounded"
          onClick={() => setIsMenuOpen(false)}
        >
          My Bookings
        </Link>
      </li>
      <li>
        <Link to="/profile" className="block py-2 px-4 hover:bg-green-100 rounded" onClick={() => setIsMenuOpen(false)}>
          <User size={18} className="inline mr-1" /> Profile
        </Link>
      </li>
      <li>
        <button onClick={handleLogout} className="block w-full text-left py-2 px-4 hover:bg-green-100 rounded">
          <LogOut size={18} className="inline mr-1" /> Logout
        </button>
      </li>
    </>
  )

  const guestLinks = (
    <>
      <li>
        <Link to="/login" className="block py-2 px-4 hover:bg-green-100 rounded" onClick={() => setIsMenuOpen(false)}>
          Login
        </Link>
      </li>
      <li>
        <Link
          to="/register"
          className="block py-2 px-4 hover:bg-green-100 rounded"
          onClick={() => setIsMenuOpen(false)}
        >
          Register
        </Link>
      </li>
    </>
  )

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Tractor className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-green-800">AgroVerse</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600">
              Home
            </Link>
            <Link
              to="/equipment"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600"
            >
              Equipment
            </Link>
             <Link to="/chatbot" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600">
             Agrobot
            </Link>
            {isAuthenticated ? (
              <div className="relative group">
                <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 focus:outline-none">
                  {user?.name}
                </button>
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-1">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50">
                      Dashboard
                    </Link>
                    {user?.role === "owner" && (
                      <Link to="/my-equipment" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50">
                        My Equipment
                      </Link>
                    )}
                    <Link to="/my-bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50">
                      My Bookings
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-green-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/equipment"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-green-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Equipment
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-2 space-y-1">{isAuthenticated ? authLinks : guestLinks}</div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
