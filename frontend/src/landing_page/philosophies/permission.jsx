import React from "react";

const Permission = () => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-6 py-15">

        {/* TABLE WRAPPER */}
        <div className="overflow-x-auto border border-gray-200 rounded-md">
          <table className="w-full border-collapse text-sm text-gray-700">
            
            {/* TABLE HEAD */}
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left font-semibold px-6 py-4">
                  Permission
                </th>
                <th className="text-left font-semibold px-6 py-4">
                  Pulse (trading)
                </th>
                <th className="text-left font-semibold px-6 py-4">
                  WealthIQ (mutual funds)
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-6 py-4">Storage</td>
                <td className="px-6 py-4">
                  (Optional) For profile picture selection.
                </td>
                <td className="px-6 py-4">
                  (Optional) For downloading reports.
                </td>
              </tr>

              <tr>
                <td className="px-6 py-4">SMS</td>
                <td className="px-6 py-4">–</td>
                <td className="px-6 py-4">
                  (Optional) For UPI registration.
                </td>
              </tr>

              <tr>
                <td className="px-6 py-4">Telephone</td>
                <td className="px-6 py-4">–</td>
                <td className="px-6 py-4">
                  (Optional) For UPI registration.
                </td>
              </tr>

              <tr>
                <td className="px-6 py-4">Camera</td>
                <td className="px-6 py-4">
                  (Optional) For profile picture selection.
                </td>
                <td className="px-6 py-4">
                  (Optional) For UPI QR scanning.
                </td>
              </tr>

              <tr>
                <td className="px-6 py-4">Network access</td>
                <td className="px-6 py-4">Elementary</td>
                <td className="px-6 py-4">Elementary</td>
              </tr>

              <tr>
                <td className="px-6 py-4">View network connections</td>
                <td className="px-6 py-4">
                  To check network status
                </td>
                <td className="px-6 py-4">
                  To check network status
                </td>
              </tr>

              <tr>
                <td className="px-6 py-4">Use biometric hardware</td>
                <td className="px-6 py-4">
                  For biometric 2-factor authentication.
                </td>
                <td className="px-6 py-4">
                  For biometric 2-factor authentication.
                </td>
              </tr>

              <tr>
                <td className="px-6 py-4">Show notifications</td>
                <td className="px-6 py-4">
                  To receive and show FCM notifications
                </td>
                <td className="px-6 py-4">
                  To receive and show FCM notifications
                </td>
              </tr>

              <tr>
                <td className="px-6 py-4">
                  Ask to ignore battery optimisations
                </td>
                <td className="px-6 py-4">
                  (Optional) To stream live market data in the background
                </td>
                <td className="px-6 py-4">–</td>
              </tr>

              <tr>
                <td className="px-6 py-4">
                  Prevent phone from sleeping
                </td>
                <td className="px-6 py-4">
                  To keep the phone awake when live charts are viewed
                </td>
                <td className="px-6 py-4">–</td>
              </tr>

              {/* FOOTNOTE */}
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-4 text-xs text-gray-500 bg-gray-50"
                >
                  * We use Firebase for crash reporting, which is in the process
                  of being replaced with a self-hosted solution.
                </td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>
    </section>
  );
};

export default Permission;

