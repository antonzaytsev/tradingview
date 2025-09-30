// Config storage utility using backend API
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || '3021';
const BACKEND_URL = `${window.location.protocol}//${window.location.hostname}:${BACKEND_PORT}`;
const CONFIG_API = `${BACKEND_URL}/api/config`;

const DEFAULT_CONFIG = {
  theme: 'dark',
  // Chart configuration settings
  chartConfig: null, // Will use input.js defaults if null
  charts: null, // Will use input.js defaults if null
  symbols: null, // Will use input.js defaults if null
  // Future settings can be added here
};

export class ConfigStorage {
  static async getConfig() {
    try {
      const response = await fetch(CONFIG_API, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const config = await response.json();
        // Merge with defaults to ensure all required properties exist
        return { ...DEFAULT_CONFIG, ...config };
      } else {
        console.warn('Failed to load config from backend:', response.statusText);
      }
    } catch (error) {
      console.warn('Failed to load config from backend:', error);
    }
    return DEFAULT_CONFIG;
  }

  static async updateConfig(newConfig) {
    try {
      const currentConfig = await this.getConfig();
      const updatedConfig = { ...currentConfig, ...newConfig };
      
      const response = await fetch(CONFIG_API, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedConfig),
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to save config to backend:', response.statusText);
        return currentConfig;
      }
    } catch (error) {
      console.error('Failed to save config to backend:', error);
      return await this.getConfig();
    }
  }

  static async getConfigItem(key) {
    const config = await this.getConfig();
    return config[key];
  }

  static async setConfigItem(key, value) {
    return await this.updateConfig({ [key]: value });
  }


  // Specialized methods for trading configuration
  static async getSymbols() {
    return await this.getConfigItem('symbols');
  }

  static async setSymbols(symbols) {
    return await this.setConfigItem('symbols', symbols);
  }

  static async getCharts() {
    return await this.getConfigItem('charts');
  }

  static async setCharts(charts) {
    return await this.setConfigItem('charts', charts);
  }

  static async getChartConfig() {
    return await this.getConfigItem('chartConfig');
  }

  static async setChartConfig(chartConfig) {
    return await this.setConfigItem('chartConfig', chartConfig);
  }
}

export default ConfigStorage;
