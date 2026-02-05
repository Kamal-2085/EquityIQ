import React from "react";
import { Link, useParams } from "react-router-dom";

const CompanyDetails = () => {
  const { company_name } = useParams();
  const decodedName = company_name ? decodeURIComponent(company_name) : "";

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {decodedName || "Company"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Detailed overview and market insights.
          </p>
        </div>
        <Link
          to="/pulse"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Back to Pulse
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">
          Add company-specific data here (price, fundamentals, news, charts).
        </p>
      </div>
    </div>
  );
};

export default CompanyDetails;
