import React from 'react'
import img5 from '../../assets/img5.svg'
import img6 from '../../assets/img6.svg'
const Hero = () => {
  return (
    <section className="w-full bg-white py-28">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-24">
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">Charges</h1>
                <p className="text-gray-500 text-base">List of all charges and taxes</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-20 text-center">
                <div>
                    <img src={img5} alt=""  className="h-28 mx-auto mb-8"/>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Free equity delivery</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">All equity delivery investments (NSE, BSE), are absolutely free — ₹ 0 brokerage.</p>
                </div>
                <div>
                    <img src={img6} alt="" className="h-28 mx-auto mb-8"/>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Intraday and F&O trades</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">Flat ₹ 20 or 0.03% (whichever is lower) per executed order on intraday trades across equity, currency, and commodity trades. Flat ₹20 on all option trades.</p>
                </div>
                <div>
                    <img src={img5} alt="" className="h-28 mx-auto mb-8"/>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Free direct MF</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">All direct mutual fund investments are absolutely free — ₹ 0 commissions & DP charges.</p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Hero