// Settings storage utility using localStorage
const SETTINGS_KEY = 'tradingview-app-settings';

const DEFAULT_SETTINGS = {
  chartCount: 6, // Default number of charts to display
  theme: 'dark',
  // Future settings can be added here
};

export class SettingsStorage {
  static getSettings() {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all required properties exist
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    }
    return DEFAULT_SETTINGS;
  }

  static updateSettings(newSettings) {
    try {
      const currentSettings = this.getSettings();
      const updatedSettings = { ...currentSettings, ...newSettings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
      return updatedSettings;
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
      return this.getSettings();
    }
  }

  static getSetting(key) {
    const settings = this.getSettings();
    return settings[key];
  }

  static setSetting(key, value) {
    return this.updateSettings({ [key]: value });
  }

  static resetSettings() {
    try {
      localStorage.removeItem(SETTINGS_KEY);
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
    return DEFAULT_SETTINGS;
  }
}

export default SettingsStorage;
