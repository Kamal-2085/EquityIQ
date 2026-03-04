import WebSocket from "ws";
import protobuf from "protobufjs";

const STREAM_URL = "wss://streamer.finance.yahoo.com";
const RECONNECT_DELAY_MS = 1000;

const YATICKER_PROTO = `syntax = "proto3";
message Yaticker {
  string id = 1;
  float price = 2;
  int64 time = 3;
  string currency = 4;
  string exchange = 5;
  string quoteType = 6;
  string marketHours = 7;
  float changePercent = 8;
  int64 dayVolume = 9;
  float change = 10;
  string shortName = 11;
  int64 expireDate = 12;
  float openPrice = 13;
  float previousClose = 14;
  float dayHigh = 15;
  float dayLow = 16;
  float marketCap = 17;
  float marketPrice = 18;
  float bid = 19;
  float ask = 20;
  int64 bidSize = 21;
  int64 askSize = 22;
  string currencySymbol = 23;
  float trailingPE = 24;
  float forwardPE = 25;
  float priceToBook = 26;
  int64 sourceInterval = 27;
  int64 exchangeDataDelayedBy = 28;
  float regularMarketPrice = 29;
  float regularMarketDayHigh = 30;
  float regularMarketDayLow = 31;
  float regularMarketDayVolume = 32;
  float regularMarketPreviousClose = 33;
  float regularMarketOpen = 34;
  int64 regularMarketTime = 35;
  float regularMarketChange = 36;
  float regularMarketChangePercent = 37;
}
`;

const root = protobuf.parse(YATICKER_PROTO).root;
const Yaticker = root.lookupType("Yaticker");

export const createYahooStreamer = () => {
  let socket = null;
  let reconnectTimer = null;
  let desiredSymbols = new Set();
  const listeners = new Set();

  const hasSymbols = () => desiredSymbols.size > 0;

  const scheduleReconnect = () => {
    if (reconnectTimer || !hasSymbols()) return;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, RECONNECT_DELAY_MS);
  };

  const sendSubscribe = (symbols) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    if (!symbols || symbols.length === 0) return;
    socket.send(JSON.stringify({ subscribe: symbols }));
  };

  const sendUnsubscribe = (symbols) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    if (!symbols || symbols.length === 0) return;
    socket.send(JSON.stringify({ unsubscribe: symbols }));
  };

  const connect = () => {
    if (!hasSymbols()) return;
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    socket = new WebSocket(STREAM_URL);

    socket.on("open", () => {
      sendSubscribe([...desiredSymbols]);
    });

    socket.on("message", (data) => {
      try {
        const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
        const decoded = Yaticker.decode(new Uint8Array(buffer));
        listeners.forEach((handler) => handler(decoded));
      } catch {
        // ignore malformed payloads
      }
    });

    socket.on("close", () => {
      socket = null;
      scheduleReconnect();
    });

    socket.on("error", () => {
      if (socket && socket.readyState !== WebSocket.CLOSED) {
        socket.close();
      }
    });
  };

  const setSymbols = (symbols) => {
    const next = new Set((symbols || []).map((symbol) => String(symbol || "").trim()).filter(Boolean));
    const added = [...next].filter((symbol) => !desiredSymbols.has(symbol));
    const removed = [...desiredSymbols].filter((symbol) => !next.has(symbol));
    desiredSymbols = next;

    if (!hasSymbols()) {
      if (socket && socket.readyState === WebSocket.OPEN) {
        sendUnsubscribe(removed);
      }
      if (socket) {
        socket.close();
        socket = null;
      }
      return;
    }

    connect();
    sendUnsubscribe(removed);
    sendSubscribe(added);
  };

  const onTick = (handler) => {
    listeners.add(handler);
    return () => listeners.delete(handler);
  };

  const close = () => {
    desiredSymbols.clear();
    if (socket) {
      socket.close();
      socket = null;
    }
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  return {
    setSymbols,
    onTick,
    close,
  };
};
