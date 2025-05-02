"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../config"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.token) {
        setAuthToken(localStorage.token)
        try {
          const res = await axios.get(`${API_URL}/api/auth/me`)
          setUser(res.data)
          setIsAuthenticated(true)
        } catch (err) {
          localStorage.removeItem("token")
          setUser(null)
          setIsAuthenticated(false)
          setError(err.response?.data?.message || "Authentication failed")
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [])

  // Set auth token in headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token
      localStorage.setItem("token", token)
    } else {
      delete axios.defaults.headers.common["x-auth-token"]
      localStorage.removeItem("token")
    }
  }

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post(`${API_URL}/api/users`, formData)
      setAuthToken(res.data.token)
      loadUser()
      return { success: true }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
      return { success: false, error: err.response?.data?.message || "Registration failed" }
    }
  }

  // Login user
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password })
      setAuthToken(res.data.token)

      const userRes = await axios.get(`${API_URL}/api/auth/me`)
      setUser(userRes.data)
      setIsAuthenticated(true)
      setError(null)
      return { success: true }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      return { success: false, error: err.response?.data?.message || "Login failed" }
    }
  }

  // Load user
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`)
        setUser(res.data)
        setIsAuthenticated(true)
        setError(null)
      } catch (err) {
        setUser(null)
        setIsAuthenticated(false)
        setError(err.response?.data?.message || "Authentication failed")
      }
    }
  }

  // Logout user
  const logout = () => {
    setAuthToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
