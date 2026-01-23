import React from "react";
import Hero from "./Hero.jsx";
import img17 from "../../assets/img17.png";
import img18 from "../../assets/img18.png";
import img19 from "../../assets/img19.png";
import img20 from "../../assets/img20.png";
import img21 from "../../assets/img21.png";
import Left_part from "./Left_part.jsx";
import Universe from "./Universe.jsx";
const items = [
  {
    image: img17,
    title: "Pluse",
    description: "Our ultra-fast flagship trading platform with streaming market data, advanced charts, an elegant UI, and more. Enjoy the Kite experience seamlessly on your Android and iOS devices.",
    link: "Learn more →",
  },
  {
    image: img18,
    title: "Dashboard",
    description: "The central dashboard for your Zerodha account. Gain insights into your trades and investments with in-depth reports and visualisations.",
    link: "Learn more →",
  },
  {
    image: img19,
    title: "WealthIQ",
    description: "Buy direct mutual funds online, commission-free, delivered directly to your Demat account. Enjoy the investment experience on your Android and iOS devices.",
    link: "Learn more →",
  },
  {
    image: img20,
    title: "EquityIQ Connect",
    description: "EquityIQ Connect – Developer APIs for market data, paper trading, and strategy research,but currently focused on developer experimentation.",
    link: "Learn more →",
  },
  {
    image: img21,
    title: "Academy",
    description: "An easy to grasp, collection of stock market lessons with in-depth coverage and illustrations. Content is broken down into bite-size cards to help you learn on the go.",
    link: "Learn more →",
  },
];
const Products_page = () => {
  return (
    <>
      <Hero />
      {items.map((item) => (
        <Left_part
          key={item.title}
          image={item.image}
          title={item.title}
          description={item.description}
          link={item.link}
        />
      ))}
      <Universe />
    </>
  );
};

export default Products_page;
