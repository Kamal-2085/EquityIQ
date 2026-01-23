import React from "react";

const Charges = () => {
  return (
    <section className="bg-gray-50 py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Charges explained
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Securities/Commodities transaction tax */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Securities/Commodities transaction tax
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Tax by the government when transacting on the exchanges. Charged
              as above on both buy and sell sides when trading equity delivery.
              Charged only on selling side when trading intraday or on F&O. When
              trading at Zerodha, STT/CTT can be a lot more than the brokerage
              we charge. Important to keep a tab.
            </p>
          </div>

          {/* Transaction/Turnover Charges */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Transaction/Turnover Charges
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Charged by exchanges (NSE, BSE, MCX) on the value of your
              transactions. BSE has revised transaction charges in XC, XD, XT, Z
              and ZP groups to ₹10,000 per crore w.e.f 01.01.2016. (XC and XD
              groups have been merged into a new group X w.e.f 01.12.2017) BSE
              has revised transaction charges in SS and ST groups to ₹1,00,000
              per crore of gross turnover. BSE has revised transaction charges
              for group A, B and other non exclusive scrips (non-exclusive
              scrips from group E, F, FC, G, GC, W, T) at ₹375 per crore of
              turnover on flat rate basis w.e.f. December 1, 2022. BSE has
              revised transaction charges in M, MT, TS and MS groups to ₹275 per
              crore of gross turnover.
            </p>
          </div>

          {/* Call & trade */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Call & trade
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Additional charges of ₹50 per order for orders placed through a
              dealer at Zerodha including auto square off orders.
            </p>
          </div>

          {/* Stamp charges */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Stamp charges
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Stamp charges by the Government of India as per the Indian Stamp
              Act of 1899 for transacting in instruments on the stock exchanges
              and depositories.
            </p>
          </div>

          {/* NRI brokerage charges */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              NRI brokerage charges
            </h2>
            <p className="text-gray-600 leading-relaxed">
              For a non-PIS account, 0.5% or ₹50 per executed order for equity
              and F&O (whichever is lower). For a PIS account, 0.5% or ₹200 per
              executed order for equity (whichever is lower). ₹500 + GST as
              yearly account maintenance charges (AMC) charges.
            </p>
          </div>

          {/* Account with debit balance */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Account with debit balance
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If the account is in debit balance, any order placed will be
              charged ₹40 per executed order instead of ₹20 per executed order.
            </p>
          </div>

          {/* Charges for Investor's Protection Fund Trust (IPFT) by NSE */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Charges for Investor's Protection Fund Trust (IPFT) by NSE
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Equity and Futures - ₹10 per crore + GST of the traded value.
              Options - ₹50 per crore + GST traded value (premium value).
              Currency - ₹0.05 per lakh + GST of turnover for Futures and ₹2 per
              lakh + GST of premium for Options.
            </p>
          </div>

          {/* Margin Trading Facility (MTF) */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Margin Trading Facility (MTF)
            </h2>
            <p className="text-gray-600 leading-relaxed">
              MTF Interest: 0.04% per day (₹40 per lakh) on the funded amount.
              The interest is applied from T+1 day until the day MTF stocks are
              sold. MTF Brokerage: 0.3% or Rs. 20/executed order, whichever is
              lower. MTF pledge charge: ₹15 + GST per pledge and unpledge
              request per ISIN.
            </p>
          </div>

          {/* GST */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              GST
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Tax levied by the government on the services rendered. 18% of (
              brokerage + SEBI charges + transaction charges)
            </p>
          </div>

          {/* SEBI Charges */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              SEBI Charges
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Charged at ₹10 per crore + GST by Securities and Exchange Board of
              India for regulating the markets.
            </p>
          </div>

          {/* DP (Depository participant) charges */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              DP (Depository participant) charges
            </h2>
            <p className="text-gray-600 leading-relaxed">
              ₹15.34 per scrip (₹3.5 CDSL fee + ₹9.5 Zerodha fee + ₹2.34 GST) is
              charged on the trading account ledger when stocks are sold,
              irrespective of quantity. Female demat account holders (as first
              holder) will enjoy a discount of ₹0.25 per transaction on the CDSL
              fee. Debit transactions of mutual funds & bonds get an additional
              discount of ₹0.25 on the CDSL fee.
            </p>
          </div>

          {/* Pledging charges */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Pledging charges
            </h2>
            <p className="text-gray-600 leading-relaxed">
              ₹30 + GST per pledge request per ISIN.
            </p>
          </div>

          {/* AMC (Account maintenance charges) */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              AMC (Account maintenance charges)
            </h2>
            <p className="text-gray-600 leading-relaxed">
              For BSDA demat account: Zero charges if the holding value is less
              than ₹4,00,000. To learn more about BSDA, Click here For non-BSDA
              demat accounts: ₹300/year + 18% GST charged quarterly (90 days).
              To learn more about AMC, Click here
            </p>
          </div>

          {/* Corporate action order charges */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Corporate action order charges
            </h2>
            <p className="text-gray-600 leading-relaxed">
              ₹20 plus GST will be charged for OFS / buyback / takeover /
              delisting orders placed through Console.
            </p>
          </div>

          {/* Off-market transfer charges */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Off-market transfer charges
            </h2>
            <p className="text-gray-600 leading-relaxed">
              ₹25 per transaction.
            </p>
          </div>

          {/* Physical CMR request */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Physical CMR request
            </h2>
            <p className="text-gray-600 leading-relaxed">
              First CMR request is free. ₹20 + ₹100 (courier charge) + 18% GST
              for subsequent requests.
            </p>
          </div>

          {/* Payment gateway charges */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Payment gateway charges
            </h2>
            <p className="text-gray-600 leading-relaxed">
              ₹9 + GST (Not levied on transfers done via UPI)
            </p>
          </div>

          {/* Delayed Payment Charges */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Delayed Payment Charges
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Interest is levied at 18% a year or 0.05% per day on the debit
              balance in your trading account. Learn more.
            </p>
          </div>

          {/* Trading using 3-in-1 account with block functionality */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Trading using 3-in-1 account with block functionality
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Delivery & MTF Brokerage: 0.5% per executed order. Intraday
              Brokerage: 0.05% per executed order.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-green-300">
            Disclaimer
          </h2>
          <p className="text-gray-700 leading-relaxed">
            For Delivery based trades, a minimum of ₹0.01 will be charged per contract note. 
            Clients who opt to receive physical contract notes will be charged ₹20 per contract note plus courier charges. 
            Brokerage will not exceed the rates specified by SEBI and the exchanges. 
            All statutory and regulatory charges will be levied at actuals. 
            Brokerage is also charged on expired, exercised, and assigned options contracts. 
            Free investments are available only for our retail individual clients. 
            Companies, Partnerships, Trusts, and HUFs need to pay 0.1% or ₹20 (whichever is less) as delivery brokerage. 
            A brokerage of 0.25% of the contract value will be charged for contracts where physical delivery happens. 
            For netted off positions in physically settled contracts, a brokerage of 0.1% will be charged.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Charges;
