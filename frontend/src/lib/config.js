// Configuration utility that merges localStorage settings with input.js defaults
import { charts as defaultCharts, chartConfig as defaultChartConfig, symbols as defaultSymbols } from './input';
import ConfigStorage from './configStorage';

export class ConfigManager {
  // Get effective symbols (from backend or defaults)
  static async getSymbols() {
    const stored = await ConfigStorage.getSymbols();
    // Check if stored is valid array with proper symbol objects
    if (stored && Array.isArray(stored) && stored.length > 0) {
      // Ensure all symbols have required properties
      const validSymbols = stored.filter(symbol => 
        symbol && typeof symbol === 'object' && symbol.symbol
      );
      if (validSymbols.length > 0) {
        return validSymbols;
      }
    }
    return defaultSymbols;
  }

  // Get effective charts configuration (from backend or defaults)
  static async getCharts() {
    const stored = await ConfigStorage.getCharts();
    return (stored && stored.length > 0) ? stored : defaultCharts;
  }

  // Get effective chart config (from backend or defaults)
  static async getChartConfig() {
    const stored = await ConfigStorage.getChartConfig();
    return stored || defaultChartConfig;
  }

  // Save symbols to backend
  static async saveSymbols(symbols) {
    return await ConfigStorage.setSymbols(symbols);
  }

  // Save charts configuration to backend
  static async saveCharts(charts) {
    return await ConfigStorage.setCharts(charts);
  }

  // Save chart config to backend
  static async saveChartConfig(chartConfig) {
    return await ConfigStorage.setChartConfig(chartConfig);
  }


  // Get all configuration at once
  static async getAllConfig() {
    const [symbols, charts, chartConfig] = await Promise.all([
      this.getSymbols(),
      this.getCharts(),
      this.getChartConfig(),
    ]);
    
    return {
      symbols,
      charts,
      chartConfig,
    };
  }

  // Utility method to reset config to defaults
  static async clearStorageAndRestoreDefaults() {
    try {
      const defaultConfig = {
        symbols: defaultSymbols,
        charts: defaultCharts,
        chartConfig: defaultChartConfig,
      };
      
      await ConfigStorage.updateConfig({
        symbols: defaultSymbols,
        charts: defaultCharts,
        chartConfig: defaultChartConfig,
      });
      
      console.log('Reset config to defaults');
      return defaultConfig;
    } catch (error) {
      console.error('Failed to reset config:', error);
      return await this.getAllConfig();
    }
  }
}

export default ConfigManager;
