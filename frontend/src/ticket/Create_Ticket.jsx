import React from "react";

const Create_Ticket = () => {
  return (
    <section className="bg-white py-30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Contact Us</h1>
            <p className="mt-3 text-gray-600">
              Please fill out the form below to contact us
            </p>
          </div>

          <div className="bg-slate-100 rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Send Your Message
            </h2>

            <form className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Email Address
                </span>
                <input
                  type="text"
                  placeholder="Enter your fullname"
                  className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Issue
                </span>
                <input
                  type="email"
                  placeholder="Enter your issue"
                  className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Message
                </span>
                <textarea
                  rows={4}
                  placeholder="Describe your issue in detail"
                  className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-900 transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Create_Ticket;
