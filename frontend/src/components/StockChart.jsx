import { useEffect, useRef } from "react";
import { AreaSeries, createChart } from "lightweight-charts";

const StockChart = ({ data }) => {
  const containerRef = useRef();
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const chart = createChart(containerRef.current, {
      height: 320,
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
  }, []);

  useEffect(() => {
    if (!seriesRef.current) return;
    const safeData = Array.isArray(data) ? data : [];
    if (safeData.length > 1) {
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
  }, [data]);

  return (
    <div ref={containerRef} className="w-full" style={{ minHeight: 320 }} />
  );
};

export default StockChart;
