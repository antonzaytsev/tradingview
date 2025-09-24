import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const { settings, updateSetting } = useSettings();
  const [tempChartCount, setTempChartCount] = useState(settings.chartCount);

  const [saveStatus, setSaveStatus] = useState('');
  const isInitialized = useRef(false);
  const saveTimeout = useRef(null);

  // Memoized callback to prevent re-renders
  const handleSymbolsChange = useCallback(() => {
    if (onSymbolsChange) {
      onSymbolsChange();
    }
  }, [onSymbolsChange]);

  // Load current configuration
  useEffect(() => {
    const config = ConfigManager.getAllConfig();
    setSymbols(config.symbols);
    setCharts(config.charts);
    setChartConfig(config.chartConfig);
    setTempChartCount(settings.chartCount);
    isInitialized.current = true;
  }, [settings.chartCount]);

  // Helper function to show status with debouncing
  const showStatus = useCallback((message) => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
    setSaveStatus(message);
    saveTimeout.current = setTimeout(() => setSaveStatus(''), 2000);
  }, []);

  // Auto-save with debouncing to prevent infinite loops
  useEffect(() => {
    if (!isInitialized.current) return;

    const saveTimer = setTimeout(() => {
      try {
        ConfigManager.saveSymbols(symbols);
        handleSymbolsChange();
      } catch (error) {
        showStatus('Error saving trading pairs');
        console.error('Error saving symbols:', error);
      }
    }, 300);

    return () => clearTimeout(saveTimer);
  }, [symbols]);

  // Auto-save charts with debouncing
  useEffect(() => {
    if (!isInitialized.current) return;

    const saveTimer = setTimeout(() => {
      try {
        ConfigManager.saveCharts(charts);
      } catch (error) {
        showStatus('Error saving chart intervals');
        console.error('Error saving charts:', error);
      }
    }, 300);

    return () => clearTimeout(saveTimer);
  }, [charts]);

  // Auto-save chart config with debouncing
  useEffect(() => {
    if (!isInitialized.current) return;

    const saveTimer = setTimeout(() => {
      try {
        ConfigManager.saveChartConfig(chartConfig);
      } catch (error) {
        showStatus('Error saving chart settings');
        console.error('Error saving chart config:', error);
      }
    }, 300);

    return () => clearTimeout(saveTimer);
  }, [chartConfig]);

  // Auto-save chart count with debouncing
  useEffect(() => {
    if (!isInitialized.current) return;

    const saveTimer = setTimeout(() => {
      updateSetting('chartCount', tempChartCount);
    }, 300);

    return () => clearTimeout(saveTimer);
  }, [tempChartCount]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, []);



  // Symbol management
  const addSymbol = useCallback(() => {
    if (newSymbol.coin && newSymbol.symbol) {
      setSymbols(prev => [...prev, { ...newSymbol }]);
      setNewSymbol({ coin: '', exchange: '', symbol: '' });
    }
  }, [newSymbol]);

  const removeSymbol = useCallback((index) => {
    setSymbols(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateSymbol = useCallback((index, field, value) => {
    setSymbols(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  // Chart management
  const addChart = useCallback(() => {
    if (newChart.interval) {
      setCharts(prev => [...prev, { ...newChart }]);
      setNewChart({ interval: '15' });
    }
  }, [newChart]);

  const removeChart = useCallback((index) => {
    setCharts(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateChart = useCallback((index, field, value) => {
    setCharts(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  // Chart config management
  const updateChartConfig = useCallback((field, value) => {
    setChartConfig(prev => ({ ...prev, [field]: value }));
  }, []);

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

        {symbols.length === 0 && (
          <div className="emergency-fix">
            <h3>🚨 Missing Trading Pairs</h3>
            <p>It looks like your trading pairs got cleared. Click below to restore the default pairs from input.js:</p>
            <button
              onClick={() => {
                ConfigManager.clearStorageAndRestoreDefaults();
                window.location.reload();
              }}
              className="restore-defaults-btn"
            >
              Restore Default Trading Pairs
            </button>
          </div>
        )}


        <div className="configuration-content">
          {/* Chart Display Section */}
          <section className="config-section">
            <h2>Chart Display</h2>

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
