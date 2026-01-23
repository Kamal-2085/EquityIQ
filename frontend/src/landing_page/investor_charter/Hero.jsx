import React from "react";

const Hero = () => {
  const items = [
    {
      title: "Mission",
      description: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            To provide high quality and dependable service through innovation,
            capacity enhancement and use of technology.
          </li>
          <li>
            To establish and maintain a relationship of trust and ethics with
            the investors.
          </li>
          <li>To observe highest standard of compliances and transparency.</li>
          <li>
            To always keep protection of investors' interest as goal while
            providing service.
          </li>
          <li>
            To ensure confidentiality of information shared by investors unless
            such information is required to be provided in furtherance of
            discharging legal obligations or investors have provided specific
            consent to share such information.
          </li>
        </ul>
      ),
    },
    {
      title: "Services provided to Investors",
      description: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Execution of trades on behalf of investors.</li>
          <li>Issuance of Contract Notes.</li>
          <li>Issuance of intimations regarding margin due payments.</li>
          <li>Facilitate execution of early pay-in obligation instructions.</li>
          <li>Periodic settlement of client’s funds.</li>
        </ul>
      ),
    },
    {
      title: "Rights of Investors",
      description: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Ask for and receive information from a firm about the work history
            and background of the person handling your account, as well as
            information about the firm itself (including website providing
            mandatory information).
          </li>
          <li>
            Receive complete information about the risks, obligations, and costs
            of any investment before investing.
          </li>
          <li>
            Receive a copy of all completed account forms and rights &
            obligation document.
          </li>
          <li>Receive a copy of Most Important Terms & Conditions (MITC).</li>
          <li>
            Receive account statements that are accurate and understandable.
          </li>
        </ul>
      ),
    },
    {
      title: "Various activities of Stock Brokers with timelines",
      description: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            KYC entered into KRA System and CKYCR - 3 days of account opening
          </li>
          <li>Client Onboarding - Immediate, but not later than one week</li>
          <li>
            Order execution - Immediate on receipt of order, but not later than
            the same day
          </li>
          <li>Allocation of Unique Client Code - Before trading</li>
          <li>
            Copy of duly completed Client Registration Documents to clients - 7
            days from the date of upload of Unique Client Code to the Exchange
            by the trading member
          </li>
        </ul>
      ),
    },
    {
      title: "DOs and DON’Ts for Investors",
      description: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Read all documents and conditions being agreed before signing the
            account opening form.
          </li>
          <li>
            Receive a copy of KYC, copy of account opening documents and Unique
            Client Code.
          </li>
          <li>
            Read the product/operational framework/timelines related to various
            Trading and Clearing & Settlement processes.
          </li>
          <li>Do not deal with unregistered stockbroker.</li>
          <li>
            Do not forget to strike off blanks in your account opening and KYC
            form.
          </li>
        </ul>
      ),
    },
  ];
  return (
    <section className="bg-white">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 pb-16 sm:pb-20">
        <div className="space-y-10 sm:space-y-12 text-sm sm:text-base text-gray-600">
          {items.map((item) => (
            <div key={item.title}>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {item.title}
              </h2>
              <div className="mt-3 leading-relaxed">{item.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
