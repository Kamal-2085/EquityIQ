import React from 'react'
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";
const Transaction = () => {
  return (
    <div>
        <div><h3>Add Added/Add Withdrawn</h3>
        <h3>{Amount}</h3></div>
        <div>
            <h3>{dateTime}</h3>
            <div>
                <h3>UPI Transaction ID:</h3>
                <h3>{txnID}</h3>
            </div>
        </div>
    </div>
  )
}

export default Transaction