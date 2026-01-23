import React from 'react'
import img4 from '../../assets/img4.png'
import { Link } from 'react-router-dom'
const Stats = () => {
  return (
    <section className="w-full flex flex-col items-center py-16">
      <div className="flex items-center md:gap-8 gap-12 mb-12">
        <Link to='/products'
        className="text-blue-600 font-medium hover:text-blue-700 transition">
          Explore our products →
          </Link>
        <a href="#"
         className="text-blue-600 font-medium hover:text-blue-700 transition">
          Try Pulse demo →
          </a>
      </div>
      <div className="w-full flex justify-center">
        <img 
        src={img4} 
        alt="Media mentions" 
        className="w-full max-w-4xl opacity-70"/>
      </div>
    </section>
  )
}

export default Stats