import TradingViewWidget from "./components/TradingViewWidget";
import { charts, chartConfig } from "./lib/input";
import { useSettings } from "./contexts/SettingsContext";

function SymbolCharts({ symbol, localSettings, exchange, chartsOverride, el }) {
  const { settings } = useSettings();

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
