import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../public/img3.png";

const Header = () => {
  const [balance, setBalance] = useState(0);

  // 🔧 helper to normalize any balance value
  const normalizeBalance = (value) => {
    const cleaned = String(value ?? "").replace(/[^0-9.-]/g, "");
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : 0;
  };

  useEffect(() => {
    const readBalance = () => {
      try {
        const raw = localStorage.getItem("equityiq_user");
        if (!raw) return setBalance(0);

        const parsed = JSON.parse(raw);
        const val = parsed?.user?.accountBalance ?? parsed?.accountBalance ?? 0;

        setBalance(normalizeBalance(val));
      } catch {
        setBalance(0);
      }
    };

    readBalance();
    const handler = () => readBalance();
    window.addEventListener("equityiq_user_updated", handler);
    return () => window.removeEventListener("equityiq_user_updated", handler);
  }, []);

  return (
    <section className="w-full border-b border-gray-200 bg-white py-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        {/* Left */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-gray-900">
            All Transactions
          </h1>
          <h2 className="mt-1 text-sm text-gray-500">
            Balance: ₹{normalizeBalance(balance).toLocaleString("en-IN")}
          </h2>
        </div>

        {/* Center */}
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 text-center">
          Transactions History
        </h1>

        {/* Right */}
        <button
          onClick={async () => {
            try {
              const raw = localStorage.getItem("equityiq_user");
              if (!raw) throw new Error("No user data available");

              const parsed = JSON.parse(raw);
              const user = parsed.user || {};
              const txns = user.transactionHistory || [];

              const doc = new jsPDF();

              // Load logo safely
              const loadImageAsJpeg = (src) =>
                new Promise((resolve, reject) => {
                  const img = new Image();
                  img.crossOrigin = "anonymous";
                  img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    canvas.getContext("2d").drawImage(img, 0, 0);
                    resolve(canvas.toDataURL("image/jpeg", 1.0));
                  };
                  img.onerror = reject;
                  img.src = src;
                });

              let imgData = null;
              try {
                imgData = await loadImageAsJpeg(logo);
              } catch {}

              // Header
              doc.setFontSize(14);
              doc.text("EquityIQ - Account Statement", 14, 20);

              if (imgData) {
                const imgWidth = 36;
                const x = doc.internal.pageSize.getWidth() - imgWidth - 14;
                doc.addImage(imgData, "JPEG", x, 6, imgWidth, 36);
              }

              doc.setFontSize(10);
              doc.text(`Name: ${user.name || "-"}`, 14, 28);
              doc.text(`Email: ${user.email || "-"}`, 14, 34);

              const mobile =
                user.phone || user.mobile || user.mobileNumber || "-";
              doc.text(`Mobile: ${mobile}`, 14, 40);

              // Bank info
              const mask = (acc) =>
                acc ? `XXXX${acc.toString().slice(-4)}` : "-";

              const bankLine =
                user.bankAccount?.bankName && user.bankAccount?.accountNumber
                  ? `${user.bankAccount.bankName} (${mask(
                      user.bankAccount.accountNumber,
                    )})`
                  : "-";

              doc.text(`Bank: ${bankLine}`, 14, 46);

              // ✅ FIXED BALANCE (jsPDF-safe)
              const printableBal = normalizeBalance(user.accountBalance);

              doc.text(
                `Balance: Rs. ${printableBal.toLocaleString("en-IN")}`,
                14,
                54,
              );

              // Table
              const rows = txns.map((t) => [
                t.date ? new Date(t.date).toLocaleString() : "",
                t.txnType || "-",
                t.txnId || "-",
                normalizeBalance(t.amount).toLocaleString("en-IN"),
              ]);

              autoTable(doc, {
                startY: 68,
                head: [["Date", "Type", "Transaction ID", "Amount"]],
                body: rows,
                styles: { fontSize: 9 },
                headStyles: { fillColor: [22, 163, 74] },
              });

              // add footer text at bottom of last page
              try {
                const pageCount = doc.internal.getNumberOfPages();
                const footerText =
                  "This is a system-generated statement from EquityIQ. For any discrepancies, contact support.";
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                doc.setFontSize(9);
                doc.setTextColor(100);
                doc.setPage(pageCount);
                const footerY = pageHeight - 12;
                doc.text(footerText, pageWidth / 2, footerY, {
                  align: "center",
                });
              } catch (err) {
                console.warn("Failed to add PDF footer:", err);
              }

              doc.save(`equityiq-statement-${Date.now()}.pdf`);
            } catch (e) {
              console.error(e);
              alert("Failed to generate statement");
            }
          }}
          className="flex items-center gap-2 rounded-md border border-green-300 bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-50 hover:text-green-900 transition"
        >
          <FiDownload />
          Download Statement
        </button>
      </div>
    </section>
  );
};

export default Header;
