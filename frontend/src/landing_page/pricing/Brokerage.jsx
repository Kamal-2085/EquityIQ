import React, { useState } from "react";
import { chargesData } from "./chargesData.jsx";
import ChargesTable from "./chargesTabel.jsx";

const Charges = () => {
  const [activeTab, setActiveTab] = useState("equity");

  const tabs = ["equity", "currency", "commodity"];

  return (
    <section className="max-w-6xl mx-auto px-6 py-5">

      {/* Tabs */}
      <div className="flex gap-10 border-b mb-10 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-lg capitalize transition ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            } cursor-pointer`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <ChargesTable data={chargesData[activeTab]} />

      {/* Calculator link */}
      <p className="text-center mt-10 text-blue-600 cursor-pointer hover:underline">
        Calculate your costs upfront using our brokerage calculator
      </p>
    </section>
  );
};

export default Charges;
