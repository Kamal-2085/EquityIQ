import React from 'react'
import { FiDownload } from "react-icons/fi";

const Header = () => {
  return (
    <section className="w-full border-b border-gray-200 bg-white py-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-gray-900">
            All Transactions
          </h1>
          <h2 className="mt-1 text-sm text-gray-500">
            ₹account_balance
          </h2>
        </div>

        <button className="flex items-center gap-2 rounded-md border bg-green-500 border-green-300 px-4 py-2 text-sm font-medium text-white hover:bg-green-50 hover:text-green-900 transition cursor-pointer">
          <FiDownload className="text-base" />
          Download Statement
        </button>

      </div>
    </section>
  )
}

export default Header