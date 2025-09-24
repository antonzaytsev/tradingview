import TradingViewWidget from "./components/TradingViewWidget";
import { ConfigManager } from "./lib/config";
import { useSettings } from "./contexts/SettingsContext";

function SymbolCharts({ symbol, localSettings, exchange, chartsOverride, el }) {
  const { settings } = useSettings();

  // Get effective configuration from ConfigManager (localStorage or defaults)
  const charts = ConfigManager.getCharts();
  const chartConfig = ConfigManager.getChartConfig();

  const chartSettings = localSettings?.chart || {};
  const chartsCount = localSettings?.charts_amount || settings.chartCount;

  const chartsList = charts.slice(0, chartsCount);

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
