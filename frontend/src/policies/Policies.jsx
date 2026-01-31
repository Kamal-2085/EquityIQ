import React from "react";

const Policies = () => {
  return (
    <section className="w-full bg-white py-20">
      <div className="mx-auto max-w-4xl px-6 py-12">
        
        {/* Main Heading */}
        <h1 className="text-center text-3xl font-semibold text-gray-900">
          Policies and Procedures
        </h1>

        <div className="my-8 h-px w-full bg-gray-300" />

        {/* Content */}
        <div className="space-y-10 text-sm leading-7 text-gray-700">

          {/* About */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              About EquityIQ
            </h2>
            <p>
              EquityIQ is a digital platform designed to help users manage their
              investments and wallet transactions in a secure and transparent
              manner. These policies and procedures explain how EquityIQ
              operates, how user data is handled, and the responsibilities of
              users while using the platform.
            </p>
          </div>

          {/* User Eligibility */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              User Eligibility
            </h2>
            <p>
              By accessing or using EquityIQ, you confirm that you are legally
              eligible to use financial services under applicable Indian laws.
              Users are responsible for providing accurate and up-to-date
              information during registration and verification processes.
            </p>
          </div>

          {/* Data Collection */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Data Collection and Usage
            </h2>
            <p>
              EquityIQ may collect personal information such as name, email
              address, mobile number, bank details, and transaction information
              to provide its services. This data is used strictly for account
              management, transaction processing, security checks, and
              regulatory compliance.
            </p>
          </div>

          {/* Wallet & Transactions */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Wallet and Transaction Procedures
            </h2>
            <p>
              All wallet transactions, including adding or withdrawing funds,
              are subject to verification checks. EquityIQ reserves the right to
              delay, reject, or reverse transactions in case of suspected fraud,
              incorrect details, or regulatory requirements.
            </p>
          </div>

          {/* Bank Account Linking */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Bank Account Linking
            </h2>
            <p>
              Users must link a valid bank account registered in their own name
              to withdraw funds. Bank account details are verified using OTP or
              other verification mechanisms before being approved for use.
            </p>
          </div>

          {/* Security */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Security Measures
            </h2>
            <p>
              EquityIQ follows reasonable security practices to protect user
              data. Users are responsible for maintaining the confidentiality of
              their login credentials and must immediately report any
              unauthorized access or suspicious activity.
            </p>
          </div>

          {/* Policy Updates */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Changes to Policies
            </h2>
            <p>
              EquityIQ may update these policies and procedures from time to
              time. Continued use of the platform after updates constitutes
              acceptance of the revised policies.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Contact and Support
            </h2>
            <p>
              If you have any questions regarding these policies or your use of
              EquityIQ, you may contact our support team through the official
              channels provided on the website.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Policies;
