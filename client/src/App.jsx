import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import PrivateRoute from "./components/routing/PrivateRoute"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import EquipmentListing from "./pages/EquipmentListing"
import EquipmentDetail from "./pages/EquipmentDetail"
import AddEquipment from "./pages/AddEquipment"
import MyBookings from "./pages/MyBookings"
import MyEquipment from "./pages/MyEquipment"
import Profile from "./pages/Profile"
import NotFound from "./pages/NotFound"
import "./App.css"

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/equipment" element={<EquipmentListing />} />
              <Route path="/equipment/:id" element={<EquipmentDetail />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/add-equipment"
                element={
                  <PrivateRoute>
                    <AddEquipment />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <PrivateRoute>
                    <MyBookings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-equipment"
                element={
                  <PrivateRoute>
                    <MyEquipment />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
