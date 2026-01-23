import { useState } from "react";
import img31 from "../assets/img31.svg";
import img32 from "../assets/img32.svg";
import img33 from "../assets/img33.svg";
import img34 from "../assets/img34.svg";
import img35 from "../assets/img35.svg";
import img36 from "../assets/img36.svg";
import img37 from "../assets/img37.svg";
import img38 from "../assets/img38.svg";
const investments = [
  {
    name: "SIP",
    img: img31,
  },
  {
    name: "Step up SIP",
    img: img32,
  },
  {
    name: "EMI",
    img: img33,
  },
  {
    name: "MTF",
    img: img34,
  },
  {
    name: "SWP",
    img: img35,
  },
  {
    name: "STP",
    img: img36,
  },
  {
    name: "Retirement",
    img: img37,
  },
  {
    name: "National Pension Scheme (NPS)",
    img: img38,
  },
];

const InvestmentOptions = () => {
  const [active, setActive] = useState(null);
  const [inputs, setInputs] = useState({
    SIP: { monthly: 5000, rate: 12, years: 10 },
    "Step up SIP": { monthly: 5000, stepUp: 10, rate: 12, years: 10 },
    EMI: { principal: 500000, rate: 9, years: 5 },
    MTF: { borrowed: 100000, rate: 12, days: 30 },
    SWP: { corpus: 1000000, withdrawal: 10000, rate: 8, years: 10 },
    STP: {
      source: 500000,
      transfer: 10000,
      sourceRate: 6,
      targetRate: 10,
      months: 36,
    },
    Retirement: { monthly: 15000, rate: 10, years: 20 },
    "National Pension Scheme (NPS)": { monthly: 5000, rate: 10, years: 20 },
  });

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
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

  const renderCalculator = (item) => {
    const values = inputs[item.name];
    if (!values) return null;

    if (item.name === "SIP") {
      const monthly = Number(values.monthly) || 0;
      const rate = Number(values.rate) || 0;
      const years = Number(values.years) || 0;
      const months = years * 12;
      const r = rate / 100 / 12;
      const invested = monthly * months;
      const futureValue =
        r === 0 ? invested : monthly * (((1 + r) ** months - 1) / r) * (1 + r);
      const gain = futureValue - invested;

      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="text-xs text-gray-600">
              Monthly investment
              <input
                type="number"
                value={values.monthly}
                onChange={(e) =>
                  updateInput(item.name, "monthly", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Expected return (% p.a.)
              <input
                type="number"
                value={values.rate}
                onChange={(e) => updateInput(item.name, "rate", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Tenure (years)
              <input
                type="number"
                value={values.years}
                onChange={(e) =>
                  updateInput(item.name, "years", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <p className="text-gray-700">
              Invested: {formatCurrency(invested)}
            </p>
            <p className="text-gray-700">
              Est. value: {formatCurrency(futureValue)}
            </p>
            <p className="text-gray-700">Gain: {formatCurrency(gain)}</p>
          </div>
        </div>
      );
    }

    if (item.name === "Step up SIP") {
      const monthlyBase = Number(values.monthly) || 0;
      const stepUp = Number(values.stepUp) || 0;
      const rate = Number(values.rate) || 0;
      const years = Number(values.years) || 0;
      const months = years * 12;
      const r = rate / 100 / 12;
      let monthly = monthlyBase;
      let invested = 0;
      let futureValue = 0;

      for (let m = 1; m <= months; m += 1) {
        invested += monthly;
        futureValue = (futureValue + monthly) * (1 + r);
        if (m % 12 === 0) {
          monthly *= 1 + stepUp / 100;
        }
      }

      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <label className="text-xs text-gray-600">
              Starting monthly
              <input
                type="number"
                value={values.monthly}
                onChange={(e) =>
                  updateInput(item.name, "monthly", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Step-up (% yearly)
              <input
                type="number"
                value={values.stepUp}
                onChange={(e) =>
                  updateInput(item.name, "stepUp", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Expected return (% p.a.)
              <input
                type="number"
                value={values.rate}
                onChange={(e) => updateInput(item.name, "rate", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Tenure (years)
              <input
                type="number"
                value={values.years}
                onChange={(e) =>
                  updateInput(item.name, "years", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <p className="text-gray-700">
              Invested: {formatCurrency(invested)}
            </p>
            <p className="text-gray-700">
              Est. value: {formatCurrency(futureValue)}
            </p>
          </div>
        </div>
      );
    }

    if (item.name === "EMI") {
      const principal = Number(values.principal) || 0;
      const rate = Number(values.rate) || 0;
      const years = Number(values.years) || 0;
      const months = years * 12;
      const r = rate / 100 / 12;
      const emi =
        r === 0
          ? principal / (months || 1)
          : (principal * r * (1 + r) ** months) / ((1 + r) ** months - 1);
      const totalPayment = emi * months;
      const interest = totalPayment - principal;

      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="text-xs text-gray-600">
              Loan amount
              <input
                type="number"
                value={values.principal}
                onChange={(e) =>
                  updateInput(item.name, "principal", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Interest (% p.a.)
              <input
                type="number"
                value={values.rate}
                onChange={(e) => updateInput(item.name, "rate", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Tenure (years)
              <input
                type="number"
                value={values.years}
                onChange={(e) =>
                  updateInput(item.name, "years", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <p className="text-gray-700">EMI: {formatCurrency(emi)}</p>
            <p className="text-gray-700">
              Total interest: {formatCurrency(interest)}
            </p>
          </div>
        </div>
      );
    }

    if (item.name === "MTF") {
      const borrowed = Number(values.borrowed) || 0;
      const rate = Number(values.rate) || 0;
      const days = Number(values.days) || 0;
      const interest = borrowed * (rate / 100) * (days / 365);

      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="text-xs text-gray-600">
              Borrowed amount
              <input
                type="number"
                value={values.borrowed}
                onChange={(e) =>
                  updateInput(item.name, "borrowed", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Interest (% p.a.)
              <input
                type="number"
                value={values.rate}
                onChange={(e) => updateInput(item.name, "rate", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Days held
              <input
                type="number"
                value={values.days}
                onChange={(e) => updateInput(item.name, "days", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <p className="text-gray-700">
              Interest cost: {formatCurrency(interest)}
            </p>
          </div>
        </div>
      );
    }

    if (item.name === "SWP") {
      const corpus = Number(values.corpus) || 0;
      const withdrawal = Number(values.withdrawal) || 0;
      const rate = Number(values.rate) || 0;
      const years = Number(values.years) || 0;
      const months = years * 12;
      const r = rate / 100 / 12;
      let balance = corpus;
      let withdrawn = 0;

      for (let m = 1; m <= months; m += 1) {
        balance *= 1 + r;
        const take = Math.min(withdrawal, balance);
        balance -= take;
        withdrawn += take;
        if (balance <= 0) break;
      }

      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <label className="text-xs text-gray-600">
              Initial corpus
              <input
                type="number"
                value={values.corpus}
                onChange={(e) =>
                  updateInput(item.name, "corpus", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Monthly withdrawal
              <input
                type="number"
                value={values.withdrawal}
                onChange={(e) =>
                  updateInput(item.name, "withdrawal", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Expected return (% p.a.)
              <input
                type="number"
                value={values.rate}
                onChange={(e) => updateInput(item.name, "rate", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Tenure (years)
              <input
                type="number"
                value={values.years}
                onChange={(e) =>
                  updateInput(item.name, "years", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <p className="text-gray-700">
              Total withdrawn: {formatCurrency(withdrawn)}
            </p>
            <p className="text-gray-700">
              Ending balance: {formatCurrency(balance)}
            </p>
          </div>
        </div>
      );
    }

    if (item.name === "STP") {
      const source = Number(values.source) || 0;
      const transfer = Number(values.transfer) || 0;
      const sourceRate = Number(values.sourceRate) || 0;
      const targetRate = Number(values.targetRate) || 0;
      const months = Number(values.months) || 0;
      const rs = sourceRate / 100 / 12;
      const rt = targetRate / 100 / 12;
      let sourceBal = source;
      let targetBal = 0;

      for (let m = 1; m <= months; m += 1) {
        sourceBal *= 1 + rs;
        const move = Math.min(transfer, sourceBal);
        sourceBal -= move;
        targetBal = (targetBal + move) * (1 + rt);
      }

      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <label className="text-xs text-gray-600">
              Source corpus
              <input
                type="number"
                value={values.source}
                onChange={(e) =>
                  updateInput(item.name, "source", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Monthly transfer
              <input
                type="number"
                value={values.transfer}
                onChange={(e) =>
                  updateInput(item.name, "transfer", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Source return (% p.a.)
              <input
                type="number"
                value={values.sourceRate}
                onChange={(e) =>
                  updateInput(item.name, "sourceRate", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Target return (% p.a.)
              <input
                type="number"
                value={values.targetRate}
                onChange={(e) =>
                  updateInput(item.name, "targetRate", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Months
              <input
                type="number"
                value={values.months}
                onChange={(e) =>
                  updateInput(item.name, "months", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <p className="text-gray-700">
              Source balance: {formatCurrency(sourceBal)}
            </p>
            <p className="text-gray-700">
              Target balance: {formatCurrency(targetBal)}
            </p>
          </div>
        </div>
      );
    }

    if (
      item.name === "Retirement" ||
      item.name === "National Pension Scheme (NPS)"
    ) {
      const monthly = Number(values.monthly) || 0;
      const rate = Number(values.rate) || 0;
      const years = Number(values.years) || 0;
      const months = years * 12;
      const r = rate / 100 / 12;
      const corpus =
        r === 0
          ? monthly * months
          : monthly * (((1 + r) ** months - 1) / r) * (1 + r);

      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="text-xs text-gray-600">
              Monthly contribution
              <input
                type="number"
                value={values.monthly}
                onChange={(e) =>
                  updateInput(item.name, "monthly", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Expected return (% p.a.)
              <input
                type="number"
                value={values.rate}
                onChange={(e) => updateInput(item.name, "rate", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Tenure (years)
              <input
                type="number"
                value={values.years}
                onChange={(e) =>
                  updateInput(item.name, "years", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <p className="text-gray-700">
              Estimated corpus: {formatCurrency(corpus)}
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-10 relative">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 mb-5">
          Investment
        </h2>
      </div>

      {/* 👇 Overlay (click outside to close) */}
      {active && (
        <div className="fixed inset-0 z-10" onClick={() => setActive(null)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">
        {investments.map((item) => (
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

export default InvestmentOptions;
