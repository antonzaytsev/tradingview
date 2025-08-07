import TradingViewWidget from "react-tradingview-widget";
import { charts, chartConfig } from "./lib/input";

function SymbolCharts({ symbol, configOverrides, chartsOverride, el }) {
  configOverrides = configOverrides || {}
  const chartsList = el[3] || charts

  return (
    <div className={`app-symbol-charts app-symbol-charts-${chartsList.length}`}>
      {chartsList.map((chart) => {
        const config = {
          ...chartConfig,
          ...chart,
          ...configOverrides,
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
