import { useState } from "react";
import img39 from "../assets/img39.svg";
import img40 from "../assets/img40.svg";
import img41 from "../assets/img41.svg";
import img42 from "../assets/img42.svg";
import img43 from "../assets/img43.svg";
import img44 from "../assets/img44.svg";
import img45 from "../assets/img45.svg";

const brokerages = [
  {
    name: "Brokerage Calculator",
    img: img39,
  },
  {
    name: "F&O Margin",
    img: img40,
  },
  {
    name: "Equity futures",
    img: img41,
  },
  {
    name: "Equity margin",
    img: img42,
  },
  {
    name: "Currency margin",
    img: img43,
  },
  {
    name: "Currency derivatives margin",
    img: img44,
  },
  {
    name: "Black & Scholes",
    img: img45,
  },
];

const BrokerageOptions = () => {
  const [active, setActive] = useState(null);
  const [inputs, setInputs] = useState({
    "Brokerage Calculator": {
      buyPrice: 100,
      sellPrice: 110,
      quantity: 100,
      brokerageRate: 0.03,
      exchangeFee: 0.003,
      gst: 18,
    },
    "F&O Margin": { price: 20000, lotSize: 50, marginPercent: 12 },
    "Equity futures": { price: 1500, lotSize: 500, marginPercent: 15 },
    "Equity margin": { investment: 100000, leverage: 5 },
    "Currency margin": { price: 83.5, lotSize: 1000, marginPercent: 4 },
    "Currency derivatives margin": {
      price: 83.5,
      lotSize: 1000,
      marginPercent: 5,
    },
    "Black & Scholes": {
      spot: 100,
      strike: 100,
      rate: 6,
      volatility: 20,
      years: 1,
      optionType: "call",
    },
  });

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value || 0);

  const updateInput = (name, field, value) => {
    setInputs((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        [field]: value,
      },
    }));
  };

  const normalCdf = (x) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d =
      0.3989423 *
      Math.exp((-x * x) / 2) *
      (((((1.330274 * t - 1.821256) * t + 1.781478) * t - 0.356538) * t +
        0.3193815) *
        t);
    const prob = x >= 0 ? 1 - d : d;
    return prob;
  };

  const renderCalculator = (item) => {
    const values = inputs[item.name];
    if (!values) return null;

    if (item.name === "Brokerage Calculator") {
      const buyPrice = Number(values.buyPrice) || 0;
      const sellPrice = Number(values.sellPrice) || 0;
      const quantity = Number(values.quantity) || 0;
      const brokerageRate = Number(values.brokerageRate) || 0;
      const exchangeFee = Number(values.exchangeFee) || 0;
      const gst = Number(values.gst) || 0;
      const turnover = (buyPrice + sellPrice) * quantity;
      const brokerage = (turnover * brokerageRate) / 100;
      const exchangeCharges = (turnover * exchangeFee) / 100;
      const gstOnFees = ((brokerage + exchangeCharges) * gst) / 100;
      const totalCharges = brokerage + exchangeCharges + gstOnFees;
      const grossProfit = (sellPrice - buyPrice) * quantity;
      const netProfit = grossProfit - totalCharges;

      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="text-xs text-gray-600">
              Buy price
              <input
                type="number"
                value={values.buyPrice}
                onChange={(e) =>
                  updateInput(item.name, "buyPrice", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Sell price
              <input
                type="number"
                value={values.sellPrice}
                onChange={(e) =>
                  updateInput(item.name, "sellPrice", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Quantity
              <input
                type="number"
                value={values.quantity}
                onChange={(e) =>
                  updateInput(item.name, "quantity", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="text-xs text-gray-600">
              Brokerage (% of turnover)
              <input
                type="number"
                value={values.brokerageRate}
                onChange={(e) =>
                  updateInput(item.name, "brokerageRate", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Exchange fee (% of turnover)
              <input
                type="number"
                value={values.exchangeFee}
                onChange={(e) =>
                  updateInput(item.name, "exchangeFee", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              GST (%)
              <input
                type="number"
                value={values.gst}
                onChange={(e) => updateInput(item.name, "gst", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <p className="text-gray-700">
              Charges: {formatCurrency(totalCharges)}
            </p>
            <p className="text-gray-700">
              Net P&L: {formatCurrency(netProfit)}
            </p>
          </div>
        </div>
      );
    }

    if (
      item.name === "F&O Margin" ||
      item.name === "Equity futures" ||
      item.name === "Currency margin" ||
      item.name === "Currency derivatives margin"
    ) {
      const price = Number(values.price) || 0;
      const lotSize = Number(values.lotSize) || 0;
      const marginPercent = Number(values.marginPercent) || 0;
      const contractValue = price * lotSize;
      const marginRequired = (contractValue * marginPercent) / 100;

      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="text-xs text-gray-600">
              Price
              <input
                type="number"
                value={values.price}
                onChange={(e) =>
                  updateInput(item.name, "price", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Lot size
              <input
                type="number"
                value={values.lotSize}
                onChange={(e) =>
                  updateInput(item.name, "lotSize", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Margin required (%)
              <input
                type="number"
                value={values.marginPercent}
                onChange={(e) =>
                  updateInput(item.name, "marginPercent", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <p className="text-gray-700">
              Contract value: {formatCurrency(contractValue)}
            </p>
            <p className="text-gray-700">
              Margin required: {formatCurrency(marginRequired)}
            </p>
          </div>
        </div>
      );
    }

    if (item.name === "Equity margin") {
      const investment = Number(values.investment) || 0;
      const leverage = Number(values.leverage) || 1;
      const exposure = investment * leverage;
      const marginRequired = leverage === 0 ? 0 : investment;

      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="text-xs text-gray-600">
              Capital available
              <input
                type="number"
                value={values.investment}
                onChange={(e) =>
                  updateInput(item.name, "investment", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Leverage (x)
              <input
                type="number"
                value={values.leverage}
                onChange={(e) =>
                  updateInput(item.name, "leverage", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <p className="text-gray-700">
              Exposure: {formatCurrency(exposure)}
            </p>
            <p className="text-gray-700">
              Capital used: {formatCurrency(marginRequired)}
            </p>
          </div>
        </div>
      );
    }

    if (item.name === "Black & Scholes") {
      const spot = Number(values.spot) || 0;
      const strike = Number(values.strike) || 0;
      const rate = Number(values.rate) || 0;
      const volatility = Number(values.volatility) || 0;
      const years = Number(values.years) || 0;
      const optionType = values.optionType || "call";

      const sigma = volatility / 100;
      const r = rate / 100;
      const d1 =
        sigma === 0 || years === 0
          ? 0
          : (Math.log(spot / strike) + (r + (sigma * sigma) / 2) * years) /
            (sigma * Math.sqrt(years));
      const d2 = d1 - sigma * Math.sqrt(years);

      const callPrice =
        spot * normalCdf(d1) - strike * Math.exp(-r * years) * normalCdf(d2);
      const putPrice =
        strike * Math.exp(-r * years) * normalCdf(-d2) - spot * normalCdf(-d1);

      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="text-xs text-gray-600">
              Spot price
              <input
                type="number"
                value={values.spot}
                onChange={(e) => updateInput(item.name, "spot", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Strike price
              <input
                type="number"
                value={values.strike}
                onChange={(e) =>
                  updateInput(item.name, "strike", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Risk-free rate (% p.a.)
              <input
                type="number"
                value={values.rate}
                onChange={(e) => updateInput(item.name, "rate", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="text-xs text-gray-600">
              Volatility (% p.a.)
              <input
                type="number"
                value={values.volatility}
                onChange={(e) =>
                  updateInput(item.name, "volatility", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Time to expiry (years)
              <input
                type="number"
                value={values.years}
                onChange={(e) =>
                  updateInput(item.name, "years", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Option type
              <select
                value={values.optionType}
                onChange={(e) =>
                  updateInput(item.name, "optionType", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              >
                <option value="call">Call</option>
                <option value="put">Put</option>
              </select>
            </label>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <p className="text-gray-700">
              Call price: {formatCurrency(callPrice)}
            </p>
            <p className="text-gray-700">
              Put price: {formatCurrency(putPrice)}
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-10 relative mt-25 mb-58">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 mb-5">
          Brokerage & Margin
        </h2>
      </div>

      {/* 👇 Overlay (click outside to close) */}
      {active && (
        <div className="fixed inset-0 z-10" onClick={() => setActive(null)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">
        {brokerages.map((item) => (
          <div key={item.name} className="relative">
            {/* Button */}
            <button
              onClick={() => setActive(active === item ? null : item)}
              className="w-full flex items-center gap-4 rounded-md border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition hover:bg-gray-50 cursor-pointer"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50">
                <img src={item.img} alt={item.name} className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium text-gray-900">
                {item.name}
              </span>
            </button>

            {/* Popup */}
            {active === item && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg p-4 text-sm z-10"
              >
                <h4 className="font-semibold mb-2">{item.name}</h4>
                {renderCalculator(item)}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrokerageOptions;
