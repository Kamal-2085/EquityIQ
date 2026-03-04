import { useEffect, useRef } from "react";
import { AreaSeries, createChart } from "lightweight-charts";

const StockChart = ({
  data,
  height = 320,
  minHeight = 320,
  trend,
  timeMode,
}) => {
  const containerRef = useRef();
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  const formatTimeLabel = (unixTime) => {
    const date = new Date(unixTime * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const resolveTrendOverride = (value) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return null;
    }
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (normalized === "down" || normalized === "negative") return "down";
      if (normalized === "up" || normalized === "positive") return "up";
      return null;
    }
    if (typeof value === "number") {
      if (value < 0) return "down";
      if (value > 0) return "up";
    }
    return null;
  };

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const chart = createChart(containerRef.current, {
      height,
      width: containerRef.current.clientWidth || 600,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#333",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        tickMarkFormatter:
          timeMode === "intraday" ? (time) => formatTimeLabel(time) : undefined,
      },
    });

    const seriesOptions = {
      lineColor: "#16a34a",
      topColor: "rgba(22,163,74,0.4)",
      bottomColor: "rgba(22,163,74,0.05)",
      lineWidth: 2,
    };
    const series = chart.addAreaSeries
      ? chart.addAreaSeries(seriesOptions)
      : chart.addSeries(AreaSeries, seriesOptions);

    chartRef.current = chart;
    seriesRef.current = series;

    const resize = () => {
      if (!containerRef.current || !chartRef.current) return;
      chartRef.current.applyOptions({
        width: containerRef.current.clientWidth || 600,
      });
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [height]);

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.applyOptions({
      timeScale: {
        tickMarkFormatter:
          timeMode === "intraday" ? (time) => formatTimeLabel(time) : undefined,
      },
    });
  }, [timeMode]);

  useEffect(() => {
    if (!seriesRef.current) return;
    const safeData = Array.isArray(data) ? data : [];
    const trendOverride = resolveTrendOverride(trend);
    if (trendOverride) {
      const isDown = trendOverride === "down";
      seriesRef.current.applyOptions({
        lineColor: isDown ? "#dc2626" : "#16a34a",
        topColor: isDown ? "rgba(220,38,38,0.35)" : "rgba(22,163,74,0.4)",
        bottomColor: isDown ? "rgba(220,38,38,0.05)" : "rgba(22,163,74,0.05)",
      });
    } else if (safeData.length > 1) {
      const first = safeData[0]?.value;
      const last = safeData[safeData.length - 1]?.value;
      if (
        first !== null &&
        last !== null &&
        first !== undefined &&
        last !== undefined
      ) {
        const isDown = last < first;
        seriesRef.current.applyOptions({
          lineColor: isDown ? "#dc2626" : "#16a34a",
          topColor: isDown ? "rgba(220,38,38,0.35)" : "rgba(22,163,74,0.4)",
          bottomColor: isDown ? "rgba(220,38,38,0.05)" : "rgba(22,163,74,0.05)",
        });
      }
    }
    seriesRef.current.setData(safeData);
    chartRef.current?.timeScale().fitContent();
  }, [data, trend]);

  return <div ref={containerRef} className="w-full" style={{ minHeight }} />;
};

export default StockChart;
