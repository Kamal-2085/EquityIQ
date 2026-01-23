import React from "react";
import img7 from "../../assets/img7.png";
import img22 from "../../assets/img22.png";
import img23 from "../../assets/img23.png";
import img24 from "../../assets/img24.png";
import img25 from "../../assets/img25.png";
import img26 from "../../assets/img26.png";
import { Link } from 'react-router-dom';
const Universe = () => {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-sm text-gray-600 mb-16">
          Want to know more about our technology stack?
          <span className="text-blue-600 cursor-pointer hover:underline">
            Check out the EquityIQ.tech blog.
          </span>
        </p>
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            The EquityIQ Universe
          </h1>
          <h3 className="text-lg text-gray-600">
            Extend your trading and investment experience even further with our
            partner platforms
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16 text-center">
          <div>
            <img src={img7} alt="" className="h-12 mx-auto mb-4" />
            <h1 className="text-lg font-medium mb-2">WealthIQ Funds</h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              A smart, transparent asset management platform designed for
              long-term wealth creation. Invest in diversified, low-cost funds
              built to help you achieve your financial goals with clarity and
              control.
            </p>
          </div>
          <div>
            <img src={img22} alt="" className="h-12 mx-auto mb-4" />
            <h1 className="text-lg font-medium mb-2">OptionsIQ</h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              An advanced options analytics and trading platform for serious
              derivatives traders. Build strategies, analyze risk, track open
              interest, and make data-driven decisions with confidence.
            </p>
          </div>
          <div>
            <img src={img23} alt="" className="h-12 mx-auto mb-4" />
            <h1 className="text-lg font-medium mb-2">InsightIQ</h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              A deep investment research platform that turns complex market data
              into actionable insights. Explore companies, sectors, trends, and
              fundamentals to make informed long-term investment decisions.
            </p>
          </div>
          <div>
            <img src={img24} alt="" className="h-12 mx-auto mb-4" />
            <h1 className="text-lg font-medium mb-2">StrategyIQ</h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              A systematic trading platform to create, test, and automate
              trading strategies without writing code. Backtest ideas, deploy
              strategies, and trade with discipline across market conditions.
            </p>
          </div>
          <div>
            <img src={img25} alt="" className="h-12 mx-auto mb-4" />
            <h1 className="text-lg font-medium mb-2">ThemeIQ</h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              A thematic investing platform to invest in curated baskets of
              stocks and ETFs. Gain exposure to trends, sectors, and ideas with
              diversified portfolios tailored for modern investors.
            </p>
          </div>
          <div>
            <img src={img26} alt="" className="h-12 mx-auto mb-4" />
            <h1 className="text-lg font-medium mb-2">CoverIQ</h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Personalized guidance for life, health, and financial
              protection—without spam or mis-selling. Get unbiased advice to
              choose the right coverage for you and your family, transparently.
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-16">
          <button  className="bg-blue-600 text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition"><Link to="/signup">Sign up for free</Link></button>
        </div>
      </div>
    </section>
  );
};

export default Universe;
