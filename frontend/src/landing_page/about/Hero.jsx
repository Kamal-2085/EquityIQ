import React from "react";

const Hero = () => {
  return (
    <section className="bg-white py-30">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-12 mt-10">
          We pioneered the discount broking model in India. Now, we are breaking
          ground with our technology.
        </h1>
        <div className="border-b mb-12"></div>
        <div>
          <p>
            EquityIQ was founded with a simple goal — to make market
            intelligence accessible, transparent, and actionable for everyone.
            We believe investors should be guided by data, not noise.
            <br />
            <br />
            Our platform combines clean design, reliable data, and powerful
            analytics to help users make confident financial decisions across
            stocks, indices, and broader market trends.
            <br />
            <br />
            Today, EquityIQ is growing into a trusted companion for learners,
            long-term investors, and market enthusiasts who want insight without
            complexity.
          </p>
          <p>
            Beyond analytics, EquityIQ is committed to financial education and
            community learning. We actively build tools and content that help
            users understand markets better — not just track prices.
            <br />
            <br />
            Our ongoing research and experimentation focus on improving how
            market data is visualized and interpreted, enabling smarter and more
            disciplined investing.
            <br />
            <br />
            Follow our updates on the{" "}
            <span className="text-blue-600 cursor-pointer hover:underline">
              EquityIQ blog
            </span>{" "}
            or explore our product{" "}
            <span className="text-blue-600 cursor-pointer hover:underline">
              features
            </span>{" "}
            to learn how we’re shaping the future of market intelligence.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
