import { Link } from "react-router-dom"
import { Search, Calendar, CreditCard, Tractor, Users, Shield, Leaf, MapPin } from "lucide-react"

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Rent Agricultural Equipment with Ease</h1>
          <p className="text-xl mb-8">
            AgroVerse connects farmers with equipment owners to make modern farming accessible to everyone
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/equipment"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Browse Equipment
            </Link>
            <Link
              to="/register"
              className="bg-white hover:bg-gray-100 text-green-800 font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Join AgroVerse
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How AgroVerse Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Renting agricultural equipment has never been easier. Follow these simple steps:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Equipment</h3>
              <p className="text-gray-600">
                Browse our extensive catalog of agricultural equipment available for rent in your area.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book & Pay</h3>
              <p className="text-gray-600">
                Select your rental dates and complete the secure booking process with our easy payment system.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Tractor className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Use Equipment</h3>
              <p className="text-gray-600">
                Pick up the equipment and use it for your farming needs. Return it when your rental period ends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose AgroVerse</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform offers unique benefits for both equipment owners and farmers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="feature-icon mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Availability</h3>
              <p className="text-gray-600">
                See equipment availability in real-time and book instantly without delays.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="feature-icon mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Location-based Search</h3>
              <p className="text-gray-600">Find equipment near you to minimize transportation costs and time.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="feature-icon mb-4">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Transactions</h3>
              <p className="text-gray-600">Our secure payment system protects both renters and owners.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="feature-icon mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Community Building</h3>
              <p className="text-gray-600">Connect with other farmers and equipment owners in your region.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Benefits for Farmers</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Shield className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Access modern equipment without the high purchase costs</span>
                </li>
                <li className="flex items-start">
                  <Shield className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Improve farm productivity with the right tools for each job</span>
                </li>
                <li className="flex items-start">
                  <Shield className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Reduce operational costs and increase profitability</span>
                </li>
                <li className="flex items-start">
                  <Shield className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Try different equipment before making purchase decisions</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Benefits for Equipment Owners</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Leaf className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Generate additional income from your unused equipment</span>
                </li>
                <li className="flex items-start">
                  <Leaf className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Manage your equipment rentals with our easy-to-use platform</span>
                </li>
                <li className="flex items-start">
                  <Leaf className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Reach more potential customers in your area</span>
                </li>
                <li className="flex items-start">
                  <Leaf className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Contribute to sustainable farming practices in your community</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Farming Experience?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of farmers and equipment owners already using AgroVerse to improve agricultural productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white hover:bg-gray-100 text-green-800 font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Sign Up Now
            </Link>
            <Link
              to="/equipment"
              className="bg-transparent hover:bg-green-800 text-white border-2 border-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Browse Equipment
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
