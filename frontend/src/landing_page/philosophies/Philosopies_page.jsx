import React from "react";
import img27 from "../../assets/img27.svg";
import img28 from "../../assets/img28.svg";
import img29 from "../../assets/img29.svg";
import img12 from "../../assets/img12.avif";
import img30 from "../../assets/img30.svg";
import ButSection from "./but.jsx";
import Hero from "./hero.jsx";
import Permission from "./permission.jsx";
import Left_part from "./Left_part.jsx";
const items = [
  {
    img: img27,
    title: "No third party trackers",
    desc: "We don’t use third-party marketing 'pixels' or trackers that are usually used for behavioural tracking and profiling. On our websites, we use on-premise self-hosted tools for basic anonymised statistics. We don’t follow our customers around the internet via third-party trackers.",
  },
  {
    img: img28,
    title: "No annoying user 'engagement' spam",
    desc: "We do not subject our customers to incessant push notifications, UI dark patterns, and gimmicks designed to 'engage' them. In fact, we fundamentally do not believe in the idea of user \"engagement\" and instead practice what we call user-disengagement. Apart from important operational and regulatory announcements, we have a rule of thumb of sending a maximum of 4 push notifications a month for product and business updates.",
  },
  {
    img: img29,
    title: "No unnecessary cross-selling",
    desc: "We don't cross-sell personal loans, aggressively push leveraged products, or hawk unrelated financial or other offerings that are not meaningful to customers' trading and investing experience. We are not in the business of monetizing user attention.",
  },
  {
    img: img12,
    title: "No gate-keeping",
    desc: "Academy is one of the largest open financial courseware in the world today. Since its launch in 2026, it has been freely accessible and open to all. Be it RupeeTales books, or Academy Junior animated series for children, or the classic Innerworth newsletters, all our high-quality, free, educational material has been easily accessible. No forced sign-up, no dark patterns, and no push to open a EquityIQ account.",
  },
  {
    img: img30,
    title: "Transparency",
    desc: "When we first introduced our brokerage calculator in 2011, it was a radical step in price transparency in an otherwise opaque industry. Today, it is a standard offering. From that, to the first mainstream commission-free direct mutual platform in 2017, to full public disclosure of the regulatory filings on technical glitches, we have always had transparency at the heart of the business.",
  },
];
const Philosopies = () => {
  return (
    <>
      <Hero />
      <Permission />
      {
        items.map((item) => (<Left_part key={item.title} image={item.img} title={item.title} description={item.desc} />))
      }
      <ButSection />
    </>
  );
};

export default Philosopies;
