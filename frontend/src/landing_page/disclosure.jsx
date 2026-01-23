import React from "react";

const Disclosure = () => {
  return (
    <section className="bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
        <div className="text-center">
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-gray-900">
            EquityIQ Disclosure &amp; Disclaimer
          </h1>
          <p className="mt-4 text-base text-gray-600">
            Please read these disclosures carefully before using EquityIQ
            products and services.
          </p>
        </div>

        <div className="mt-12 space-y-8 text-gray-700 leading-relaxed">
          <div className="space-y-4">
            <p>
              The site, including any content or information contained within
              it, is provided on an “as is” basis without warranties of any
              kind, either express or implied, including but not limited to
              warranties of title, non-infringement, merchantability, or fitness
              for a particular purpose. EquityIQ does not warrant that your
              access to the site or related services will be uninterrupted or
              error-free, that defects will be corrected, or that this site or
              the servers are free of viruses or other harmful components.
            </p>
            <p>
              Access to and use of this site and the information provided herein
              is at your own risk. EquityIQ does not accept liability for any
              losses, damages, or disruptions arising from use of this site or
              services.
            </p>
            <p>
              Prices and availability of products and services are subject to
              change without prior notice. Any information on availability is
              provided for convenience only and should not be relied upon for
              decision-making.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Disclaimer and Limitation of Liability
            </h2>
            <p className="mt-3">
              EquityIQ and its affiliates, employees, agents, or representatives
              will never request sensitive information such as your login
              credentials, password, Aadhaar OTP, or bank details. Do not share
              such information with anyone claiming to represent EquityIQ.
            </p>
            <p className="mt-3">
              If you suspect fraudulent activity, please contact our support
              team immediately through the official channels listed on the
              website.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              No Partnership or Agency
            </h2>
            <p>
              Nothing in these terms shall be deemed to constitute a partnership
              between EquityIQ and any client or third party, nor shall any
              client or third party be deemed to be an agent of EquityIQ for any
              purpose.
            </p>
            <p>
              As per the SEBI Circular (Ref: SEBI/HO/MIRSD/DOP/P/CIR/2022/117,
              dated September 2, 2022), EquityIQ does not partner or associate
              directly or indirectly with any person or entity that provides or
              promises algorithmic strategies or services claiming past or
              expected future returns.
            </p>
            <a
              href="https://www.sebi.gov.in/legal/circulars/sep-2022/performance-return-claimed-by-unregulated-platforms-offering-algorithmic-strategies-for-trading_62628.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Read the SEBI circular
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Disclosure;
