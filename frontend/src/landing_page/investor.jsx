import React from "react";

const Investor = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 text-center">
          For investor's attention
        </h1>
        <div className="w-full h-px bg-gray-200 my-14"></div>
        <div className="space-y-14 text-gray-700 leading-relaxed">
          <div>
            <ul className="space-y-4 list-decimal list-inside">
              <li>
                Beware of fixed/guaranteed/regular returns/ capital protection
                schemes. Brokers or their authorized persons or any of their
                associates are not authorized to offer fixed/guaranteed/regular
                returns/ capital protection on your investment or authorized to
                enter into any loan agreement with you to pay interest on the
                funds offered by you. Please note that in case of default of a
                member claim for funds or securities given to the broker under
                any arrangement/ agreement of indicative return will not be
                accepted by the relevant Committee of the Exchange as per the
                approved norms.
              </li>
              <li>
                Do not keep funds idle with the Stock Broker. Please note that
                your stock broker has to return the credit balance lying with
                them, within three working days in case you have not done any
                transaction within last 30 calendar days. Please note that in
                case of default of a Member, claim for funds and securities,
                without any transaction on the exchange will not be accepted by
                the relevant Committee of the Exchange as per the approved
                norms.
              </li>
              <li>
                Check the frequency of accounts settlement opted for. If you
                have opted for running account, please ensure that your broker
                settles your account and, in any case, not later than once in 90
                days (or 30 days if you have opted for 30 days settlement). In
                case of declaration of trading member as defaulter, the claims
                of clients against such defaulter member would be subject to
                norms for eligibility of claims for compensation from IPF to the
                clients of the defaulter member. These norms are available on
                the Exchange website.
              </li>
              <li>
                Brokers are not permitted to accept transfer of securities as
                margin. Securities offered as margin/ collateral MUST remain in
                the account of the client and can be pledged to the broker only
                by way of ‘margin pledge’, created in the Depository system.
                Clients are not permitted to place any securities with the
                broker or associate of the broker or authorized person of the
                broker for any reason. Broker can take securities belonging to
                clients only for settlement of securities sold by the client.
              </li>
              <li>
                Always keep your contact details viz. Mobile number/Email ID
                updated with the stock broker. Email and mobile number is
                mandatory and you must provide the same to your broker for
                updation in Exchange records. You must immediately take up the
                matter with Stock Broker/Exchange if you are not receiving the
                messages from Exchange/Depositories regularly.
              </li>
              <li>
                Don't ignore any emails/SMSs received from the Exchange for
                trades done by you. Verify the same with the Contract
                notes/Statement of accounts received from your broker and report
                discrepancy, if any, to your broker in writing immediately and
                if the Stock Broker does not respond, please take this up with
                the Exchange/Depositories forthwith.
              </li>
              <li>
                Check messages sent by Exchanges on a weekly basis regarding
                funds and securities balances reported by the trading member,
                compare it with the weekly statement of account sent by broker
                and immediately raise a concern to the exchange if you notice a
                discrepancy.
              </li>
              <li>
                Please do not transfer funds, for the purposes of trading to
                anyone, including an authorized person or an associate of the
                broker, other than a SEBI registered Stock broker.
              </li>
            </ul>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-4">Risk disclosures on derivatives</h1>
            <ul className="space-y-4 list-decimal list-inside">
              <li>
                9 out of 10 individual traders in equity Futures and Options
                Segment, incurred net losses.
              </li>
              <li>
                On an average, loss makers registered net trading loss close to
                ₹50,000.
              </li>
              <li>
                Over and above the net trading losses incurred, loss makers
                expended an additional 28% of net trading losses as transaction
                costs.
              </li>
              <li>
                Those making net trading profits, incurred between 15% to 50% of
                such profits as transaction cost.
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-500 pt-10">
            Source: <span className="text-blue-500 hover:text-blue-800 cursor-pointer"><a href="https://www.sebi.gov.in/reports-and-statistics/research/jan-2023/study-analysis-of-profit-and-loss-of-individual-traders-dealing-in-equity-fando-segment_67525.html" target="_blank" rel="noopener noreferrer">SEBI study</a></span> dated January 25, 2023 on “Analysis of Profit and
            Loss of Individual Traders dealing in equity Futures and Options
            (F&O) Segment”, wherein Aggregate Level findings are based on annual
            Profit/Loss incurred by individual traders in equity F&O during FY
            2021-22.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Investor;
