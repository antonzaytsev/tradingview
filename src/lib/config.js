// Configuration utility that merges localStorage settings with input.js defaults
import { charts as defaultCharts, chartConfig as defaultChartConfig, symbols as defaultSymbols } from './input';
import ConfigStorage from './configStorage';

export class ConfigManager {
  // Get effective symbols (from localStorage or defaults)
  static getSymbols() {
    const stored = ConfigStorage.getSymbols();
    return (stored && stored.length > 0) ? stored : defaultSymbols;
  }

  // Get effective charts configuration (from localStorage or defaults)
  static getCharts() {
    const stored = ConfigStorage.getCharts();
    return (stored && stored.length > 0) ? stored : defaultCharts;
  }

  // Get effective chart config (from localStorage or defaults)
  static getChartConfig() {
    const stored = ConfigStorage.getChartConfig();
    return stored || defaultChartConfig;
  }

  // Save symbols to localStorage
  static saveSymbols(symbols) {
    return ConfigStorage.setSymbols(symbols);
  }

  // Save charts configuration to localStorage
  static saveCharts(charts) {
    return ConfigStorage.setCharts(charts);
  }

  // Save chart config to localStorage
  static saveChartConfig(chartConfig) {
    return ConfigStorage.setChartConfig(chartConfig);
  }


  // Get all configuration at once
  static getAllConfig() {
    return {
      symbols: this.getSymbols(),
      charts: this.getCharts(),
      chartConfig: this.getChartConfig(),
    };
  }

  // Utility method to clear localStorage and restore defaults
  static clearStorageAndRestoreDefaults() {
    try {
      localStorage.removeItem('tradingview-app-settings');
      console.log('Cleared localStorage and restored defaults');
      return {
        symbols: defaultSymbols,
        charts: defaultCharts,
        chartConfig: defaultChartConfig,
      };
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return this.getAllConfig();
    }
  }
}

export default ConfigManager;
