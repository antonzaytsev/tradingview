import React, { useState, useEffect } from 'react';
import { ConfigManager } from '../lib/config';
import { useSettings } from '../contexts/SettingsContext';
import { Themes } from './TradingViewWidget';
import './ConfigurationPage.css';

const ConfigurationPage = ({ onSymbolsChange }) => {
  // ConfigPage state
  const [symbols, setSymbols] = useState([]);
  const [charts, setCharts] = useState([]);
  const [chartConfig, setChartConfig] = useState({});
  const [newSymbol, setNewSymbol] = useState({ coin: '', exchange: '', symbol: '' });
  const [newChart, setNewChart] = useState({ interval: '15' });
  
  // SettingsPage state
  const { settings, updateSetting, resetSettings } = useSettings();
  const [tempChartCount, setTempChartCount] = useState(settings.chartCount);
  
  const [saveStatus, setSaveStatus] = useState('');

  // Load current configuration
  useEffect(() => {
    const config = ConfigManager.getAllConfig();
    setSymbols(config.symbols);
    setCharts(config.charts);
    setChartConfig(config.chartConfig);
    setTempChartCount(settings.chartCount);
  }, [settings.chartCount]);

  // Save functions
  const saveSymbols = () => {
    try {
      ConfigManager.saveSymbols(symbols);
      setSaveStatus('Trading pairs saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
      if (onSymbolsChange) {
        onSymbolsChange();
      }
    } catch (error) {
      setSaveStatus('Error saving trading pairs');
      console.error('Error saving symbols:', error);
    }
  };

  const saveCharts = () => {
    try {
      ConfigManager.saveCharts(charts);
      setSaveStatus('Chart intervals saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('Error saving chart intervals');
      console.error('Error saving charts:', error);
    }
  };

  const saveChartConfig = () => {
    try {
      ConfigManager.saveChartConfig(chartConfig);
      setSaveStatus('Global chart settings saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('Error saving chart config');
      console.error('Error saving chart config:', error);
    }
  };

  const saveChartCount = () => {
    updateSetting('chartCount', tempChartCount);
    setSaveStatus('Chart display settings saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const saveAll = () => {
    try {
      ConfigManager.saveSymbols(symbols);
      ConfigManager.saveCharts(charts);
      ConfigManager.saveChartConfig(chartConfig);
      updateSetting('chartCount', tempChartCount);
      setSaveStatus('All configurations saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
      if (onSymbolsChange) {
        onSymbolsChange();
      }
    } catch (error) {
      setSaveStatus('Error saving configurations');
      console.error('Error saving configurations:', error);
    }
  };

  // Reset functions
  const resetSymbols = () => {
    const defaultSymbols = ConfigManager.resetSymbols();
    setSymbols([...defaultSymbols]);
    setSaveStatus('Trading pairs reset to defaults');
    setTimeout(() => setSaveStatus(''), 3000);
    if (onSymbolsChange) {
      onSymbolsChange();
    }
  };

  const resetCharts = () => {
    const defaultCharts = ConfigManager.resetCharts();
    setCharts([...defaultCharts]);
    setSaveStatus('Chart intervals reset to defaults');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const resetChartConfig = () => {
    const defaultChartConfig = ConfigManager.resetChartConfig();
    setChartConfig({ ...defaultChartConfig });
    setSaveStatus('Global chart settings reset to defaults');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const resetChartCount = () => {
    resetSettings();
    setTempChartCount(6);
    setSaveStatus('Chart display settings reset to defaults');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const resetAll = () => {
    resetSymbols();
    resetCharts();
    resetChartConfig();
    resetSettings();
    setTempChartCount(6);
    setSaveStatus('All settings reset to defaults');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  // Symbol management
  const addSymbol = () => {
    if (newSymbol.coin && newSymbol.symbol) {
      setSymbols([...symbols, { ...newSymbol }]);
      setNewSymbol({ coin: '', exchange: '', symbol: '' });
    }
  };

  const removeSymbol = (index) => {
    setSymbols(symbols.filter((_, i) => i !== index));
  };

  const updateSymbol = (index, field, value) => {
    const updated = [...symbols];
    updated[index] = { ...updated[index], [field]: value };
    setSymbols(updated);
  };

  // Chart management
  const addChart = () => {
    if (newChart.interval) {
      setCharts([...charts, { ...newChart }]);
      setNewChart({ interval: '15' });
    }
  };

  const removeChart = (index) => {
    setCharts(charts.filter((_, i) => i !== index));
  };

  const updateChart = (index, field, value) => {
    const updated = [...charts];
    updated[index] = { ...updated[index], [field]: value };
    setCharts(updated);
  };

  // Chart config management
  const updateChartConfig = (field, value) => {
    setChartConfig({ ...chartConfig, [field]: value });
  };

  const intervalOptions = ['1', '3', '5', '15', '30', '60', '120', '180', 'D', 'W', 'M'];
  const themeOptions = Object.values(Themes);

  return (
    <div className="configuration-page">
      <div className="configuration-container">
        <div className="configuration-header">
          <h1>Configuration</h1>
          <p className="configuration-subtitle">Manage your trading pairs, charts, and display settings</p>
        </div>

        {saveStatus && (
          <div className={`save-status ${saveStatus.includes('Error') ? 'error' : 'success'}`}>
            {saveStatus}
          </div>
        )}

        <div className="configuration-actions">
          <button onClick={saveAll} className="save-all-btn">Save All</button>
          <button onClick={resetAll} className="reset-all-btn">Reset All</button>
        </div>

        <div className="configuration-content">
          {/* Chart Display Section */}
          <section className="config-section">
            <h2>Chart Display</h2>
            <div className="section-actions">
              <button onClick={saveChartCount}>Save Display Settings</button>
              <button onClick={resetChartCount}>Reset to Defaults</button>
            </div>

            <div className="setting-group">
              <label htmlFor="chart-count">Number of Charts per Symbol:</label>
              <div className="chart-count-control">
                <input
                  id="chart-count"
                  type="range"
                  min="1"
                  max="8"
                  value={tempChartCount}
                  onChange={(e) => setTempChartCount(parseInt(e.target.value))}
                  className="chart-count-slider"
                />
                <span className="chart-count-value">{tempChartCount}</span>
              </div>
              <small className="setting-description">
                Controls how many time interval charts are displayed for each trading symbol
              </small>
              
              <div className="setting-preview">
                <h3>Preview</h3>
                <p>With {tempChartCount} chart{tempChartCount !== 1 ? 's' : ''}, you'll see:</p>
                <ul>
                  {tempChartCount >= 1 && <li>15 minute chart</li>}
                  {tempChartCount >= 2 && <li>1 hour chart</li>}
                  {tempChartCount >= 3 && <li>4 hour chart</li>}
                  {tempChartCount >= 4 && <li>Daily chart</li>}
                  {tempChartCount >= 5 && <li>Weekly chart</li>}
                  {tempChartCount >= 6 && <li>Monthly chart</li>}
                  {tempChartCount >= 7 && <li>Additional interval (if configured)</li>}
                  {tempChartCount >= 8 && <li>Additional interval (if configured)</li>}
                </ul>
              </div>
            </div>
          </section>

          {/* Trading Pairs Section */}
          <section className="config-section">
            <h2>Trading Pairs</h2>
            <div className="section-actions">
              <button onClick={saveSymbols}>Save Trading Pairs</button>
              <button onClick={resetSymbols}>Reset to Defaults</button>
            </div>

            <div className="symbols-list">
              {symbols.map((symbol, index) => (
                <div key={index} className="symbol-item">
                  <input
                    type="text"
                    placeholder="Coin"
                    value={symbol.coin || ''}
                    onChange={(e) => updateSymbol(index, 'coin', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Exchange"
                    value={symbol.exchange || ''}
                    onChange={(e) => updateSymbol(index, 'exchange', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Symbol (e.g., BYBIT:BTCUSDT)"
                    value={symbol.symbol || ''}
                    onChange={(e) => updateSymbol(index, 'symbol', e.target.value)}
                  />
                  <button onClick={() => removeSymbol(index)} className="remove-btn">Remove</button>
                </div>
              ))}
            </div>

            <div className="add-symbol">
              <h3>Add New Trading Pair</h3>
              <div className="symbol-form">
                <input
                  type="text"
                  placeholder="Coin"
                  value={newSymbol.coin}
                  onChange={(e) => setNewSymbol({ ...newSymbol, coin: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Exchange"
                  value={newSymbol.exchange}
                  onChange={(e) => setNewSymbol({ ...newSymbol, exchange: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Symbol (e.g., BYBIT:BTCUSDT)"
                  value={newSymbol.symbol}
                  onChange={(e) => setNewSymbol({ ...newSymbol, symbol: e.target.value })}
                />
                <button onClick={addSymbol}>Add Symbol</button>
              </div>
            </div>
          </section>

          {/* Chart Intervals Section */}
          <section className="config-section">
            <h2>Chart Intervals</h2>
            <div className="section-actions">
              <button onClick={saveCharts}>Save Intervals</button>
              <button onClick={resetCharts}>Reset to Defaults</button>
            </div>

            <div className="charts-list">
              {charts.map((chart, index) => (
                <div key={index} className="chart-item">
                  <select
                    value={chart.interval}
                    onChange={(e) => updateChart(index, 'interval', e.target.value)}
                  >
                    {intervalOptions.map(interval => (
                      <option key={interval} value={interval}>{interval}</option>
                    ))}
                  </select>
                  <button onClick={() => removeChart(index)} className="remove-btn">Remove</button>
                </div>
              ))}
            </div>

            <div className="add-chart">
              <h3>Add New Chart Interval</h3>
              <div className="chart-form">
                <select
                  value={newChart.interval}
                  onChange={(e) => setNewChart({ ...newChart, interval: e.target.value })}
                >
                  {intervalOptions.map(interval => (
                    <option key={interval} value={interval}>{interval}</option>
                  ))}
                </select>
                <button onClick={addChart}>Add Chart</button>
              </div>
            </div>
          </section>

          {/* Global Chart Settings Section */}
          <section className="config-section">
            <h2>Global Chart Settings</h2>
            <div className="section-actions">
              <button onClick={saveChartConfig}>Save Chart Settings</button>
              <button onClick={resetChartConfig}>Reset to Defaults</button>
            </div>

            <div className="chart-config">
              <div className="config-item">
                <label>Theme:</label>
                <select
                  value={chartConfig.theme || 'dark'}
                  onChange={(e) => updateChartConfig('theme', e.target.value)}
                >
                  {themeOptions.map(theme => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </select>
              </div>

              <div className="config-item">
                <label>Style:</label>
                <select
                  value={chartConfig.style || '1'}
                  onChange={(e) => updateChartConfig('style', e.target.value)}
                >
                  <option value="1">Candles</option>
                  <option value="8">Heikin Ashi</option>
                </select>
              </div>

              <div className="config-item">
                <label>Timezone:</label>
                <input
                  type="text"
                  value={chartConfig.timezone || 'Etc/UTC'}
                  onChange={(e) => updateChartConfig('timezone', e.target.value)}
                />
              </div>

              <div className="config-item">
                <label>Locale:</label>
                <input
                  type="text"
                  value={chartConfig.locale || 'en'}
                  onChange={(e) => updateChartConfig('locale', e.target.value)}
                />
              </div>

              <div className="config-item checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    checked={chartConfig.calendar || false}
                    onChange={(e) => updateChartConfig('calendar', e.target.checked)}
                  />
                  Show Calendar
                </label>
              </div>

              <div className="config-item checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    checked={chartConfig.hide_top_toolbar || false}
                    onChange={(e) => updateChartConfig('hide_top_toolbar', e.target.checked)}
                  />
                  Hide Top Toolbar
                </label>
              </div>

              <div className="config-item checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    checked={chartConfig.hide_side_toolbar || false}
                    onChange={(e) => updateChartConfig('hide_side_toolbar', e.target.checked)}
                  />
                  Hide Side Toolbar
                </label>
              </div>

              <div className="config-item checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    checked={chartConfig.withdateranges || false}
                    onChange={(e) => updateChartConfig('withdateranges', e.target.checked)}
                  />
                  With Date Ranges
                </label>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPage;
