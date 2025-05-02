"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { Tractor, User, Mail, Lock, AlertCircle, Phone } from "lucide-react"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "farmer", // Default role
  })
  const [formError, setFormError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const { register, isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError(null)

    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setFormError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
    })

    setIsLoading(false)

    if (result.success) {
      navigate("/dashboard")
    } else {
      setFormError(result.error || "Registration failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <Tractor className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {formError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{formError}</p>
              </div>
            </div>
          )}

          <div className="rounded-md -space-y-px">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Full name"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">I am a:</label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    id="farmer"
                    name="role"
                    type="radio"
                    value="farmer"
                    checked={formData.role === "farmer"}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <label htmlFor="farmer" className="ml-2 block text-sm text-gray-700">
                    Farmer (looking to rent)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="owner"
                    name="role"
                    type="radio"
                    value="owner"
                    checked={formData.role === "owner"}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <label htmlFor="owner" className="ml-2 block text-sm text-gray-700">
                    Equipment Owner
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </div>

          <div className="text-sm text-center text-gray-600">
            By signing up, you agree to our{" "}
            <a href="#" className="font-medium text-green-600 hover:text-green-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-green-600 hover:text-green-500">
              Privacy Policy
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
