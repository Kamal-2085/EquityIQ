import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../src/config/db.js";
import Stock from "../src/models/Stock.model.js";

const nifty50Stocks = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    exchange: ["NSE", "BSE"],
    domain: "ril.com",
    isNifty50: true,
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services (TCS)",
    exchange: ["NSE", "BSE"],
    domain: "tcs.com",
    isNifty50: true,
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    exchange: ["NSE", "BSE"],
    domain: "hdfcbank.com",
    isNifty50: true,
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd",
    exchange: ["NSE", "BSE"],
    domain: "icicibank.com",
    isNifty50: true,
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    exchange: ["NSE", "BSE"],
    domain: "infosys.com",
    isNifty50: true,
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    exchange: ["NSE", "BSE"],
    domain: "sbi.co.in",
    isNifty50: true,
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Ltd",
    exchange: ["NSE", "BSE"],
    domain: "airtel.in",
    isNifty50: true,
  },
  {
    symbol: "ITC",
    name: "ITC Ltd",
    exchange: ["NSE", "BSE"],
    domain: "itcportal.com",
    isNifty50: true,
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro Ltd",
    exchange: ["NSE", "BSE"],
    domain: "larsentoubro.com",
    isNifty50: true,
  },
  {
    symbol: "AXISBANK",
    name: "Axis Bank Ltd",
    exchange: ["NSE", "BSE"],
    domain: "axisbank.com",
    isNifty50: true,
  },
  {
    symbol: "KOTAKBANK",
    name: "Kotak Mahindra Bank Ltd",
    exchange: ["NSE", "BSE"],
    domain: "kotak.com",
    isNifty50: true,
  },
  {
    symbol: "HINDUNILVR",
    name: "Hindustan Unilever Ltd",
    exchange: ["NSE", "BSE"],
    domain: "hindustanunilever.com",
    isNifty50: true,
  },
  {
    symbol: "BAJFINANCE",
    name: "Bajaj Finance Ltd",
    exchange: ["NSE", "BSE"],
    domain: "bajajfinserv.in",
    isNifty50: true,
  },
  {
    symbol: "BAJAJFINSV",
    name: "Bajaj Finserv Ltd",
    exchange: ["NSE", "BSE"],
    domain: "bajajfinserv.in",
    isNifty50: true,
  },
  {
    symbol: "HCLTECH",
    name: "HCL Technologies Ltd",
    exchange: ["NSE", "BSE"],
    domain: "hcltech.com",
    isNifty50: true,
  },
  {
    symbol: "SUNPHARMA",
    name: "Sun Pharmaceutical Industries Ltd",
    exchange: ["NSE", "BSE"],
    domain: "sunpharma.com",
    isNifty50: true,
  },
  {
    symbol: "NTPC",
    name: "NTPC Ltd",
    exchange: ["NSE", "BSE"],
    domain: "ntpc.co.in",
    isNifty50: true,
  },
  {
    symbol: "M&M",
    name: "Mahindra & Mahindra Ltd",
    exchange: ["NSE", "BSE"],
    domain: "mahindra.com",
    isNifty50: true,
  },
  {
    symbol: "MARUTI",
    name: "Maruti Suzuki India Ltd",
    exchange: ["NSE", "BSE"],
    domain: "marutisuzuki.com",
    isNifty50: true,
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors Ltd",
    exchange: ["NSE", "BSE"],
    domain: "tatamotors.com",
    isNifty50: true,
  },
  {
    symbol: "POWERGRID",
    name: "Power Grid Corporation of India Ltd",
    exchange: ["NSE", "BSE"],
    domain: "powergridindia.com",
    isNifty50: true,
  },
  {
    symbol: "ULTRACEMCO",
    name: "UltraTech Cement Ltd",
    exchange: ["NSE", "BSE"],
    domain: "ultratechcement.com",
    isNifty50: true,
  },
  {
    symbol: "ASIANPAINT",
    name: "Asian Paints Ltd",
    exchange: ["NSE", "BSE"],
    domain: "asianpaints.com",
    isNifty50: true,
  },
  {
    symbol: "NESTLEIND",
    name: "Nestlé India Ltd",
    exchange: ["NSE", "BSE"],
    domain: "nestle.in",
    isNifty50: true,
  },
  {
    symbol: "ADANIENT",
    name: "Adani Enterprises Ltd",
    exchange: ["NSE", "BSE"],
    domain: "adanient.com",
    isNifty50: true,
  },
  {
    symbol: "ADANIPORTS",
    name: "Adani Ports & SEZ Ltd",
    exchange: ["NSE", "BSE"],
    domain: "adaniports.com",
    isNifty50: true,
  },
  {
    symbol: "COALINDIA",
    name: "Coal India Ltd",
    exchange: ["NSE", "BSE"],
    domain: "coalindia.in",
    isNifty50: true,
  },
  {
    symbol: "ONGC",
    name: "ONGC Ltd",
    exchange: ["NSE", "BSE"],
    domain: "ongcindia.com",
    isNifty50: true,
  },
  {
    symbol: "JSWSTEEL",
    name: "JSW Steel Ltd",
    exchange: ["NSE", "BSE"],
    domain: "jswsteel.in",
    isNifty50: true,
  },
  {
    symbol: "TATASTEEL",
    name: "Tata Steel Ltd",
    exchange: ["NSE", "BSE"],
    domain: "tatasteel.com",
    isNifty50: true,
  },
  {
    symbol: "GRASIM",
    name: "Grasim Industries Ltd",
    exchange: ["NSE", "BSE"],
    domain: "grasim.com",
    isNifty50: true,
  },
  {
    symbol: "TITAN",
    name: "Titan Company Ltd",
    exchange: ["NSE", "BSE"],
    domain: "titan.co.in",
    isNifty50: true,
  },
  {
    symbol: "TECHM",
    name: "Tech Mahindra Ltd",
    exchange: ["NSE", "BSE"],
    domain: "techmahindra.com",
    isNifty50: true,
  },
  {
    symbol: "WIPRO",
    name: "Wipro Ltd",
    exchange: ["NSE", "BSE"],
    domain: "wipro.com",
    isNifty50: true,
  },
  {
    symbol: "INDUSINDBK",
    name: "IndusInd Bank Ltd",
    exchange: ["NSE", "BSE"],
    domain: "indusind.com",
    isNifty50: true,
  },
  {
    symbol: "SBILIFE",
    name: "SBI Life Insurance Company Ltd",
    exchange: ["NSE", "BSE"],
    domain: "sbilife.co.in",
    isNifty50: true,
  },
  {
    symbol: "HDFCLIFE",
    name: "HDFC Life Insurance Company Ltd",
    exchange: ["NSE", "BSE"],
    domain: "hdfclife.com",
    isNifty50: true,
  },
  {
    symbol: "APOLLOHOSP",
    name: "Apollo Hospitals Enterprise Ltd",
    exchange: ["NSE", "BSE"],
    domain: "apollohospitals.com",
    isNifty50: true,
  },
  {
    symbol: "DIVISLAB",
    name: "Divi’s Laboratories Ltd",
    exchange: ["NSE", "BSE"],
    domain: "divis.com",
    isNifty50: true,
  },
  {
    symbol: "DRREDDY",
    name: "Dr. Reddy’s Laboratories Ltd",
    exchange: ["NSE", "BSE"],
    domain: "drreddys.com",
    isNifty50: true,
  },
  {
    symbol: "CIPLA",
    name: "Cipla Ltd",
    exchange: ["NSE", "BSE"],
    domain: "cipla.com",
    isNifty50: true,
  },
  {
    symbol: "BRITANNIA",
    name: "Britannia Industries Ltd",
    exchange: ["NSE", "BSE"],
    domain: "britannia.co.in",
    isNifty50: true,
  },
  {
    symbol: "TATACONSUM",
    name: "Tata Consumer Products Ltd",
    exchange: ["NSE", "BSE"],
    domain: "tataconsumer.com",
    isNifty50: true,
  },
  {
    symbol: "EICHERMOT",
    name: "Eicher Motors Ltd",
    exchange: ["NSE", "BSE"],
    domain: "eichermotors.com",
    isNifty50: true,
  },
  {
    symbol: "BAJAJ-AUTO",
    name: "Bajaj Auto Ltd",
    exchange: ["NSE", "BSE"],
    domain: "bajajauto.com",
    isNifty50: true,
  },
  {
    symbol: "HEROMOTOCO",
    name: "Hero MotoCorp Ltd",
    exchange: ["NSE", "BSE"],
    domain: "heromotocorp.com",
    isNifty50: true,
  },
  {
    symbol: "UPL",
    name: "UPL Ltd",
    exchange: ["NSE", "BSE"],
    domain: "upl-ltd.com",
    isNifty50: true,
  },
  {
    symbol: "LTIM",
    name: "LTIMindtree Ltd",
    exchange: ["NSE", "BSE"],
    domain: "ltimindtree.com",
    isNifty50: true,
  },
  {
    symbol: "SHRIRAMFIN",
    name: "Shriram Finance Ltd",
    exchange: ["NSE", "BSE"],
    domain: "shriramfinance.in",
    isNifty50: true,
  },
  {
    symbol: "HDFCAMC",
    name: "HDFC Asset Management Company Ltd",
    exchange: ["NSE", "BSE"],
    domain: "hdfcassetmanagement.com",
    isNifty50: true,
  },
];

const run = async () => {
  await connectDB();

  const ops = nifty50Stocks.map((stock) => ({
    updateOne: {
      filter: { symbol: stock.symbol },
      update: { $set: stock },
      upsert: true,
    },
  }));

  if (ops.length) {
    await Stock.bulkWrite(ops, { ordered: false });
  }

  console.log(`Seeded ${ops.length} NIFTY 50 stocks`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
