import React from "react";
import img2 from "../../assets/img2.svg";
const Hero = () => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-10 mt-10">
            Our Philosophies
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left text-gray-600 text-sm leading-relaxed">
            <p>
              Our principles—customer interest over growth, transparency, and
              our product development philosophies—are the reasons why millions
              of customers have come to trust us over the years. Today, 1.6+
              crore customers trust EquityIQ with ~ ₹6 lakh crores of equity
              investments and contribute to 15% of daily retail exchange volumes
              in India. Central to our philosophies are: not advertising,
              spamming, pushing, or inducing customers to take actions that are
              not in their interest.
            </p>
            <p>
              As a for-profit company, we have no external investor pressure,
              thanks to us being bootstrapped and profitable from our early
              days. Inside EquityIQ, employees do not have perverse incentives as
              we do not impose any metric-based growth targets; be it accounts
              opened, app install counts, orders placed, or revenue generated.
              Our drive, thus has been an unwavering focus on depth and quality.
              From an unknown upstart in 2010 to serving crores of customers,
              word-of-mouth referrals are what have driven our growth.
            </p>
          </div>
        </div>
        <div className="border-t my-20"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center">
            <img src={img2} alt="Practices" className="max-w-sm w-full" />
          </div>
          <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Practices</h1>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">No invasive app permissions</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our mobile apps only seek permissions that are necessary for their
              functioning. There is no direct or indirect tracking or profiling
              of customer behaviour in any form.
            </p>
          </div>
        </div>
        <div className="mt-16 text-center text-sm text-gray-600">
          <p className="mb-3">Want to check what permissions your apps have?</p>
          <div className="flex justify-center gap-6">
          <a href="https://guidebooks.google.com/android/changesettingspermissions/changeyourapppermissions"               className="text-blue-600 hover:underline"
              target="_blank"
              rel="noreferrer">
            Android →
          </a>
          <a href="https://support.apple.com/en-in/guide/iphone/iph251e92810/ios" className="text-blue-600 hover:underline"
              target="_blank"
              rel="noreferrer">
            iOS →
          </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
