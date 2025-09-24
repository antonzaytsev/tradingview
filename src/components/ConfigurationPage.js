import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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

  // Drag and drop functionality for symbols
  const [draggedSymbolIndex, setDraggedSymbolIndex] = useState(null);
  const [dragOverSymbolIndex, setDragOverSymbolIndex] = useState(null);

  // Create a visual preview of symbols during drag
  const visualSymbols = useMemo(() => {
    if (draggedSymbolIndex === null || dragOverSymbolIndex === null || draggedSymbolIndex === dragOverSymbolIndex) {
      return symbols;
    }

    const result = [...symbols];
    const [draggedSymbol] = result.splice(draggedSymbolIndex, 1);
    result.splice(dragOverSymbolIndex, 0, draggedSymbol);
    return result;
  }, [symbols, draggedSymbolIndex, dragOverSymbolIndex]);

  const handleSymbolDragStart = useCallback((e, index) => {
    setDraggedSymbolIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  }, []);

  const handleSymbolDragEnd = useCallback(() => {
    setDraggedSymbolIndex(null);
    setDragOverSymbolIndex(null);
  }, []);

  const handleSymbolDragOver = useCallback((e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (draggedSymbolIndex !== null && draggedSymbolIndex !== index) {
      setDragOverSymbolIndex(index);
    }
  }, [draggedSymbolIndex]);

  const handleSymbolDragLeave = useCallback((e) => {
    // Only clear drag over if we're leaving the entire symbols list area
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverSymbolIndex(null);
    }
  }, []);

  const handleSymbolDrop = useCallback((e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedSymbolIndex === null || dragOverSymbolIndex === null) {
      setDraggedSymbolIndex(null);
      setDragOverSymbolIndex(null);
      return;
    }

    // Apply the same transformation that we show in the visual preview
    setSymbols(prev => {
      const newSymbols = [...prev];
      const [draggedSymbol] = newSymbols.splice(draggedSymbolIndex, 1);
      newSymbols.splice(dragOverSymbolIndex, 0, draggedSymbol);
      return newSymbols;
    });

    setDraggedSymbolIndex(null);
    setDragOverSymbolIndex(null);
  }, [draggedSymbolIndex, dragOverSymbolIndex]);

  // Drag and drop functionality for charts
  const [draggedChartIndex, setDraggedChartIndex] = useState(null);
  const [dragOverChartIndex, setDragOverChartIndex] = useState(null);

  // Create a visual preview of charts during drag
  const visualCharts = useMemo(() => {
    if (draggedChartIndex === null || dragOverChartIndex === null || draggedChartIndex === dragOverChartIndex) {
      return charts;
    }

    const result = [...charts];
    const [draggedChart] = result.splice(draggedChartIndex, 1);
    result.splice(dragOverChartIndex, 0, draggedChart);
    return result;
  }, [charts, draggedChartIndex, dragOverChartIndex]);

  const handleChartDragStart = useCallback((e, index) => {
    setDraggedChartIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  }, []);

  const handleChartDragEnd = useCallback(() => {
    setDraggedChartIndex(null);
    setDragOverChartIndex(null);
  }, []);

  const handleChartDragOver = useCallback((e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (draggedChartIndex !== null && draggedChartIndex !== index) {
      setDragOverChartIndex(index);
    }
  }, [draggedChartIndex]);

  const handleChartDragLeave = useCallback((e) => {
    // Only clear drag over if we're leaving the entire charts list area
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverChartIndex(null);
    }
  }, []);

  const handleChartDrop = useCallback((e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedChartIndex === null || dragOverChartIndex === null) {
      setDraggedChartIndex(null);
      setDragOverChartIndex(null);
      return;
    }

    // Apply the same transformation that we show in the visual preview
    setCharts(prev => {
      const newCharts = [...prev];
      const [draggedChart] = newCharts.splice(draggedChartIndex, 1);
      newCharts.splice(dragOverChartIndex, 0, draggedChart);
      return newCharts;
    });

    setDraggedChartIndex(null);
    setDragOverChartIndex(null);
  }, [draggedChartIndex, dragOverChartIndex]);

  // Chart config management
  const updateChartConfig = useCallback((field, value) => {
    setChartConfig(prev => ({ ...prev, [field]: value }));
  }, []);

  const intervalOptions = ['1', '3', '5', '15', '30', '60', '120', '180', '240', 'D', 'W', 'M'];
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
              {visualSymbols.map((symbol, index) => {
                // Find the original index in the base symbols array for visual styling
                const originalIndex = symbols.findIndex(s => s === symbol);
                const isCurrentlyDragged = draggedSymbolIndex === originalIndex;

                return (
                  <div
                    key={`${symbol.coin}-${symbol.symbol}-${index}`}
                    className={`symbol-item ${isCurrentlyDragged ? 'dragging' : ''}`}
                    draggable
                    onDragStart={(e) => handleSymbolDragStart(e, originalIndex)}
                    onDragOver={(e) => handleSymbolDragOver(e, index)}
                    onDragLeave={handleSymbolDragLeave}
                    onDrop={(e) => handleSymbolDrop(e, index)}
                    onDragEnd={handleSymbolDragEnd}
                  >
                  <div className="drag-handle" title="Drag to reorder">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="4" cy="4" r="1" fill="currentColor"/>
                      <circle cx="4" cy="8" r="1" fill="currentColor"/>
                      <circle cx="4" cy="12" r="1" fill="currentColor"/>
                      <circle cx="8" cy="4" r="1" fill="currentColor"/>
                      <circle cx="8" cy="8" r="1" fill="currentColor"/>
                      <circle cx="8" cy="12" r="1" fill="currentColor"/>
                      <circle cx="12" cy="4" r="1" fill="currentColor"/>
                      <circle cx="12" cy="8" r="1" fill="currentColor"/>
                      <circle cx="12" cy="12" r="1" fill="currentColor"/>
                    </svg>
                  </div>
                    <input
                      type="text"
                      placeholder="Coin"
                      value={symbol.coin || ''}
                      onChange={(e) => updateSymbol(originalIndex, 'coin', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Exchange"
                      value={symbol.exchange || ''}
                      onChange={(e) => updateSymbol(originalIndex, 'exchange', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Symbol (e.g., BYBIT:BTCUSDT)"
                      value={symbol.symbol || ''}
                      onChange={(e) => updateSymbol(originalIndex, 'symbol', e.target.value)}
                    />
                    <button onClick={() => removeSymbol(originalIndex)} className="remove-btn">Remove</button>
                  </div>
                );
              })}
            </div>

            <div className="add-symbol">
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
              {visualCharts.map((chart, index) => {
                // Find the original index in the base charts array for visual styling
                const originalIndex = charts.findIndex(c => c === chart);
                const isCurrentlyDragged = draggedChartIndex === originalIndex;

                return (
                  <div
                    key={`${chart.interval}-${index}`}
                    className={`chart-item ${isCurrentlyDragged ? 'dragging' : ''}`}
                    draggable
                    onDragStart={(e) => handleChartDragStart(e, originalIndex)}
                    onDragOver={(e) => handleChartDragOver(e, index)}
                    onDragLeave={handleChartDragLeave}
                    onDrop={(e) => handleChartDrop(e, index)}
                    onDragEnd={handleChartDragEnd}
                  >
                    <div className="drag-handle" title="Drag to reorder">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="4" cy="4" r="1" fill="currentColor"/>
                        <circle cx="4" cy="8" r="1" fill="currentColor"/>
                        <circle cx="4" cy="12" r="1" fill="currentColor"/>
                        <circle cx="8" cy="4" r="1" fill="currentColor"/>
                        <circle cx="8" cy="8" r="1" fill="currentColor"/>
                        <circle cx="8" cy="12" r="1" fill="currentColor"/>
                        <circle cx="12" cy="4" r="1" fill="currentColor"/>
                        <circle cx="12" cy="8" r="1" fill="currentColor"/>
                        <circle cx="12" cy="12" r="1" fill="currentColor"/>
                      </svg>
                    </div>
                    <select
                      value={chart.interval}
                      onChange={(e) => updateChart(originalIndex, 'interval', e.target.value)}
                    >
                      {intervalOptions.map(interval => (
                        <option key={interval} value={interval}>{interval}</option>
                      ))}
                    </select>
                    <button onClick={() => removeChart(originalIndex)} className="remove-btn">Remove</button>
                  </div>
                );
              })}
            </div>

            <div className="add-chart">
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
