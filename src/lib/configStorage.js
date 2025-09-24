// Config storage utility using localStorage
const CONFIG_KEY = 'tradingview-app-settings';

const DEFAULT_CONFIG = {
  chartCount: 6, // Default number of charts to display
  theme: 'dark',
  // Chart configuration settings
  chartConfig: null, // Will use input.js defaults if null
  charts: null, // Will use input.js defaults if null
  symbols: null, // Will use input.js defaults if null
  // Future settings can be added here
};

export class ConfigStorage {
  static getConfig() {
    try {
      const stored = localStorage.getItem(CONFIG_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all required properties exist
        return { ...DEFAULT_CONFIG, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load config from localStorage:', error);
    }
    return DEFAULT_CONFIG;
  }

  static updateConfig(newConfig) {
    try {
      const currentConfig = this.getConfig();
      const updatedConfig = { ...currentConfig, ...newConfig };
      localStorage.setItem(CONFIG_KEY, JSON.stringify(updatedConfig));
      return updatedConfig;
    } catch (error) {
      console.error('Failed to save config to localStorage:', error);
      return this.getConfig();
    }
  }

  static getConfigItem(key) {
    const config = this.getConfig();
    return config[key];
  }

  static setConfigItem(key, value) {
    return this.updateConfig({ [key]: value });
  }


  // Specialized methods for trading configuration
  static getSymbols() {
    return this.getConfigItem('symbols');
  }

  static setSymbols(symbols) {
    return this.setConfigItem('symbols', symbols);
  }

  static getCharts() {
    return this.getConfigItem('charts');
  }

  static setCharts(charts) {
    return this.setConfigItem('charts', charts);
  }

  static getChartConfig() {
    return this.getConfigItem('chartConfig');
  }

  static setChartConfig(chartConfig) {
    return this.setConfigItem('chartConfig', chartConfig);
  }
}

export default ConfigStorage;
