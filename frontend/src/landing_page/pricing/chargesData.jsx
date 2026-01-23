export const chargesData = {
  equity: {
    headers: ["", "Equity delivery", "Equity intraday", "F&O - Futures", "F&O - Options"],
    rows: [
      ["Brokerage", "Zero Brokerage", "0.03% or ₹20", "0.03% or ₹20", "Flat ₹20"],
      ["STT/CTT", "0.1% buy & sell", "0.025% sell side", "0.02% sell side", "0.125% (exercised) / 0.1% sell"],
      ["Transaction charges", "NSE: 0.00297%", "NSE: 0.00297%", "NSE: 0.00173%", "NSE: 0.03503%"],
      ["GST", "18%", "18%", "18%", "18%"],
      ["SEBI charges", "₹10 / crore", "₹10 / crore", "₹10 / crore", "₹10 / crore"],
      ["Stamp charges", "0.015% / ₹1500", "0.003% / ₹300", "0.002% / ₹200", "0.003% / ₹300"],
    ],
  },

  currency: {
    headers: ["", "Currency futures", "Currency options"],
    rows: [
      ["Brokerage", "0.03% or ₹20", "₹20"],
      ["STT/CTT", "No STT", "No STT"],
      ["Transaction charges", "NSE: 0.00035%", "NSE: 0.0311%"],
      ["GST", "18%", "18%"],
      ["SEBI charges", "₹10 / crore", "₹10 / crore"],
      ["Stamp charges", "0.0001% / ₹10", "0.0001% / ₹10"],
    ],
  },

  commodity: {
    headers: ["", "Commodity futures", "Commodity options"],
    rows: [
      ["Brokerage", "0.03% or ₹20", "₹20"],
      ["STT/CTT", "0.01% sell (Non-agri)", "0.05% sell"],
      ["Transaction charges", "MCX: 0.0021%", "MCX: 0.0418%"],
      ["GST", "18%", "18%"],
      ["SEBI charges", "₹1 / crore (Agri)", "₹10 / crore"],
      ["Stamp charges", "0.002% / ₹200", "0.003% / ₹300"],
    ],
  },
};
