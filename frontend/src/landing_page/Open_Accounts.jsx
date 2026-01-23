import React from 'react'
import { Link } from 'react-router-dom'
const Open_Accounts = () => {
  return (
    <section className="w-full flex justify-center py-24 border-t border-gray-100">
      <div className="max-w-3xl w-full px-6 text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">Open a EquityIQ account</h1>
        <p className="text-gray-600 text-base md:text-lg">Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&O trades.</p>
        <button className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition cursor-pointer"><Link to="/signup">Sign up for free</Link></button>
      </div>
    </section>
  )
}

export default Open_Accounts