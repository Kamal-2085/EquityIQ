import React from "react";
import { CiCirclePlus } from "react-icons/ci";
import { MdOutlineAccountCircle } from "react-icons/md";
import img8 from "../../assets/img8.png";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { RiDashboard2Line } from "react-icons/ri";
import img11 from "../../assets/img11.png";

const Hero = () => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6">

          {/* Card */}
          <div className="border rounded-md bg-white">
            <div className="flex items-center gap-3 px-6 py-4 border-b">
              <CiCirclePlus className="text-blue-600 text-2xl" />
              <h1 className="text-lg font-semibold">Account Opening</h1>
            </div>
            <ul className="px-10 py-4 space-y-2 text-blue-600 text-sm list-disc">
              <li>Resident individual</li>
              <li>Minor</li>
              <li>Non Resident Indian (NRI)</li>
              <li>Company, Partnership, HUF and LLP</li>
              <li>Glossary</li>
            </ul>
          </div>

          <div className="border rounded-md bg-white">
            <div className="flex items-center gap-3 px-6 py-4 border-b">
              <MdOutlineAccountCircle className="text-blue-600 text-2xl" />
              <h1 className="text-lg font-semibold">Your EquityIQ Account</h1>
            </div>
            <ul className="px-10 py-4 space-y-2 text-blue-600 text-sm list-disc">
              <li>Your Profile</li>
              <li>Account modification</li>
              <li>Client Master Report (CMR) and Depository Participant (DP)</li>
              <li>Nomination</li>
              <li>Transfer and conversion of securities</li>
            </ul>
          </div>

          <div className="border rounded-md bg-white">
            <div className="flex items-center gap-3 px-6 py-4 border-b">
              <img src={img8} alt="" className="w-6 h-6" />
              <h1 className="text-lg font-semibold">Pulse</h1>
            </div>
            <ul className="px-10 py-4 space-y-2 text-blue-600 text-sm list-disc">
              <li>IPO</li>
              <li>Trading FAQs</li>
              <li>Margin Trading Facility (MTF) and Margins</li>
              <li>Charts and orders</li>
              <li>Alerts and Nudges</li>
              <li>General</li>
            </ul>
          </div>

          <div className="border rounded-md bg-white">
            <div className="flex items-center gap-3 px-6 py-4 border-b">
              <RiMoneyRupeeCircleLine className="text-blue-600 text-2xl" />
              <h1 className="text-lg font-semibold">Funds</h1>
            </div>
            <ul className="px-10 py-4 space-y-2 text-blue-600 text-sm list-disc">
              <li>Add money</li>
              <li>Withdraw money</li>
              <li>Add bank accounts</li>
              <li>eMandates</li>
            </ul>
          </div>

          <div className="border rounded-md bg-white">
            <div className="flex items-center gap-3 px-6 py-4 border-b">
              <RiDashboard2Line className="text-blue-600 text-2xl" />
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
            <ul className="px-10 py-4 space-y-2 text-blue-600 text-sm list-disc">
              <li>Portfolio</li>
              <li>Corporate Actions</li>
              <li>Fund Statement</li>
              <li>Reports</li>
              <li>Segments</li>
            </ul>
          </div>

          <div className="border rounded-md bg-white">
            <div className="flex items-center gap-3 px-6 py-4 border-b">
              <img src={img11} alt="" className="w-6 h-6" />
              <h1 className="text-lg font-semibold">WealthIQ</h1>
            </div>
            <ul className="px-10 py-4 space-y-2 text-blue-600 text-sm list-disc">
              <li>Mutual Funds</li>
              <li>National Pension Scheme (NPS)</li>
              <li>Features on WealthIQ</li>
              <li>Payments and Orders</li>
              <li>General</li>
            </ul>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          <div className="bg-orange-50 border-l-4 border-orange-500 p-5 rounded-md">
            <ul className="space-y-3 text-blue-600 text-sm">
              <li>Offer for sale (OFS) – January 2026</li>
              <li>Rights Entitlements listing in January 2026</li>
            </ul>
          </div>

          <div className="border rounded-md bg-white">
            <h2 className="px-5 py-4 border-b text-lg font-semibold">
              Quick links
            </h2>
            <ul className="px-5 py-4 space-y-3 text-blue-600 text-sm">
              <li>Track account opening</li>
              <li>Track Segment Activation</li>
              <li>Intraday margins</li>
              <li>Pulse user Manual</li>
              <li>Learn how to create a ticket</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
