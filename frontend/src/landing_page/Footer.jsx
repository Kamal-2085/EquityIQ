import React from "react";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";
import img2 from "/img2.png?url";
import { Link } from "react-router-dom";
import Privacy from "./Privacy.jsx";
const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        {/* Top Section: Logo, Copyright & Navigation */}
        <div className="flex flex-col lg:flex-row justify-between mb-8">
          {/* Logo and Copyright Section with Social Icons Below */}
          <div className="mb-8 lg:mb-0 lg:w-1/3">
            <div className="mb-6">
              <img src={img2} alt="EquityIQ Logo" className="h-8 mb-4" />
              <p className="text-sm">© 2025 - 2026, EquityIQ Broking Ltd.</p>
              <p className="text-sm mb-6">All rights reserved.</p>

              {/* Social Media Icons - Placed right below "All rights reserved." */}
              <div className="flex space-x-4">
                <a
                  href="https://x.com/kamal_iiti2694"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-black transition-colors"
                >
                  <FaXTwitter size={20} />
                </a>
                <a
                  href="https://www.facebook.com/kamal.realme.1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <FaFacebook size={20} />
                </a>
                <a
                  href="https://www.instagram.com/_kamal2085/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-pink-600 transition-colors"
                >
                  <FaInstagram size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/kamal-kumar-seeklearner-66026931a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-700 transition-colors"
                >
                  <FaLinkedinIn size={20} />
                </a>
                <a
                  href="https://www.youtube.com/@KamalIITian"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-red-600 transition-colors"
                >
                  <FaYoutube size={20} />
                </a>
                <a
                  href="https://api.whatsapp.com/send/?phone=%2B917004352857&text&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-green-500 transition-colors"
                >
                  <FaWhatsapp size={20} />
                </a>
                <a
                  href="https://t.me/kamalkumar0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <FaTelegram size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:w-2/3">
            <div>
              <h1 className="font-semibold text-gray-800 mb-4">Account</h1>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-blue-600 cursor-pointer">
                  Open demat account
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  Minor demat account
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  NRI demat account
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  Commodity
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  Dematerialisation
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  Fund transfer
                </li>
                <li className="hover:text-blue-600 cursor-pointer">MTF</li>
                <li className="hover:text-blue-600 cursor-pointer">
                  Referral program
                </li>
              </ul>
            </div>
            <div>
              <h1 className="font-semibold text-gray-800 mb-4">Support</h1>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-blue-600 cursor-pointer">
                  <Link to="/contact">Contact us</Link>
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  Support portal
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  How to file a complaint?
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  Status of your complaints
                </li>
                <li className="hover:text-blue-600 cursor-pointer">Bulletin</li>
                <li className="hover:text-blue-600 cursor-pointer">Circular</li>
                <li className="hover:text-blue-600 cursor-pointer">
                  EquityIQ Insights
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  Downloads
                </li>
              </ul>
            </div>
            <div>
              <h1 className="font-semibold text-gray-800 mb-4">Company</h1>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-blue-600 cursor-pointer">
                  <Link to="/about">About</Link>
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  <Link to="/philosophies">Philosophy</Link>
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  Press & media
                </li>
                <li className="hover:text-blue-600 cursor-pointer">Careers</li>
                <li className="hover:text-blue-600 cursor-pointer">
                  EquityIQ Cares (CSR)
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  EquityIQ.tech
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  Open source
                </li>
              </ul>
            </div>
            <div>
              <h1 className="font-semibold text-gray-800 mb-4">Quick links</h1>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-blue-600 cursor-pointer">
                  Upcoming IPOs
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  Brokerage charges
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  Market holidays
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  Economic calendar
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  Calculators
                </li>
                <li className="hover:text-blue-600 cursor-pointer">Markets</li>
                <li className="hover:text-blue-600 cursor-pointer">Sectors</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section: Legal & Compliance */}
        <div className="border-t border-gray-300 pt-8">
          <div className="mb-8">
            <div className="space-y-4 text-xs text-gray-600">
              <p>
                EquityIQ Broking Ltd.: Member of NSE, BSE​ &​ MCX – SEBI
                Registration no.: INZ000031633 CDSL/NSDL: Depository services
                through EquityIQ Broking Ltd. – SEBI Registration no.:
                IN-DP-431-2019 Registered Address: EquityIQ Broking Ltd.,
                #153/154, 4th Cross, Dollars Colony, Opp. Clarence Public
                School, J.P Nagar 4th Phase, Bengaluru - 560078, Karnataka,
                India. For any complaints pertaining to securities broking
                please write to complaints@equityiq.com, for DP related to
                dp@equityiq.com. Please ensure you carefully read the Risk
                Disclosure Document as prescribed by SEBI | ICF
              </p>
              <p>
                Procedure to file a complaint on SEBI SCORES: Register on SCORES
                portal. Mandatory details for filing complaints on SCORES: Name,
                PAN, Address, Mobile Number, E-mail ID. Benefits: Effective
                Communication, Speedy redressal of the grievances
              </p>
              <p>
                Smart Online Dispute Resolution | Grievances Redressal Mechanism
              </p>
              <p>
                Investments in securities market are subject to market risks;
                read all the related documents carefully before investing.
              </p>
              <p>
                Attention investors: 1) Stock brokers can accept securities as
                margins from clients only by way of pledge in the depository
                system w.e.f September 01, 2020. 2) Update your e-mail and phone
                number with your stock broker / depository participant and
                receive OTP directly from depository on your e-mail and/or
                mobile number to create pledge. 3) Check your securities / MF /
                bonds in the consolidated account statement issued by NSDL/CDSL
                every month.
              </p>
              <p>
                India's largest broker based on networth as per NSE. NSE broker
                factsheet
              </p>
              <p>
                "Prevent unauthorised transactions in your account. Update your
                mobile numbers/email IDs with your stock brokers. Receive
                information of your transactions directly from Exchange on your
                mobile/email at the end of the day. Issued in the interest of
                investors. KYC is one time exercise while dealing in securities
                markets - once KYC is done through a SEBI registered
                intermediary (broker, DP, Mutual Fund etc.), you need not
                undergo the same process again when you approach another
                intermediary." Dear Investor, if you are subscribing to an IPO,
                there is no need to issue a cheque. Please write the Bank
                account number and sign the IPO application form to authorize
                your bank to make payment in case of allotment. In case of non
                allotment the funds will remain in your bank account. As a
                business we don't give stock tips, and have not authorized
                anyone to trade on behalf of others. If you find anyone claiming
                to be part of EquityIQ and offering such services, please create
                a ticket here.
              </p>
              <p>
                *Customers availing insurance advisory services offered by Ditto
                (Tacterial Consulting Private Limited | IRDAI Registered
                Corporate Agent (Composite) License No CA0738) will not have
                access to the exchange investor grievance redressal forum, SEBI
                SCORES/ODR, or arbitration mechanism for such products.
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div>
            <ul className="flex flex-wrap gap-4 text-xs text-gray-600">
              <li className="cursor-pointer">
                <a
                  href="https://www.nseindia.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-900 transition-colors"
                >
                  NSE
                </a>
              </li>
              <li className="hover:text-blue-600 cursor-pointer">
                <a
                  href="https://www.bseindia.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-900 transition-colors"
                >
                  BSE
                </a>
              </li>
              <li className="hover:text-blue-600 cursor-pointer">
                <a
                  href="https://www.mcxindia.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-900 transition-colors"
                >
                  MCX
                </a>
              </li>
              <li className="hover:text-blue-600 cursor-pointer">
                <Link to="/TermsAndConditions">Terms & conditions</Link>
              </li>
              <li className="hover:text-blue-600 cursor-pointer">
                <Link to="/policies">Policies & procedures</Link>
              </li>
              <li className="hover:text-blue-600 cursor-pointer">
                <Link to="/privacy">Privacy policy</Link>
              </li>
              <li className="hover:text-blue-600 cursor-pointer">
                <Link to="/disclosure">Disclosure</Link>
              </li>
              <li className="hover:text-blue-600 cursor-pointer">
                <Link to="/investor">Investor's attention</Link>
              </li>
              <li className="hover:text-blue-600 cursor-pointer">
                <Link to="/investor-charter">Investor charter</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
