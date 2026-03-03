import React, { useEffect, useRef, useState } from "react";

const Message = ({ m }) => (
  <div
    className={`mb-3 max-w-[85%] ${
      m.role === "user" ? "ml-auto text-right" : ""
    }`}
  >
    <div
      className={`inline-block rounded-lg px-3 py-2 text-sm shadow-sm ${
        m.role === "user"
          ? "bg-green-600 text-white"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      {m.text}
    </div>
  </div>
);

const EquityAIChat = ({ companyName, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: `EquityAI ready to analyze ${companyName || "Company"}.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = () => {
    if (isAnalyzing) return;
    // start analyzing: clear messages and show spinner
    setIsAnalyzing(true);
    setMessages([]);

    // simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
      setMessages([
        {
          id: Date.now(),
          role: "ai",
          text: `EquityAI (mock): Quick insight on ${
            companyName || "Company"
          }: analysis complete.`,
        },
      ]);
    }, 1600);
  };

  return (
    <aside className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col flex-1">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src="/img3.png"
            alt="EquityAI"
            className="h-9 w-9 rounded-full border border-gray-200 object-contain bg-white"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">EquityAI</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onClose && onClose()}
            className="text-xs text-gray-500 hover:text-gray-700"
            type="button"
          >
            Back
          </button>
        </div>
      </div>

      <div ref={listRef} className="flex-1 overflow-auto px-6 py-4">
        {isAnalyzing ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin" />
            <div className="mt-3 text-sm text-gray-600">
              Analyzing the stock
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <Message key={m.id} m={m} />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 px-6 py-6">
        <div className="flex items-center justify-center">
          {!isAnalyzing ? (
            <button
              onClick={handleSend}
              type="button"
              className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-800"
            >
              {hasAnalyzed ? "ReAnalyze it!!" : "Analyze now!!"}
            </button>
          ) : (
            <div className="h-9" />
          )}
        </div>
      </div>
    </aside>
  );
};

export default EquityAIChat;
