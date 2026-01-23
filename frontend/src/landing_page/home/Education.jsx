import React from 'react'
import img12 from '../../assets/img12.avif'
const Education = () => {
  return (
    <section className="w-full flex justify-center py-24">
      <div className="max-w-7xl w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="flex justify-center lg:justify-start">
          <img src={img12} 
          alt="Market education" 
          className="w-full max-w-md"/>
        </div>
        <div className="space-y-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">Free and open market education</h1>
          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed max-w-lg">Varsity, the largest online stock market education book in the world covering everything from the basics to advanced trading.</p>
            <a href="#" className="inline-block text-blue-600 font-medium hover:text-blue-700 transition"> Academy →</a>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed max-w-lg">TradingQ&A, the most active trading and investment community in India for all your market related queries.</p>
            <a href="#"
            className="inline-block text-blue-600 font-medium hover:text-blue-700 transition">EquityIQ Circle →</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Education