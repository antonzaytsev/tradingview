import React, { createContext, useContext, useState } from 'react';
import SettingsStorage from '../lib/settings';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(SettingsStorage.getSettings());

  const updateSetting = (key, value) => {
    const updatedSettings = SettingsStorage.setSetting(key, value);
    setSettings(updatedSettings);
  };

  const updateSettings = (newSettings) => {
    const updatedSettings = SettingsStorage.updateSettings(newSettings);
    setSettings(updatedSettings);
  };

  const resetSettings = () => {
    const defaultSettings = SettingsStorage.resetSettings();
    setSettings(defaultSettings);
  };

  const value = {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
