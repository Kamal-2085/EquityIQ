import React from "react";

const Privacy = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-12 mt-10">
          Privacy policy
        </h1>

        {/* Divider */}
        <div className="border-b mb-12"></div>

        {/* Intro */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">EquityIQ</h2>
          <p className="text-gray-700 leading-relaxed text-sm">
            In the course of using this website or any of the websites under the
            ‘EquityIQ’ domain or availing the products and services vide the
            online application forms and questionnaires, online consents and
            such other details required from time to time on any of EquityIQ’s
            (and/or its affiliates) web platforms or mobile applications,
            EquityIQ and/or its affiliates may become privy to some of Your
            personal information, including which may or may not be of
            confidential nature. EquityIQ is strongly committed to protecting the
            privacy of its users/clients and has taken all necessary and
            reasonable measures to protect the confidentiality of any customer
            information.
          </p>

          <p className="text-gray-700 leading-relaxed text-sm">
            For the purpose of these Privacy Policy, wherever the context so
            mentions “Covered Persons”, "Client","You" or "Your”, it shall mean
            any natural or legal person who has visited this website/platform
            and/or has agreed to or has enquired open an account and/or initiated
            the process of opening an account.
          </p>
        </div>

        {/* Sections */}
        <div className="mt-12 space-y-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Scope of this Policy
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Any natural or legal person who has visited the website/platform
              and/or the mobile application shall come under the purview of this
              Privacy Policy. EquityIQ shall at all times follow rules prescribed
              under the Information Technology Act, 2000, and guidelines issued
              by SEBI and other regulators.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Collection and use of your personal information
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              EquityIQ may collect personal information required for KYC, AML,
              account opening, identity verification, and regulatory compliance.
              This may include name, contact details, PAN, bank information,
              documents, and other necessary data.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Aadhaar user consent policy
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Providing Aadhaar is completely voluntary and is used only for
              online account opening and digital signing. Users may choose
              offline account opening without Aadhaar.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              EquityIQ does not store Aadhaar information
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Aadhaar data is accessed only via DigiLocker with user consent and
              limited to essential KYC details. EquityIQ does not store Aadhaar
              numbers or biometric data.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Subject to change
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              This Privacy Policy may be updated from time to time. Users are
              advised to review this page periodically. Continued use of the
              platform implies acceptance of the updated policy.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 mt-12">
          Last updated on January 2026
        </p>
      </div>
    </section>
  );
};

export default Privacy;
