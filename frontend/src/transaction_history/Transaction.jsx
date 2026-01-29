import React from 'react'
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

const Transaction = () => {
  const isAdd = txntype === "add";

  return (
    <div className="flex items-start justify-between border-b border-gray-200 px-4 py-4 hover:bg-gray-50 transition">
      
      {/* Left section */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            isAdd ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          {isAdd ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium text-gray-900">
            {txntype}
          </h3>
          <h3 className="text-xs text-gray-500">
            {dateTime}
          </h3>
        </div>
      </div>

      {/* Right section */}
      <div className="flex flex-col items-end gap-1">
        <h3
          className={`text-sm font-semibold ${
            isAdd ? "text-green-600" : "text-red-600"
          }`}
        >
          {isAdd ? "+" : "-"}{Amount}
        </h3>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>UPI Transaction ID:</span>
          <span className="font-mono text-gray-600">
            {txnID}
          </span>
        </div>
      </div>

    </div>
  )
}

export default Transaction