import TradingViewWidget from "./components/TradingViewWidget";
import { ConfigManager } from "./lib/config";
import { useSettings } from "./contexts/SettingsContext";
import React, { useState, useEffect } from "react";

function SymbolCharts({ symbol, localSettings, exchange, chartsOverride, el }) {
  const { settings } = useSettings();
  const [charts, setCharts] = useState([]);
  const [chartConfig, setChartConfig] = useState({});
  const [loading, setLoading] = useState(true);

  // Load configuration from backend
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const [loadedCharts, loadedChartConfig] = await Promise.all([
          ConfigManager.getCharts(),
          ConfigManager.getChartConfig()
        ]);
        setCharts(loadedCharts);
        setChartConfig(loadedChartConfig);
      } catch (error) {
        console.error('Error loading chart configuration:', error);
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  const chartSettings = localSettings?.chart || {};

  // Show loading state while configuration is being fetched
  if (loading) {
    return <div className="app-symbol-charts-loading">Loading charts...</div>;
  }

  // Filter charts based on visibility instead of count (default to visible if not set)
  const chartsList = charts.filter(chart => chart.visible !== false);

  return (
    <div className={`app-symbol-charts app-symbol-charts-${chartsList.length}`}>
      {chartsList.map((chart) => {
        const config = {
          ...chartConfig,
          ...chart,
          ...chartSettings,
          symbol
        }

        return (
          <div className="symbol-charts-widget" key={chart.interval}>
            <TradingViewWidget {...config} />
          </div>
        )
      })}
    </div>
  );
}

export default SymbolCharts
