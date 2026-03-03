const listeners = new Map();
const chartRequests = new Map();
const chartSubscriptions = new Map();
let socket = null;
let reconnectTimer = null;
let pendingMessages = [];
let indicesSubscribed = false;
let quoteSymbols = [];

const getMarketSocketUrl = () => {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${window.location.host}/ws/market`;
};

const hasListeners = () =>
  [...listeners.values()].some((set) => set && set.size > 0);

const addListener = (type, handler) => {
  if (!listeners.has(type)) listeners.set(type, new Set());
  listeners.get(type).add(handler);
};

const removeListener = (type, handler) => {
  const set = listeners.get(type);
  if (!set) return;
  set.delete(handler);
  if (set.size === 0) listeners.delete(type);
};

const dispatchMessage = (message) => {
  if (message?.type === "chart" && message?.requestId) {
    const handler = chartRequests.get(message.requestId);
    if (handler) {
      chartRequests.delete(message.requestId);
      handler(message);
    }
  }
  const handlers = listeners.get(message?.type);
  if (!handlers) return;
  handlers.forEach((handler) => handler(message));
};

const flushPending = () => {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  pendingMessages.forEach((payload) => socket.send(payload));
  pendingMessages = [];
};

const sendMessage = (message) => {
  const payload = JSON.stringify(message);
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(payload);
  } else {
    pendingMessages.push(payload);
  }
};

const resendSubscriptions = () => {
  if (indicesSubscribed) {
    sendMessage({ type: "subscribe_indices" });
  }
  if (quoteSymbols.length > 0) {
    sendMessage({ type: "subscribe_quotes", symbols: quoteSymbols });
  }
  chartSubscriptions.forEach((subscription) => {
    sendMessage({
      type: "subscribe_chart",
      key: subscription.key,
      symbol: subscription.symbol,
      range: subscription.range,
      interval: subscription.interval,
    });
  });
};

const scheduleReconnect = () => {
  if (reconnectTimer || !hasListeners()) return;
  reconnectTimer = window.setTimeout(() => {
    reconnectTimer = null;
    connect();
  }, 1000);
};

const connect = () => {
  if (
    socket &&
    (socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }

  socket = new WebSocket(getMarketSocketUrl());

  socket.addEventListener("open", () => {
    flushPending();
    resendSubscriptions();
  });

  socket.addEventListener("message", (event) => {
    try {
      const message = JSON.parse(event.data);
      dispatchMessage(message);
    } catch {
      // ignore malformed payloads
    }
  });

  socket.addEventListener("close", () => {
    socket = null;
    scheduleReconnect();
  });

  socket.addEventListener("error", () => {
    if (socket && socket.readyState !== WebSocket.CLOSED) {
      socket.close();
    }
  });
};

export const addMarketListener = (type, handler) => {
  addListener(type, handler);
  connect();
};

export const removeMarketListener = (type, handler) => {
  removeListener(type, handler);
};

export const setIndicesSubscription = (enabled) => {
  indicesSubscribed = Boolean(enabled);
  connect();
  sendMessage({ type: enabled ? "subscribe_indices" : "unsubscribe_indices" });
};

export const setQuoteSymbols = (symbols) => {
  const nextSymbols = [...new Set(symbols || [])].filter(Boolean);
  quoteSymbols = nextSymbols;
  connect();
  if (quoteSymbols.length > 0) {
    sendMessage({ type: "subscribe_quotes", symbols: quoteSymbols });
  } else {
    sendMessage({ type: "unsubscribe_quotes" });
  }
};

export const requestChartData = ({ symbol, range, interval }) => {
  if (!symbol) return Promise.reject(new Error("Missing symbol"));
  connect();
  return new Promise((resolve, reject) => {
    const requestId = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const timeoutId = window.setTimeout(() => {
      chartRequests.delete(requestId);
      reject(new Error("Chart request timed out"));
    }, 15000);

    chartRequests.set(requestId, (message) => {
      window.clearTimeout(timeoutId);
      if (message?.error) {
        reject(new Error(message.error));
        return;
      }
      resolve(message);
    });

    sendMessage({
      type: "chart_request",
      requestId,
      symbol,
      range,
      interval,
    });
  });
};

export const subscribeChart = ({ key, symbol, range, interval }) => {
  if (!key || !symbol) return;
  const subscription = { key, symbol, range, interval };
  chartSubscriptions.set(key, subscription);
  connect();
  sendMessage({
    type: "subscribe_chart",
    key,
    symbol,
    range,
    interval,
  });
};

export const unsubscribeChart = (key) => {
  if (!key) return;
  chartSubscriptions.delete(key);
  connect();
  sendMessage({ type: "unsubscribe_chart", key });
};
