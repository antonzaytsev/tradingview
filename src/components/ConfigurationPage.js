import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ConfigManager } from '../lib/config';
import { useSettings } from '../contexts/SettingsContext';
import { Themes } from './TradingViewWidget';
import './ConfigurationPage.css';

// Utility function to sort chart intervals from smaller to bigger
const sortChartsByInterval = (chartsToSort) => {
  return [...chartsToSort].sort((a, b) => {
    const aInterval = a.interval;
    const bInterval = b.interval;
    
    // Handle special cases first
    const timeOrder = { 'D': 1000, 'W': 2000, 'M': 3000 };
    
    // If both are special time intervals
    if (timeOrder[aInterval] && timeOrder[bInterval]) {
      return timeOrder[aInterval] - timeOrder[bInterval];
    }
    
    // If one is special, put it after numeric
    if (timeOrder[aInterval] && !timeOrder[bInterval]) {
      return 1;
    }
    if (!timeOrder[aInterval] && timeOrder[bInterval]) {
      return -1;
    }
    
    // Both are numeric, convert and compare
    const aNum = parseInt(aInterval, 10);
    const bNum = parseInt(bInterval, 10);
    
    return aNum - bNum;
  });
};

const ConfigurationPage = ({ onSymbolsChange }) => {
  // ConfigPage state
  const [symbols, setSymbols] = useState([]);
  const [charts, setCharts] = useState([]);
  const [chartConfig, setChartConfig] = useState({});
  const [newSymbol, setNewSymbol] = useState({ coin: '', exchange: '', symbol: '', visible: true });

  // SettingsPage state
  const { settings, updateSetting } = useSettings();

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
    
    // Create comprehensive chart list with all available intervals inline
    const allIntervals = ['1', '3', '5', '15', '30', '60', '120', '180', '240', 'D', 'W', 'M'];
    const existingChartsMap = new Map();
    config.charts.forEach(chart => {
      existingChartsMap.set(chart.interval, chart);
    });
    
    const completeCharts = allIntervals.map(interval => {
      const existing = existingChartsMap.get(interval);
      return existing || { interval, visible: false };
    });
    
    setCharts(sortChartsByInterval(completeCharts));
    setChartConfig(config.chartConfig);
    isInitialized.current = true;
  }, []);

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
      setNewSymbol({ coin: '', exchange: '', symbol: '', visible: true });
    }
  }, [newSymbol]);

  // Handle form submission for adding symbols
  const handleAddSymbolSubmit = useCallback((e) => {
    e.preventDefault();
    addSymbol();
  }, [addSymbol]);

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

  // Toggle symbol visibility
  const toggleSymbolVisibility = useCallback((index) => {
    setSymbols(prev => {
      const updated = [...prev];
      // Default to true if visible property doesn't exist (backward compatibility)
      const currentVisible = updated[index].visible !== false;
      updated[index] = { ...updated[index], visible: !currentVisible };
      return updated;
    });
  }, []);


  // Toggle chart visibility for specific interval
  const toggleChartVisibility = useCallback((interval) => {
    setCharts(prev => {
      const updated = prev.map(chart => {
        if (chart.interval === interval) {
          return { ...chart, visible: !chart.visible };
        }
        return chart;
      });
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


  // Chart config management
  const updateChartConfig = useCallback((field, value) => {
    setChartConfig(prev => ({ ...prev, [field]: value }));
  }, []);


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
                    <div className="symbol-controls">
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
                      <label className="visibility-checkbox-inline">
                        <input
                          type="checkbox"
                          checked={symbol.visible !== false}
                          onChange={() => toggleSymbolVisibility(originalIndex)}
                        />
                        <span className="checkmark-small"></span>
                        Visible
                      </label>
                    </div>
                    <button onClick={() => removeSymbol(originalIndex)} className="remove-btn">Remove</button>
                  </div>
                );
              })}
            </div>

            <div className="add-symbol">
              <form className="symbol-form" onSubmit={handleAddSymbolSubmit}>
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
                <button type="submit">Add Symbol</button>
              </form>
            </div>
          </section>

          {/* Chart Intervals Section */}
          <section className="config-section">
            <h2>Chart Intervals</h2>

            <div className="charts-grid">
              {charts.map((chart, index) => (
                <div
                  key={`${chart.interval}-${index}`}
                  className={`chart-item-compact ${chart.visible ? 'visible' : 'hidden'}`}
                  onClick={() => toggleChartVisibility(chart.interval)}
                >
                  <div className="chart-interval-content">
                    <input
                      type="checkbox"
                      checked={chart.visible || false}
                      onChange={() => toggleChartVisibility(chart.interval)}
                      style={{ display: 'none' }}
                    />
                    <span className="interval-text">{chart.interval}</span>
                    <div className="check-indicator">
                      {chart.visible && <span className="checkmark">✓</span>}
                    </div>
                  </div>
                </div>
              ))}
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
