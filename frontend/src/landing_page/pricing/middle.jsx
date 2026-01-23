import React from "react";

const Middle = () => {
  return (
    <section className="bg-gray-50 py-10 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Account Opening Charges */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Charges for account opening
          </h1>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Type of account
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Charges
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                    Online account
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Free
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                    Offline account
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Free
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                    NRI account (offline only)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-red-600 font-semibold">₹ 500</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                    Partnership, LLP, HUF, or Corporate accounts (offline only)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-red-600 font-semibold">₹ 500</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Demat AMC */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Demat AMC (Annual Maintenance Charge)
          </h1>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Value of holdings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    AMC
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                    Up to ₹4 lakh
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Free
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                    ₹4 lakh - ₹10 lakh
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-800">
                      ₹ 100 per year, charged quarterly*
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                    Above ₹10 lakh
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-red-600 font-semibold">
                      ₹ 300 per year, charged quarterly
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              * Lower AMC is applicable only if the account qualifies as a Basic
              Services Demat Account (BSDA). BSDA account holders cannot hold
              more than one demat account. To learn more about BSDA,{" "}
              <p
                
                className="text-blue-600 font-semibold hover:text-blue-800 underline cursor-pointer"
              >
                click here
              </p>
              .
            </p>
          </div>
        </div>

        {/* Optional Value Added Services */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Charges for optional value added services
          </h1>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Billing Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Charges
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                    Tickertape
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    Monthly / Annual
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                          Free
                        </span>
                        <span className="text-gray-800">₹ 0</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-2">
                          Pro
                        </span>
                        <span className="text-gray-800">₹ 249 / ₹ 2399</span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                    Smallcase
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    Per transaction
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                          Buy & Invest More
                        </span>
                        <span className="text-gray-800">₹ 100</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                          SIP
                        </span>
                        <span className="text-gray-800">₹ 10</span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                    Pulse Connect
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    Monthly
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                          Connect
                        </span>
                        <span className="text-gray-800">₹ 500</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                          Personal
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Free
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Middle;
